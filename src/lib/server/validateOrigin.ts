import { error } from "@sveltejs/kit";
import { dev } from "$app/environment";

/**
 * Validates that the request comes from an allowed origin
 * This prevents other websites from calling your API routes
 */
export function validateOrigin(request: Request): void {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  // Define allowed origins
  const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:4173",
    "http://127.0.0.1:5173",
    "https://reco.miru.live"
  ];

  // Check origin header first (sent by browsers for CORS requests)
  if (origin) {
    if (!allowedOrigins.includes(origin)) {
      console.warn(`Blocked request from unauthorized origin: ${origin}`);
      error(403, { message: "Forbidden: Invalid origin" });
    }
    return;
  }

  // Fallback to referer header (sent by browsers for navigation)
  if (referer) {
    const isAllowed = allowedOrigins.some((allowed) =>
      referer.startsWith(allowed)
    );
    if (!isAllowed) {
      console.warn(`Blocked request from unauthorized referer: ${referer}`);
      error(403, { message: "Forbidden: Invalid referer" });
    }
    return;
  }

  // No origin or referer - could be a direct API call (non-browser)
  // In dev mode, allow for testing convenience
  // In production, block for security
  if (!dev) {
    console.warn("Blocked request with no origin or referer header");
    error(403, { message: "Forbidden: Missing origin headers" });
  }
}
