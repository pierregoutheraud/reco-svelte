import { TMDB_MEDIA_TYPE } from "$lib/tmdb/tmdb.decl";

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
  media_type: TMDB_MEDIA_TYPE.MOVIE | TMDB_MEDIA_TYPE.SHOW;
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
  inspiration_media_keys?: string[];
  liked_medias_keys?: string[];
  disliked_medias_keys?: string[];
  already_recommended_medias_keys?: string[];
  recommendations_count?: number;
  locale?: "en" | "fr";
  reasoning_effort?: "minimal" | "low" | "medium" | "high";
}
