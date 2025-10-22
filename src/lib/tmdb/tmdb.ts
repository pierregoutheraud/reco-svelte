import PQueue from "p-queue";
import {
  BACKDROP_SIZE,
  JOB,
  POSTER_SIZE,
  type MovieMinTMDB,
  type MovieTMDB,
  type ShowTMDB,
  type SearchResultTMDB,
  TMDB_MEDIA_TYPE,
  type MediaKey,
  type MediaTMDB
} from "./tmdb.decl";
import { getLocale } from "$lib/paraglide/runtime.js";
import { isTruthy } from "../../helpers/types.helpers";

const tmdbQueue = new PQueue({
  intervalCap: 40,
  interval: 1000
}); // no rate limit

const API_KEY = "1dafeeb8a6633e80399bd6c764873dd1";

export async function tmdbCall<T>(
  endpoint: string,
  params: Record<string, string | number> = {},
  language: string = getLocale()
): Promise<T | null> {
  return tmdbQueue.add(async () => {
    const urlParams = new URLSearchParams({
      language,
      ...params
    }).toString();

    const res = await fetch(
      `https://api.themoviedb.org/3${endpoint}?api_key=${API_KEY}&${urlParams}`
    );

    if (!res.ok) {
      return null;
    }

    const data = await res.json();

    if (!data || ("success" in data && data.success === false)) {
      return null;
    }

    return data;
  });
}

export async function searchMovieByTitle(
  title: string,
  year?: number,
  language?: string
) {
  const dataSearch = await tmdbCall<SearchResultTMDB>(
    "/search/movie",
    {
      query: title,
      // ...(year && { primary_release_year: year })
      ...(year && { year })
    },
    language
  );

  if (!dataSearch || !dataSearch.results?.length) {
    console.error("searchMoviesByTitle found 0 movies for:", title);
    return null;
  }

  return dataSearch.results[0];
}

export async function searchMoviesByTitle(
  title: string,
  year?: number,
  limit = 5,
  language?: string
) {
  const dataSearch = await tmdbCall<SearchResultTMDB>(
    "/search/movie",
    {
      query: title,
      ...(year && { primary_release_year: year })
    },
    language
  );

  if (!dataSearch || !dataSearch.results?.length) {
    return [];
  }

  return dataSearch.results.slice(0, limit);
}

export function getPosterUrl(
  path: string,
  size: { width?: number; height?: never } | { height?: number; width?: never }
) {
  const { width, height } = size;

  let w: number | undefined;
  if (width) {
    w = width;
  } else if (height) {
    w = height * (2 / 3);
  }

  if (!w) {
    throw new Error("getPosterUrl: width or height must be defined");
  }

  // We take twice the size of the poster to have a better quality
  w *= 2;

  let posterSize = POSTER_SIZE.W342;
  if (w <= 92) {
    posterSize = POSTER_SIZE.W92;
  } else if (w <= 185) {
    posterSize = POSTER_SIZE.W185;
  } else if (w <= 342) {
    posterSize = POSTER_SIZE.W342;
  } else if (w <= 500) {
    posterSize = POSTER_SIZE.W500;
  } else {
    posterSize = POSTER_SIZE.W780;
  }

  return getImageUrl(path, posterSize);
}

