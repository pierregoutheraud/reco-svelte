import { CRAWLER_SOURCE } from "$lib/api/ratings.decl";
import type { Maybe } from "./types.helpers";

export function getCrawlerRatingsColor(source: Maybe<CRAWLER_SOURCE>) {
  if (!source) {
    return { backgroundColor: "var(--color-main)", color: "black" };
  }

  switch (source) {
    case CRAWLER_SOURCE.IMDB:
      return { backgroundColor: "var(--color-imdb)", color: "black" };
    case CRAWLER_SOURCE.METACRITIC:
      return {
        backgroundColor: "var(--color-metacritic)",
        color: "black"
      };
    case CRAWLER_SOURCE.ROTTEN_TOMATOES:
      return {
        backgroundColor: "var(--color-rotten-tomatoes)",
        color: "white"
      };
    case CRAWLER_SOURCE.LETTERBOXD:
      return {
        backgroundColor: "var(--color-letterboxd)",
        color: "black"
      };
    case CRAWLER_SOURCE.AVERAGE:
      return { backgroundColor: "var(--color-main)", color: "black" };
  }

  return { backgroundColor: "var(--color-main)", color: "black" };
}
