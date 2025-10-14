import { TMDB_MEDIA_TYPE } from "$lib/tmdb/tmdb.decl";

export interface MediaDef {
  tmdbId: number;
  mediaType: TMDB_MEDIA_TYPE;
}

/**
 * Convert TMDB ID and media type to a key string
 * Format: "movie__123" or "tv__456"
 */
export function tmdbIdToKey(tmdbId: number, mediaType: TMDB_MEDIA_TYPE): string {
  return `${mediaType}__${tmdbId}`;
}

/**
 * Parse a key string back to TMDB ID and media type
 * Format: "movie__123" -> { tmdbId: 123, mediaType: TMDB_MEDIA_TYPE.MOVIE }
 */
export function tmdbKeyToId(key: string): MediaDef {
  const [mediaTypeStr, tmdbIdStr] = key.split("__");
  const mediaType = mediaTypeStr === TMDB_MEDIA_TYPE.MOVIE ? TMDB_MEDIA_TYPE.MOVIE : TMDB_MEDIA_TYPE.SHOW;
  const tmdbId = parseInt(tmdbIdStr, 10);
  return { tmdbId, mediaType };
}
