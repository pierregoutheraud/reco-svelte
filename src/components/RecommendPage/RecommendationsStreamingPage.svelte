<script lang="ts">
  import type { MoviesFormData } from "../MoviesForm/MoviesForm.svelte";
  import { streamAiRecommendations } from "$lib/api/recommendations";
  import { onMount } from "svelte";
  import OptimisticProgressBar from "../OptimisticProgressBar/OptimisticProgressBar.svelte";
  import { ArrowsClockwise, Warning } from "phosphor-svelte";
  import Button from "../Button/Button.svelte";
  import RecommendationsList from "./RecommendationsList.svelte";
  import type { MovieTMDB } from "$lib/tmdb/tmdb.decl";
  import { fetchMovie, searchMovieByTitle } from "$lib/tmdb/tmdb";
  import type { Recommendation } from "$lib/api/recommendations.decl";
  import { SvelteMap } from "svelte/reactivity";
  import { nonNullable } from "../../helpers/types.helpers";
  import throttle from "lodash.throttle";
  import { userPreferences } from "../../stores/userPreferences.svelte";

  export type MovieEnriched = MovieTMDB & {
    reason: string;
  };

  interface Props {
    data: MoviesFormData;
  }

  let { data }: Props = $props();

  let loading = $state(false);
  let error = $state<string | null>(null);

  let tmdbMovies = new SvelteMap<string, MovieTMDB>();
  let enrichedMovies: MovieEnriched[] | undefined = $state(undefined);
  let recommendations = $state<Recommendation[] | undefined>(undefined);

  onMount(() => {
    loadRecommendations();
  });

  async function fetchTmdbMovie(
    title: string,
    year?: number
  ): Promise<MovieTMDB | null> {
    if (tmdbMovies.has(title)) {
      return tmdbMovies.get(title) ?? null;
    }

    const movieMin = await searchMovieByTitle(title, year);

    if (!movieMin) {
      return null;
    }

    const movie = await fetchMovie(movieMin.id);

    if (!movie) {
      return null;
    }

    tmdbMovies.set(title, movie);

    return movie;
  }

  function onRecommendations(partialRecs: Recommendation[]) {
    // Make sure all recommendations have a title, year, and reason
    const newRecommendations = partialRecs.filter((rec) => {
      return rec.title && rec.year && rec.reason;
    });

    recommendations = newRecommendations;

    recommendations.forEach((rec) => {
      fetchTmdbMovie(rec.title, rec.year);
    });

    enrichedMovies = recommendations
      .map((rec) => {
        const movieTmdb = tmdbMovies.get(rec.title) ?? null;

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

  const onRecommendationsThrottled = throttle(onRecommendations, 500);

  async function loadRecommendations() {
    loading = true;
    error = null;
    enrichedMovies = undefined;
    recommendations = undefined;

    try {
      await streamAiRecommendations(
        {
          ...data,
          recommendations_count: 10,
          disliked_movies_ids: userPreferences.disliked,
          liked_movies_ids: userPreferences.liked,
          already_recommended_movies_ids: userPreferences.alreadyRecommended
        },
        async (partialRecs) => {
          if (!partialRecs) {
            return;
          }

          onRecommendationsThrottled(partialRecs);
        }
      );
    } catch (err) {
      console.error("❌ Streaming error:", err);
      error =
        err instanceof Error ? err.message : "Failed to fetch recommendations";
    } finally {
      loading = false;
    }
  }

  function handleComplete() {
    console.log("handleComplete - reloading recommendations");

    // All preferences are already saved in the store via RecommendationsList
    // Just reload recommendations
    loadRecommendations();
  }
</script>

<div class="flex h-full">
  {#if error}
    <div class="flex flex-1 flex-col gap-6 items-center self-center">
      <div class="flex flex-col gap-1 items-center">
        <Warning size={60} class="text-red-500" />
        <p class="text-red-500">{error}</p>
      </div>
      <Button onclick={() => loadRecommendations()} icon={ArrowsClockwise}>
        Try again
      </Button>
    </div>
  {:else if enrichedMovies?.length}
    <RecommendationsList movies={enrichedMovies} onComplete={handleComplete} />
  {:else if loading}
    <div class="flex h-full w-full items-center justify-center">
      <OptimisticProgressBar
        texts={[
          "Analyzing your taste...",
          "Scanning decades of cinema...",
          "Consulting the film archives...",
          "Reading between the frames...",
          "Curating your perfect lineup..."
        ]}
        subtext={`This process will take around 20 seconds.`}
        duration={30}
      />
    </div>
  {/if}
</div>
