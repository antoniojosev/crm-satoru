/**
 * Helper function to construct full URLs for images served by the backend
 * Works in both development and production environments
 *
 * Static files are served from /uploads/ directly, NOT under /api or /api/v1 prefix
 */
export function getImageUrl(imageUrl: string | undefined): string {
  if (!imageUrl) return '';

  // If already a full URL, return as-is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // Get the API URL from environment
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

  // Extract base URL by removing all API-related paths
  // This handles: /api/v1, /api, /v1, or any combination
  let baseUrl = apiUrl;

  // Remove trailing slashes first
  baseUrl = baseUrl.replace(/\/+$/, '');

  // Remove API prefixes (try multiple patterns to be safe)
  baseUrl = baseUrl.replace(/\/api\/v\d+$/, '');  // Remove /api/v1, /api/v2, etc.
  baseUrl = baseUrl.replace(/\/api$/, '');         // Remove /api
  baseUrl = baseUrl.replace(/\/v\d+$/, '');        // Remove /v1, /v2, etc.

  // Ensure imageUrl starts with /
  const normalizedImageUrl = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;

  // Construct final URL: https://example.com + /uploads/projects/file.jpg
  return `${baseUrl}${normalizedImageUrl}`;
}
