/**
 * Helper function to construct full URLs for images served by the backend
 * Works in both development and production environments
 */
export function getImageUrl(imageUrl: string | undefined): string {
  if (!imageUrl) return '';

  // If already a full URL, return as-is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // Get the API URL from environment
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

  // Remove /api or /api/v1 suffix to get base URL
  // This handles both /api and /api/v1 prefixes
  const baseUrl = apiUrl.replace(/\/api(\/v1)?$/, '');

  // Ensure imageUrl starts with /
  const normalizedImageUrl = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;

  // Construct final URL
  return `${baseUrl}${normalizedImageUrl}`;
}
