import type { MediaTMDB, TMDB_MEDIA_TYPE } from "$lib/tmdb/tmdb.decl";
import type { Recommendation } from "$lib/api/recommendations.decl";
import { SvelteMap } from "svelte/reactivity";
import { streamAiRecommendations } from "$lib/api/recommendations";
import {
  fetchMovieById,
  searchMovieByTitle,
  fetchShowById,
  searchShowByTitle
} from "$lib/tmdb/tmdb";
import { isTruthy } from "../helpers/types.helpers";
import { userPreferences } from "./userPreferences.svelte";
import { getLocale } from "$lib/paraglide/runtime";
import * as m from "$lib/paraglide/messages.js";
import throttle from "lodash.throttle";
import type { MediasFormData } from "../components/MediasForm/MediasForm.svelte";
import { TMDB_MEDIA_TYPE as MEDIA_TYPE } from "$lib/tmdb/tmdb.decl";

export type MediaEnriched = MediaTMDB & {
  reason: string | null;
};

class RecommendationsStore {
  loading = $state(false);
  error = $state<string | null>(null);
  enrichedMedias = $state<MediaEnriched[] | undefined>(undefined);
  recommendations = $state<Recommendation[] | undefined>(undefined);
  currentFormData = $state<MediasFormData | undefined>(undefined);
  loadingStartTime = $state<number | null>(null);
  loadingDuration = 60; // seconds

  private tmdbMediaCache = new SvelteMap<string, MediaTMDB>();

  get elapsedSeconds() {
    if (!this.loadingStartTime) return 0;
    return Math.floor((Date.now() - this.loadingStartTime) / 1000);
  }

  private async fetchTmdbMedia(
    title: string,
    year?: number,
    mediaType: TMDB_MEDIA_TYPE = MEDIA_TYPE.MOVIE
  ): Promise<MediaTMDB | null> {
    const cacheKey = `${mediaType}:${title}:${year || ""}`;

    if (this.tmdbMediaCache.has(cacheKey)) {
      return this.tmdbMediaCache.get(cacheKey) ?? null;
    }

    let media: MediaTMDB | null = null;

    if (mediaType === MEDIA_TYPE.MOVIE) {
      const movieMin = await searchMovieByTitle(title, year);
      if (movieMin) {
        media = await fetchMovieById(movieMin.id);
      }
    } else {
      const showMin = await searchShowByTitle(title, year);
      if (showMin) {
        media = await fetchShowById(showMin.id);
      }
    }

    if (!media) {
      return null;
    }

    this.tmdbMediaCache.set(cacheKey, media);

    return media;
  }

  hasRecommendations() {
    return this.recommendations?.length && this.enrichedMedias?.length;
  }

  private onRecommendations(partialRecs: Recommendation[]) {
    // Make sure all recommendations have a title, year, and reason
    const newRecommendations = partialRecs.filter((rec) => {
      return rec.title && rec.year && rec.reason;
    });

    this.recommendations = newRecommendations;

    const mediaType = this.currentFormData?.media_type || MEDIA_TYPE.MOVIE;

    this.recommendations.forEach((rec) => {
      this.fetchTmdbMedia(rec.title, rec.year, mediaType);
    });

    this.enrichedMedias = this.recommendations
      .map((rec) => {
        const cacheKey = `${mediaType}:${rec.title}:${rec.year || ""}`;
        const mediaTmdb = this.tmdbMediaCache.get(cacheKey) ?? null;

        if (!mediaTmdb) {
          return null;
        }

        return {
          ...mediaTmdb,
          reason: rec.reason
        };
      })
      .filter(isTruthy);
  }

  private onRecommendationsThrottled = throttle(
    this.onRecommendations.bind(this),
    500
  );

  async loadRecommendations(formData: MediasFormData) {
    this.loading = true;
    this.loadingStartTime = Date.now();
    this.error = null;
    this.enrichedMedias = undefined;
    this.recommendations = undefined;
    this.currentFormData = formData;

    try {
      const locale = getLocale();
      await streamAiRecommendations(
        {
          ...formData,
          recommendations_count: 10,
          disliked_medias_keys: userPreferences.dislikedKeys,
          liked_medias_keys: userPreferences.likedKeys,
          already_recommended_medias_keys:
            userPreferences.alreadyRecommendedKeys,
          locale,
          reasoning_effort: "medium"
        },
        async (partialRecs) => {
          if (!partialRecs) {
            return;
          }

          this.onRecommendationsThrottled(partialRecs);
        }
      );
    } catch (err) {
      console.error("❌ Streaming error:", err);
      this.error =
        err instanceof Error ? err.message : m.error_fetch_recommendations();
    } finally {
      this.loading = false;
      this.loadingStartTime = null;
    }
  }

  shouldReload(formData: MediasFormData): boolean {
    if (this.loading) {
      return false;
    }

    // Check if we need to reload recommendations
    // Reload if: no current data, or formData changed
    if (
      !this.currentFormData ||
      !this.enrichedMedias ||
      this.enrichedMedias.length === 0
    ) {
      return true;
    }

    // Compare formData to see if it changed
    return JSON.stringify(this.currentFormData) !== JSON.stringify(formData);
  }

  clear() {
    this.loading = false;
    this.loadingStartTime = null;
    this.error = null;
    this.enrichedMedias = undefined;
    this.recommendations = undefined;
    this.currentFormData = undefined;
    this.tmdbMediaCache = new SvelteMap<string, MediaTMDB>();
  }
}

export const recommendationsStore = new RecommendationsStore();
