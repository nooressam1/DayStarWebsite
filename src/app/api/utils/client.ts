import { createClient } from '@/utils/supabase/client';
import { useAuthModalStore } from '@/app/api/hooks/useAuthModalStore';
import { toast } from 'sonner';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const DEFAULT_TIMEOUT = Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 60000;

export interface ApiResponseWrapper<T> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface ApiPaginatedResponseWrapper<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export async function clearAuthData(): Promise<void> {
  // Clear Supabase session
  try {
    const supabase = createClient();
    await supabase.auth.signOut();
  } catch (error) {
    console.warn("Could not sign out from Supabase:", error);
  }

  // Clear standard cookies
  if (typeof document !== "undefined") {
    document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
    document.cookie = "refreshToken=; path=/; max-age=0; SameSite=Lax";
    document.cookie = "user=; path=/; max-age=0; SameSite=Lax";
  }

  // Clear localStorage and reset Zustand Cart
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("daystore-cart-storage");
  }

  try {
    const { useCartStore } = await import("@/app/api/hooks/useCartStore");
    useCartStore.getState().resetLocalCart();
  } catch {
    // Ignore if store not initialized
  }
}

export class ApiClient {
  private static instance: ApiClient;
  private baseUrl: string;
  private timeout: number;

  private constructor(baseUrl: string = BASE_URL, timeout: number = DEFAULT_TIMEOUT) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  /**
   * Merge headers and filter out undefined values
   * This allows explicitly setting a header to undefined to remove it
   */
  private async mergeHeaders(customHeaders?: HeadersInit): Promise<Record<string, string>> {
    const merged: Record<string, string> = {
      "Content-Type": "application/json",
      "Accept": "application/json",
    };

    // Attach Supabase access token if available
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.access_token) {
        merged["Authorization"] = `Bearer ${session.access_token}`;
      }
    } catch (error) {
      console.warn("Could not retrieve Supabase session:", error);
    }

    // Fallback to localStorage if available
    if (!merged["Authorization"] && typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        merged["Authorization"] = `Bearer ${token}`;
      }
    }

    // Handle different HeadersInit types
    if (customHeaders) {
      if (customHeaders instanceof Headers) {
        customHeaders.forEach((value, key) => {
          merged[key] = value;
        });
      } else if (Array.isArray(customHeaders)) {
        customHeaders.forEach(([key, value]) => {
          merged[key] = value;
        });
      } else if (typeof customHeaders === "object") {
        Object.entries(customHeaders).forEach(([key, value]) => {
          if (value !== undefined) {
            merged[key] = value;
          } else {
            // If explicitly set to undefined, remove the header
            delete merged[key];
          }
        });
      }
    }

    return merged;
  }

  async request<T>(
    endpoint: string,
    params?: Record<string, string>,
    options: RequestInit = {},
    cacheConfig?: {
      revalidate?: number | false | undefined;
      tags?: string[];
    }
  ): Promise<T> {
    if (params) {
      const searchParams = new URLSearchParams(params);
      endpoint = `${endpoint}?${searchParams.toString()}`;
    }
    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const headers = await this.mergeHeaders(options.headers);
      if (options.body && options.body instanceof FormData) {
        delete headers["Content-Type"];
      }

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
        next: cacheConfig,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw await this.handleError(response);
      }

      const apiResponse: ApiResponseWrapper<T> = await response.json();

      // Check if the API response indicates success
      // Some endpoints don't include the success field, so we assume success if the response has the expected structure
      if (apiResponse.success === false) {
        throw {
          message: apiResponse.message || "API request failed",
          status: response.status,
          details: apiResponse,
        };
      }

      // Return the unwrapped data
      // fallback to apiResponse itself if data is undefined (to support direct non-wrapped responses from NestJS)
      return apiResponse.data !== undefined ? apiResponse.data : (apiResponse as unknown as T);
    } catch (error) {
      clearTimeout(timeoutId);
      throw await this.handleError(error);
    }
  }

  /**
   * Make a request for paginated data and return unwrapped paginated response
   */
  async requestPaginated<T>(
    endpoint: string,
    params?: Record<string, string>,
    options: RequestInit = {},
    cacheConfig?: {
      revalidate?: number | false | undefined;
      tags?: string[];
    }
  ): Promise<ApiPaginatedResponseWrapper<T>> {
    if (params) {
      const searchParams = new URLSearchParams(params);
      endpoint = `${endpoint}?${searchParams.toString()}`;
    }
    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const headers = await this.mergeHeaders(options.headers);
      if (options.body && options.body instanceof FormData) {
        delete headers["Content-Type"];
      }

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
        next: cacheConfig,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw await this.handleError(response);
      }

      const apiResponse: ApiResponseWrapper<ApiPaginatedResponseWrapper<T>> =
        await response.json();

      if (apiResponse.success === false) {
        throw {
          message: apiResponse.message || "API request failed",
          status: response.status,
          details: apiResponse,
        };
      }

      return apiResponse.data;
    } catch (error) {
      clearTimeout(timeoutId);
      throw await this.handleError(error);
    }
  }

  /**
   * Make a request for direct paginated data (not wrapped in an API response structure)
   */
  async requestDirectPaginated<T>(
    endpoint: string,
    params?: Record<string, string>,
    options: RequestInit = {},
    cacheConfig?: {
      revalidate?: number | false | undefined;
      tags?: string[];
    }
  ): Promise<PaginatedResponse<T>> {
    if (params) {
      const searchParams = new URLSearchParams(params);
      endpoint = `${endpoint}?${searchParams.toString()}`;
    }
    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const headers = await this.mergeHeaders(options.headers);
      if (options.body && options.body instanceof FormData) {
        delete headers["Content-Type"];
      }

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
        next: cacheConfig,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw await this.handleError(response);
      }

      // Response is already in the expected paginated format
      const directResponse = await response.json();

      // Return the data in the expected format
      return {
        data: directResponse.data,
        pagination: {
          total: directResponse.total,
          page: directResponse.page,
          limit: directResponse.limit,
          totalPages: directResponse.totalPages,
          hasPreviousPage: directResponse.hasPreviousPage,
          hasNextPage: directResponse.hasNextPage,
        },
      };
    } catch (error) {
      clearTimeout(timeoutId);
      throw await this.handleError(error);
    }
  }

  /**
   * Make a request and return the full API response (including message and success)
   */
  async requestFull<T>(
    endpoint: string,
    params?: Record<string, string>,
    options: RequestInit = {},
    cacheConfig?: {
      revalidate?: number | false | undefined;
      tags?: string[];
    }
  ): Promise<ApiResponseWrapper<T>> {
    if (params) {
      const searchParams = new URLSearchParams(params);
      endpoint = `${endpoint}?${searchParams.toString()}`;
    }
    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const headers = await this.mergeHeaders(options.headers);
      if (options.body && options.body instanceof FormData) {
        delete headers["Content-Type"];
      }

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
        next: cacheConfig,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw await this.handleError(response);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw await this.handleError(error);
    }
  }

  /**
   * Handle 401 Unauthorized errors by clearing auth and redirecting to login
   */
  private handle401Error(): void {
    if (typeof window !== "undefined") {
      // Clear all auth data (cookies and localStorage)
      clearAuthData();

      // In this website we use AuthModal rather than redirecting
      try {
        useAuthModalStore.getState().openModal("login");
      } catch (error) {
        console.error("Error opening auth modal:", error);
      }
    }
  }

  /**
   * Handle validation errors by displaying toast notifications
   * Expects error format: { errors: { fieldName: "error message" } }
   * OR: { errors: { message, error, statusCode } } (only displays message)
   *
   * Special error keys that should NOT show toast (handled by component):
   * - is_already_exist: Email already registered
   * - request_pending: Registration request pending review
   */
  private handleValidationErrors(errorData: unknown): boolean {
    if (typeof window === "undefined") {
      return false; // Don't show toasts on server side
    }

    if (
      typeof errorData === "object" &&
      errorData !== null &&
      "errors" in errorData
    ) {
      const errors = (errorData as { errors: Record<string, unknown> }).errors;

      if (typeof errors === "object" && errors !== null) {
        // Check if this is the API error format: { message, error, statusCode }
        if ("message" in errors && "error" in errors && "statusCode" in errors) {
          const errorMessage = errors.message as string;

          // Skip toast for specific registration error keys that should be handled by the modal
          const suppressedErrorKeys = ['is_already_exist', 'request_pending'];
          if (suppressedErrorKeys.includes(errorMessage)) {
            // Return false to let the error propagate to the component
            return false;
          }

          // Only display the message field for other errors, ignore error and statusCode
          toast.error(errorMessage);
          return true;
        }

        // Check if this is the keyed validation format: { message, key }
        if (
          "message" in errors &&
          "key" in errors &&
          !("error" in errors) &&
          !("statusCode" in errors)
        ) {
          toast.error(`${errors.key}: ${errors.message}`);
          return true;
        }

        // Display each validation error as a toast (field-level validation)
        Object.entries(errors).forEach(([field, message]) => {
          const formattedField = field.charAt(0).toUpperCase() + field.slice(1);
          toast.error(`${formattedField}: ${message}`);
        });
        return true;
      }
    }
    return false;
  }

  private async handleError(error: unknown): Promise<never> {
    if (error instanceof Response) {
      // Handle 401 Unauthorized - token expired or invalid
      if (error.status === 401) {
        this.handle401Error();
      }

      try {
        const errorData: ApiResponseWrapper<unknown> = await error.json();

        // Check for validation errors and display them as toasts
        this.handleValidationErrors(errorData);

        // Extract error message from different formats
        let errorMessage = "An error occurred";

        // Check for { errors: { message, error, statusCode } } format
        if (
          typeof errorData === "object" &&
          errorData !== null &&
          "errors" in errorData &&
          typeof (errorData as { errors: unknown }).errors === "object" &&
          (errorData as { errors: Record<string, unknown> }).errors !== null
        ) {
          const errors = (errorData as { errors: Record<string, unknown> }).errors;
          if ("message" in errors && typeof errors.message === "string") {
            errorMessage = errors.message;
          }
        }
        // Check for { success: false, message } format
        else if (
          typeof errorData === "object" &&
          errorData !== null &&
          "success" in errorData &&
          !errorData.success &&
          "message" in errorData
        ) {
          errorMessage = (errorData.message as string) || errorMessage;
        }
        // Fallback: check for top-level message
        else if (
          typeof errorData === "object" &&
          errorData !== null &&
          "message" in errorData &&
          typeof (errorData as { message: unknown }).message === "string"
        ) {
          errorMessage = (errorData as { message: string }).message || errorMessage;
        }

        throw {
          message: errorMessage,
          status: error.status,
          details: errorData,
        };
      } catch (parseError) {
        // If JSON parsing fails, check if it's our thrown error
        if (
          typeof parseError === "object" &&
          parseError !== null &&
          "message" in parseError &&
          "status" in parseError
        ) {
          throw parseError;
        }
        // Otherwise use generic error
        throw {
          message: "An error occurred",
          status: error.status,
          details: { statusText: error.statusText },
        };
      }
    }

    if (error instanceof Error && error.name === "AbortError") {
      throw {
        message: "Request timeout",
        status: 408,
      };
    }

    // If it's already a formatted error (from the success check), re-throw it
    if (
      typeof error === "object" &&
      error !== null &&
      "message" in error &&
      "status" in error
    ) {
      // Check for 401 in formatted errors too
      if ((error as { status: number }).status === 401) {
        this.handle401Error();
      }
      throw error;
    }

    throw {
      message:
        (error instanceof Error ? error.message : "Network error") ||
        "Network error",
      status: 500,
    };
  }
}

export const apiClient = ApiClient.getInstance();
