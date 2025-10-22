import type { TMDB_MEDIA_TYPE } from "$lib/tmdb/tmdb.decl";

export function getMiruUrl(mediaType: TMDB_MEDIA_TYPE, id: number) {
  return `https://www.miru.live/${mediaType === "movie" ? "movie" : "show"}/${id}`;
}
