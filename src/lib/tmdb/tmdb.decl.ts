export enum TMDB_MEDIA_TYPE {
  SHOW = "tv",
  MOVIE = "movie",
  PERSON = "person"
}

export enum JOB {
  DIRECTOR = "Director",
  SERIES_DIRECTOR = "Series Director"
}

export interface GenreTMDB {
  id: number;
  name: string;
}

export enum BACKDROP_SIZE {
  "W300" = "w300",
  "W780" = "w780",
  "W1280" = "w1280",
  "ORIGINAL" = "original"
}

export enum POSTER_SIZE {
  "W92" = "w92",
  "W154" = "w154",
  "W185" = "w185",
  "W342" = "w342",
  "W500" = "w500",
  "W780" = "w780",
  "ORIGINAL" = "original"
}

export interface MovieMinTMDB {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  media_type: TMDB_MEDIA_TYPE.MOVIE;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date?: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface ShowMinTMDB {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  media_type: TMDB_MEDIA_TYPE.SHOW;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  first_air_date?: string;
  name: string;
  vote_average: number;
  vote_count: number;
}

export type MediaMinTMDB = MovieMinTMDB | ShowMinTMDB;

export interface MovieTMDB {
  adult: boolean;
  backdrop_path: string | null;
  belongs_to_collection: {
    id: number;
    name: string;
    poster_path: string;
    backdrop_path: string;
  };
  budget: number;
  genres: GenreTMDB[];
  homepage: string;
  id: number;
  imdb_id: string | null;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  production_companies: ProductionCompanyTMDB[];
  production_countries: ProductionCountryTMDB[];
  release_date: string | null;
  revenue: number;
  runtime: number;
  spoken_languages: SpokenLanguageTMDB[];
  status: string;
  tagline: string;
  title: string;
  video: false;
  vote_average: number;
  vote_count: number;
  credits: CreditsTMDB;
  director: string | null;
}

export interface SpokenLanguageTMDB {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface ProductionCountryTMDB {
  iso_3166_1: string;
  name: string;
}

export interface ProductionCompanyTMDB {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

export interface CreditsTMDB {
  id: number;
  cast: CastTMDB[];
  crew: CrewTMDB[];
}

export interface CrewTMDB {
  adult: boolean;
  gender: string;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  credit_id: string;
  department: string;
  job: JOB;
}

export interface CastTMDB {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}

export interface SearchResultTMDB<T = MovieMinTMDB> {
  results: T[];
  page: number;
  total_pages: number;
  total_results: number;
}

export interface ShowTMDB {
  id: number;
  adult: boolean;
  backdrop_path: string | null;
  created_by: CreatedByTMDB[];
  episode_run_time: number[];
  first_air_date: string | null;
  genres: GenreTMDB[];
  external_ids: ExternalIds;
  homepage: string;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  name: string;
  imdb_id: string | null;
  last_episode_to_air: EpisodeTMDB | null;
  next_episode_to_air: EpisodeTMDB | null;
  networks: NetworkTMDB[];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  origin_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  production_companies: ProductionCompanyTMDB[];
  production_countries: ProductionCountryTMDB[];
  seasons: SeasonTMDB[];
  spoken_languages: SpokenLanguageTMDB[];
  status: string;
  tagline: string;
  type: string;
  vote_average: number;
  vote_count: number;
  credits: CreditsTMDB;
}

export interface CreatedByTMDB {
  id: number;
  credit_id: string;
  name: string;
  gender: number;
  profile_path: string | null;
}

export interface ExternalIds {
  imdb_id: string | null;
  freebase_mid: string | null;
  freebase_id: string | null;
  tvdb_id: number | null;
  tvrage_id: number | null;
  wikidata_id: string | null;
  facebook_id: string | null;
  instagram_id: string | null;
  twitter_id: string | null;
}

export interface EpisodeTMDB {
  id: number;
  name: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  air_date: string;
  episode_number: number;
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string | null;
}

export interface NetworkTMDB {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface SeasonTMDB {
  air_date: string | null;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
}

// Union types for handling both movies and TV shows
export type MediaTMDB = MovieTMDB | ShowTMDB;
