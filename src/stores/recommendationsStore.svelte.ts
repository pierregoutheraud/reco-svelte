import type { MovieTMDB } from "$lib/tmdb/tmdb.decl";
import type { Recommendation } from "$lib/api/recommendations.decl";
import type { MoviesFormData } from "../components/MoviesForm/MoviesForm.svelte";
import { SvelteMap } from "svelte/reactivity";
import { streamAiRecommendations } from "$lib/api/recommendations";
import { fetchMovie, searchMovieByTitle } from "$lib/tmdb/tmdb";
import { nonNullable } from "../helpers/types.helpers";
import { userPreferences } from "./userPreferences.svelte";
import { getLocale } from "$lib/paraglide/runtime";
import * as m from "$lib/paraglide/messages.js";
import throttle from "lodash.throttle";

export type MovieEnriched = MovieTMDB & {
  reason: string;
};

class RecommendationsStore {
  loading = $state(false);
  error = $state<string | null>(null);
  enrichedMovies = $state<MovieEnriched[] | undefined>(undefined);
  recommendations = $state<Recommendation[] | undefined>(undefined);
  currentFormData = $state<MoviesFormData | undefined>(undefined);
  loadingStartTime = $state<number | null>(null);
  loadingDuration = 60; // seconds

  private tmdbMovies = new SvelteMap<string, MovieTMDB>();

  get elapsedSeconds() {
    if (!this.loadingStartTime) return 0;
    return Math.floor((Date.now() - this.loadingStartTime) / 1000);
  }

  private async fetchTmdbMovie(
    title: string,
    year?: number
  ): Promise<MovieTMDB | null> {
    if (this.tmdbMovies.has(title)) {
      return this.tmdbMovies.get(title) ?? null;
    }

    const movieMin = await searchMovieByTitle(title, year);

    if (!movieMin) {
      return null;
    }

    const movie = await fetchMovie(movieMin.id);

    if (!movie) {
      return null;
    }

    this.tmdbMovies.set(title, movie);

    return movie;
  }

  hasRecommendations() {
    return this.recommendations?.length && this.enrichedMovies?.length;
  }

  private onRecommendations(partialRecs: Recommendation[]) {
    // Make sure all recommendations have a title, year, and reason
    const newRecommendations = partialRecs.filter((rec) => {
      return rec.title && rec.year && rec.reason;
    });

    this.recommendations = newRecommendations;

    this.recommendations.forEach((rec) => {
      this.fetchTmdbMovie(rec.title, rec.year);
    });

    this.enrichedMovies = this.recommendations
      .map((rec) => {
        const movieTmdb = this.tmdbMovies.get(rec.title) ?? null;

        if (!movieTmdb) {
          return null;
        }

        return {
          ...movieTmdb,
          reason: rec.reason
        };
      })
      .filter(nonNullable);
  }

  private onRecommendationsThrottled = throttle(
    this.onRecommendations.bind(this),
    500
  );

  async loadRecommendations(formData: MoviesFormData) {
    this.loading = true;
    this.loadingStartTime = Date.now();
    this.error = null;
    this.enrichedMovies = undefined;
    this.recommendations = undefined;
    this.currentFormData = formData;

    try {
      const locale = getLocale();
      await streamAiRecommendations(
        {
          ...formData,
          recommendations_count: 10,
          disliked_movies_ids: userPreferences.disliked,
          liked_movies_ids: userPreferences.liked,
          already_recommended_movies_ids: userPreferences.alreadyRecommended,
          locale
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

  shouldReload(formData: MoviesFormData): boolean {
    // Check if we need to reload recommendations
    // Reload if: no current data, or formData changed
    if (
      !this.currentFormData ||
      !this.enrichedMovies ||
      this.enrichedMovies.length === 0
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
    this.enrichedMovies = undefined;
    this.recommendations = undefined;
    this.currentFormData = undefined;
    this.tmdbMovies = new SvelteMap<string, MovieTMDB>();
  }
}

export const recommendationsStore = new RecommendationsStore();
