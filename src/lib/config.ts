/**
 * Application configuration
 */

export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_URL || "http://localhost:3000"
  }
} as const;
