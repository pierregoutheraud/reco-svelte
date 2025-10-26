import { TMDB_MEDIA_TYPE } from "$lib/tmdb/tmdb.decl";
import type { CrawlerRatings, RatingsResponse } from "./ratings.decl";

class MongoApi {
  async fetch<T>(endpoint: string): Promise<T | null> {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json"
      };

      // Call local SvelteKit API proxy instead of backend directly
      const res = await fetch(`/api${endpoint}`, { headers });

      if (!res.ok) {
        // Log error details, especially for CSRF failures
        let errorMessage = `HTTP ${res.status}: ${res.statusText}`;

        try {
          const errorData = await res.json();
          if (errorData.message) {
            errorMessage = `${errorMessage} - ${errorData.message}`;
          }
        } catch {
          // If response isn't JSON, use the status text
        }

        console.error("API Request failed:", errorMessage);
        return null;
      }

      return res.json();
    } catch (e) {
      console.log("ERROR");
      console.error(e);
      return null;
    }
  }

  async fetchRatings(
    id: string | number, // can be tmdbId or imdbId
    mediaType: TMDB_MEDIA_TYPE = TMDB_MEDIA_TYPE.MOVIE,
    fallback = false,
    forceUpdate = false
  ): Promise<CrawlerRatings | null> {
    const params = new URLSearchParams({
      id: "" + id,
      mediaType,
      fallback: fallback ? "1" : "0",
      forceUpdate: forceUpdate ? "1" : "0"
    });

    const endpoint = `/ratings?${params.toString()}`;

    try {
      const json = await this.fetch<RatingsResponse>(endpoint);

      if (!json) {
        return null;
      }

      return json.ratings;
    } catch {
      return null;
    }
  }
}

export default new MongoApi();
