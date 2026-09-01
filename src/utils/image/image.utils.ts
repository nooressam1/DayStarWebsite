/**
 * Utility functions for validating and sanitizing image URLs
 */

export function isValidImageUrl(url?: string | null): boolean {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  // Filter out empty, expired local blob URLs, or data URLs that Next Image cannot optimize
  if (
    trimmed === "" ||
    trimmed.startsWith("blob:") ||
    trimmed.startsWith("data:")
  ) {
    return false;
  }
  // Must start with http, https, or /
  return (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("/")
  );
}

export function sanitizeImageUrl(
  url?: string | null,
  fallback = "/no-image.png"
): string {
  return isValidImageUrl(url) ? url!.trim() : fallback;
}

export function sanitizeProductImage(
  images?: (string | null | undefined)[] | null,
  fallback = "/no-image.png"
): string {
  if (!Array.isArray(images) || images.length === 0) return fallback;
  const valid = images.find((img) => isValidImageUrl(img));
  return valid ? valid.trim() : fallback;
}
