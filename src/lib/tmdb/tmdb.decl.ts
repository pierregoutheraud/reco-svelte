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
