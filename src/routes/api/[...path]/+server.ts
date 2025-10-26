import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { validateOrigin } from "$lib/server/validateOrigin";

const BACKEND_URL = "https://miru-bun-server.fly.dev";

// Generic handler that proxies any HTTP method to the backend
async function handleRequest(
  request: Request,
  path: string,
  url: URL
): Promise<Response> {
  // Validate that request comes from allowed origin
  validateOrigin(request);

  try {
    // Build the full backend URL with the same path and query params
    const backendUrl = `${BACKEND_URL}/${path}${url.search}`;

    // Forward the request to backend with the same method, headers, and body
    const response = await fetch(backendUrl, {
      method: request.method,
      headers: {
        "Content-Type": "application/json"
      },
      body:
        request.method !== "GET" && request.method !== "HEAD"
          ? await request.text()
          : undefined
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend API error:", response.status, errorText);
      error(response.status, {
        message: `Backend API error: ${response.statusText}`
      });
    }

    // For streaming responses, pass through the stream
    if (
      response.headers.get("content-type")?.includes("stream") ||
      path.includes("stream")
    ) {
      return new Response(response.body, {
        status: response.status,
        headers: {
          "Content-Type":
            response.headers.get("content-type") || "application/json",
          "Transfer-Encoding": "chunked"
        }
      });
    }

    // For regular responses, return the JSON
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (err) {
    console.error("Error proxying request:", err);
    error(500, { message: "Failed to proxy request to backend" });
  }
}

export const GET: RequestHandler = async ({ params, url, request }) => {
  return handleRequest(request, params.path, url);
};

export const POST: RequestHandler = async ({ params, url, request }) => {
  return handleRequest(request, params.path, url);
};

export const PUT: RequestHandler = async ({ params, url, request }) => {
  return handleRequest(request, params.path, url);
};

export const DELETE: RequestHandler = async ({ params, url, request }) => {
  return handleRequest(request, params.path, url);
};

export const PATCH: RequestHandler = async ({ params, url, request }) => {
  return handleRequest(request, params.path, url);
};
