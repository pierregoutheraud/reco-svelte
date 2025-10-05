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
  mood: "comedy" | "drama" | "action" | "scifi_fantasy" | "horror" | "mystery";
  discovery: "popular" | "hidden" | "surprise";
  duration: "under_2_hours" | "it_doesnt_matter";
  favorite_movie?: string;
  count?: number;
}
