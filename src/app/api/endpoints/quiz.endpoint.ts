import { ENDPOINTS } from "@/app/api/constants/endpoints";
import { apiClient } from "@/app/api/utils/client";

export interface ChatHistoryMessage {
  role: "assistant" | "user";
  content: string;
}

export interface ExtractedProfile {
  skinType: string;
  concerns: string[];
  sensitivity: string;
  sunExposure: string;
  goals: string[];
}

export interface AiChatRequest {
  messages: ChatHistoryMessage[];
  currentProfile: ExtractedProfile;
}

export interface AiChatResponse {
  message: string;
  extractedProfile?: Partial<ExtractedProfile>;
  suggestions?: string[];
  isComplete?: boolean;
}

export interface SubmitQuizPayload {
  skinType: string;
  concerns: string[];
  sensitivity: string;
  sunExposure: string;
}

// 1. Send chat message to AI aesthetician
export async function sendAiChatMessage(data: AiChatRequest): Promise<AiChatResponse> {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 90000);

  try {
    const rawRes = await fetch(`${BASE_URL}${ENDPOINTS.QUIZ.CHAT}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!rawRes.ok) {
      const errBody = await rawRes.text();
      throw new Error(errBody || `Server error ${rawRes.status}`);
    }

    return await rawRes.json();
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// 2. Submit extracted quiz profile to assemble routine
export async function submitQuizRoutine(data: SubmitQuizPayload): Promise<Record<string, unknown>> {
  return apiClient.request<Record<string, unknown>>(ENDPOINTS.QUIZ.SUBMIT, undefined, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
