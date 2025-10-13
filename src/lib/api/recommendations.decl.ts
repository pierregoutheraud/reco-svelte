export interface Recommendation {
  title: string;
  year: number;
  reason: string;
}

export interface RecommendationMetadata {
  aiTime: number;
  cost?: {
    total: number;
    inputTokens: number;
    outputTokens: number;
    model: string;
  };
}

export interface RecommendationResponse {
  success: boolean;
  recommendations?: Recommendation[];
  metadata?: RecommendationMetadata;
  error?: string;
}

export interface RecommendationRequest {
  era: [number, number];
  mood:
    | "light_funny"
    | "romantic"
    | "thoughtful_deep"
    | "action_packed"
    | "tense_twisty"
    | "scary"
    | "wonder_worlds";
  discovery: "popular" | "hidden" | "surprise";
  duration: "under_2_hours" | "it_doesnt_matter";
  inspiration_movies_ids?: number[];
  liked_movies_ids?: number[];
  disliked_movies_ids?: number[];
  already_recommended_movies_ids?: number[];
  recommendations_count?: number;
  locale?: "en" | "fr";
  reasoning_effort?: "minimal" | "low" | "medium" | "high";
}
