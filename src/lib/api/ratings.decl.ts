import type { MovieTMDB, ShowTMDB } from "../tmdb/tmdb.decl";

export interface RatingsResponse {
  tmdbId: number;
  imdbId: string;
  lastUpdated: number;
  ratings: CrawlerRatings;
  media: MovieTMDB | ShowTMDB;
}

export enum CRAWLER_SOURCE {
  AVERAGE = "average",
  IMDB = "imdb",
  ROTTEN_TOMATOES = "rotten_tomatoes",
  METACRITIC = "metacritic",
  LETTERBOXD = "letterboxd",
  ALLOCINE = "allocine"
}

export interface ImdbSource {
  score: number | null;
  reviewsCount: number | null;
  url: string | null;
}

export interface MetacriticSource {
  metascore: number | null;
  userScore: number | null;
  averageScore: number | null;
  url: string | null;
}

export interface RottenTomatoesSource {
  tomatometer: number | null;
  tomatometerReviewsCount: number | null;
  audienceScore: number | null;
  audienceScoreReviewsCount: number | null;
  averageScore: number | null;
  url: string | null;
}

export interface LetterboxdSource {
  score: number | null;
  url: string | null;
}

export interface AllocineSource {
  pressScore: number | null;
  spectatorsScore: number | null;
  averageScore: number | null;
  url: string | null;
}

export interface AverageSource {
  score: number | null;
}

export interface CrawlerRatings {
  [CRAWLER_SOURCE.IMDB]: ImdbSource | null;
  [CRAWLER_SOURCE.METACRITIC]: MetacriticSource | null;
  [CRAWLER_SOURCE.ROTTEN_TOMATOES]: RottenTomatoesSource | null;
  [CRAWLER_SOURCE.LETTERBOXD]: LetterboxdSource | null;
  [CRAWLER_SOURCE.ALLOCINE]: AllocineSource | null;
  [CRAWLER_SOURCE.AVERAGE]: AverageSource | null;
}

export interface CrawlerMedia {
  imdbId: string;
  tmdbId: number;
  mediaTmdb: MovieTMDB | ShowTMDB;
  ratings: CrawlerRatings;
}

export interface RatingsResponse {
  tmdbId: number;
  imdbId: string;
  lastUpdated: number;
  ratings: CrawlerRatings;
  media: MovieTMDB | ShowTMDB;
}