export function getImageUrl(
  path: string,
  size: BACKDROP_SIZE | POSTER_SIZE = POSTER_SIZE.W154
) {
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export async function fetchMovieById(tmdbId: number, language?: string) {
  const movie = await tmdbCall<MovieTMDB | null>(
    `/movie/${tmdbId}`,
    {
      append_to_response: "credits"
    },
    language
  );

  // TODO: Add typing when 404
  if (!movie || ("success" in movie && !movie.success)) {
    return null;
  }

  const director =
    movie.credits?.crew.find((c) => c.job === JOB.DIRECTOR)?.name || null;
  const movieTmdb: MovieTMDB = {
    ...movie,
    director
  };
  return movieTmdb;
}

// Alias for backward compatibility
export const fetchMovie = fetchMovieById;

export async function fetchPopularMovies(): Promise<MovieMinTMDB[] | null> {
  const resPopular = await tmdbCall<SearchResultTMDB>("/movie/popular");

  if (!resPopular) {
    return null;
  }

  return resPopular.results;
}

export async function fetchSimilarMovies(
  movieId: number,
  language?: string
): Promise<MovieMinTMDB[] | null> {
  const resSimilar = await tmdbCall<SearchResultTMDB>(
    `/movie/${movieId}/similar`,
    {},
    language
  );

  if (!resSimilar || !resSimilar.results) {
    return null;
  }

  return resSimilar.results;
}

// ==================== TV SHOW FUNCTIONS ====================

export async function searchShowByTitle(
  title: string,
  year?: number,
  language?: string
) {
  const dataSearch = await tmdbCall<SearchResultTMDB>(
    "/search/tv",
    {
      query: title,
      ...(year && { first_air_date_year: year })
    },
    language
  );

  if (!dataSearch || !dataSearch.results?.length) {
    console.error("searchShowByTitle found 0 shows for:", title);
    return null;
  }

  return dataSearch.results[0];
}

export async function searchShowsByTitle(
  title: string,
  year?: number,
  limit = 5,
  language?: string
) {
  const dataSearch = await tmdbCall<SearchResultTMDB>(
    "/search/tv",
    {
      query: title,
      ...(year && { first_air_date_year: year })
    },
    language
  );

  if (!dataSearch || !dataSearch.results?.length) {
    return [];
  }

  return dataSearch.results.slice(0, limit);
}

export async function fetchPopularShows() {
  const resPopular = await tmdbCall<SearchResultTMDB>("/tv/popular");

  if (!resPopular) {
    return null;
  }

  return resPopular.results;
}

export async function fetchSimilarShows(showId: number, language?: string) {
  const resSimilar = await tmdbCall<SearchResultTMDB>(
    `/tv/${showId}/similar`,
    {},
    language
  );

  if (!resSimilar || !resSimilar.results) {
    return null;
  }

  return resSimilar.results;
}

export async function fetchShowById(
  tmdbId: number,
  language?: string
): Promise<ShowTMDB | null> {
  try {
    const show = await tmdbCall<Omit<ShowTMDB, "imdb_id">>(
      `/tv/${tmdbId}`,
      {
        append_to_response: "credits,external_ids"
      },
      language
    );

    if (!show) {
      return null;
    }

    return {
      ...show,
      imdb_id: show.external_ids.imdb_id || null
    };
  } catch {
    return null;
  }
}

export async function fetchMediaById(
  tmdbId: number,
  mediaType: TMDB_MEDIA_TYPE,
  language?: string
): Promise<ShowTMDB | MovieTMDB | null> {
  let media: MovieTMDB | ShowTMDB | null = null;

  if (mediaType === TMDB_MEDIA_TYPE.MOVIE) {
    media = await fetchMovieById(tmdbId, language);
    if (!media) {
      return null;
    }
    return media;
  }

  if (mediaType === TMDB_MEDIA_TYPE.SHOW) {
    media = await fetchShowById(tmdbId, language);
    if (!media) {
      return null;
    }
    return media;
  }

  return null;
}

export async function fetchMediasByKeys(
  keys: MediaKey[]
): Promise<(MovieTMDB | ShowTMDB)[]> {
  const medias = await Promise.all(
    keys.map(async (key) => {
      const [mediaType, id] = key.split("__");
      const idNumber = parseInt(id, 10);
      if (mediaType === TMDB_MEDIA_TYPE.MOVIE) {
        return fetchMovieById(idNumber);
      }
      return fetchShowById(idNumber);
    })
  );
  return medias.filter(isTruthy);
}

export const isMovie = (media: MediaTMDB): media is MovieTMDB =>
  "title" in media;

export const isShow = (media: MediaTMDB): media is ShowTMDB => "name" in media;

export const getMediaType = (media: MediaTMDB): TMDB_MEDIA_TYPE =>
  isMovie(media) ? TMDB_MEDIA_TYPE.MOVIE : TMDB_MEDIA_TYPE.SHOW;
