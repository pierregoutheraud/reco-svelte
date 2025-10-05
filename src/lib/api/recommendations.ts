import type {
  RecommendationRequest,
  RecommendationResponse
} from "$lib/api/recommendations.decl";
import { config } from "$lib/config";

/**
 * Fetch movie recommendations from the API
 */
export async function fetchAiRecommendations(
  request: RecommendationRequest,
  mock = false
): Promise<RecommendationResponse> {
  if (mock) {
    return fetchAiRecommendationsMock();
  }

  const response = await fetch(`${config.api.baseUrl}/recommend`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function fetchAiRecommendationsMock(
  ...args: any[]
): Promise<RecommendationResponse> {
  return {
    success: true,
    recommendations: [
      {
        title: "Ghost in the Shell",
        year: 1995,
        reason:
          "A landmark animated sci-fi that directly explores consciousness, identity, and the blurred line between human and machine — themes any Matrix fan will recognize. Widely acclaimed for its visuals and philosophical depth, it's a compact, influential film perfect for escaping into a cyberpunk world."
      },
      {
        title: "Dark City",
        year: 1998,
        reason:
          "A moody, visually striking noir-sci-fi about a man discovering his reality is fabricated; it shares The Matrix's paranoid, world-bending tone and slow-burn mystery. Critics praise its atmosphere and imagination, and its tight 100-minute runtime makes it an engrossing escape."
      },
      {
        title: "eXistenZ",
        year: 1999,
        reason:
          "David Cronenberg's surreal thriller about immersive game worlds toys with layers of reality and bodily experience in a way that will appeal to viewers craving virtual-reality mind games. It's a provocative, critically noted film that keeps you guessing to the end."
      },
      {
        title: "The Truman Show",
        year: 1998,
        reason:
          "A mainstream, acclaimed take on a life lived inside an artificially constructed reality; it combines emotional stakes with satirical speculation about surveillance and manufactured worlds. Its inventive premise and strong performances make it an accessible, thought-provoking escape."
      },
      {
        title: "Total Recall",
        year: 1990,
        reason:
          "A high-concept sci-fi adventure built around implanted memories and questions of what's real, offering bold action alongside philosophical hooks that echo Matrix-style reality doubt. Popular, influential, and under two hours, it's a rollicking ride for anyone wanting an intense escape."
      }
    ],
    metadata: {
      aiTime: 30518.62175000005,
      cost: {
        total: 0.0028244999999999998,
        inputTokens: 282,
        outputTokens: 1377,
        model: "gpt-5-mini"
      }
    }
  };
}
