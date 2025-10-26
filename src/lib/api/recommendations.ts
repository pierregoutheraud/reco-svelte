import type {
  RecommendationRequest,
  RecommendationResponse
} from "$lib/api/recommendations.decl";

/**
 * Fetch movie recommendations from the API (non-streaming)
 */
export async function fetchAiRecommendations(
  request: RecommendationRequest,
  options: { mock: boolean } = { mock: false }
): Promise<RecommendationResponse> {
  if (options?.mock) {
    return fetchAiRecommendationsMock();
  }

  // Call local SvelteKit API proxy instead of backend directly
  const response = await fetch("/api/recommend", {
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

/**
 * Stream movie recommendations from the API
 * Calls onUpdate with partial recommendations as they're generated
 */
export async function streamAiRecommendations(
  request: RecommendationRequest,
  onUpdate: (recommendations: RecommendationResponse["recommendations"]) => void
): Promise<void> {
  // Call local SvelteKit API proxy instead of backend directly
  const response = await fetch("/api/recommend/stream", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  if (!response.body) {
    throw new Error("No response body");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      // Append new data to buffer
      buffer += decoder.decode(value, { stream: true });

      // Split by newlines to get complete JSON objects
      const lines = buffer.split("\n");

      // Keep the last incomplete line in the buffer
      buffer = lines.pop() ?? "";

      // Process each complete line
      for (const line of lines) {
        if (line.trim()) {
          try {
            const partialObject = JSON.parse(line);
            // Call the update callback with the recommendations array
            if (partialObject.recommendations) {
              onUpdate(partialObject.recommendations);
            }
          } catch (error) {
            console.error("Failed to parse JSON line:", line, error);
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

export async function fetchAiRecommendationsMock(): Promise<RecommendationResponse> {
  return {
    success: true,
    recommendations: [
      {
        title: "The One I Love",
        year: 2014,
        reason:
          "A quietly unnerving, relationship-focused mind-bender that blends intimate character work with uncanny suspense — perfect if you liked the emotional subtlety of Her. Its short runtime and contained setting create slow-burning tension that steadily escalates into psychological mystery. A true under-the-radar gem that rewards repeat viewing."
      },
      {
        title: "The Invitation",
        year: 2015,
        reason:
          "A masterclass in slow-burn dread set almost entirely at a dinner party; the film builds social and psychological suspense in the same quiet, human register as Perfect Days but with menace. It’s subtle, expertly acted, and keeps you unsure whom to trust until the very end. Widely praised by critics yet still a sleeper hit among general audiences."
      },
      {
        title: "Primer",
        year: 2004,
        reason:
          "Extremely compact and cerebral low-budget time-travel drama that will appeal to a fan of Coherence and Timecrimes with its puzzle-box plotting and intimate, realistic tone. At 77 minutes it’s dense, claustrophobic, and rewards careful attention. A true cult classic that many mainstream viewers have still yet to discover."
      },
      {
        title: "They Look Like People",
        year: 2015,
        reason:
          "A deeply intimate psychological horror about friendship, paranoia, and mental breakdown that favors mood and character over jump scares — echoing the human-focused melancholy of Her and Perfect Days. Short and unsettling, it creates ongoing dread through performance and atmosphere rather than spectacle. Underrated and emotionally resonant."
      },
      {
        title: "Lake Mungo",
        year: 2008,
        reason:
          "An Australian faux-documentary that delivers a quietly devastating, eerie atmosphere and creeping suspense about grief and the supernatural. Its restrained, melancholic tone and short runtime make it haunting rather than flashy, aligning with your taste for contemplative films that quietly unnerve. A modern cult favorite that many viewers overlook."
      },
      {
        title: "A Dark Song",
        year: 2016,
        reason:
          "A slow, intense two-hander about ritual and psychological endurance that trades jump scares for mounting claustrophobic tension and moral ambiguity. Its focus on process, character, and a confined setting mirrors the intimate pacing you appreciated in Perfect Days and Her while delivering genuine dread. Critically admired but flew under most mainstream radars."
      },
      {
        title: "The Autopsy of Jane Doe",
        year: 2016,
        reason:
          "A tightly constructed, contained horror set in a mortuary that builds escalating suspense through atmosphere, small reveals, and potent performances — all within a brisk runtime. The film’s focus on procedural detail and mounting unease makes it suspenseful without relying on excess. Well-reviewed but underrated by broader audiences."
      },
      {
        title: "Absentia",
        year: 2011,
        reason:
          "A low-budget, emotionally driven supernatural thriller that mixes grief, urban dread, and mystery in a hushed, unnerving manner similar to Coherence’s indie sensibility. It uses minimal effects and strong character work to generate genuine suspense across a compact runtime. A Bloomhouse-era sleeper hit worth seeking out."
      },
      {
        title: "The Canal",
        year: 2014,
        reason:
          "A moody Irish psychological horror about memory, paranoia, and photographic evidence that slowly tightens into claustrophobic dread; its melancholic lead performance and intimate scale align with your taste for contemplative, human-centered films. Underseen internationally yet praised for its atmosphere and construction. Runs well under two hours and sustains tension effectively."
      },
      {
        title: "The Endless",
        year: 2017,
        reason:
          "An inventive, indie sci-fi/horror hybrid about two brothers revisiting a cult that blends cosmic unease with intimate character drama, evoking Coherence’s communal mystery and the quiet emotional stakes of Her. At 111 minutes it’s compact for its ambitions, balancing weirdness and human connection in a way that rewards thoughtful viewers. A beloved modern indie that remains a hidden gem for many."
      }
    ],
    metadata: {
      aiTime: 33697.134667000006,
      cost: {
        total: 0.0043675,
        inputTokens: 374,
        outputTokens: 2137,
        model: "gpt-5-mini"
      }
    }
  };
}
