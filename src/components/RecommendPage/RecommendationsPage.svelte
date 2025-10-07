<script lang="ts">
  import type { MoviesFormData } from "../MoviesForm/MoviesForm.svelte";
  import { fetchAiRecommendations } from "$lib/api/recommendations";
  import { onMount } from "svelte";
  import OptimisticProgressBar from "../OptimisticProgressBar/OptimisticProgressBar.svelte";
  import { ArrowsClockwise, Warning } from "phosphor-svelte";
  import Button from "../Button/Button.svelte";
  import RecommendedList from "./RecommendationsList.svelte";
  import type { MovieTMDB } from "$lib/tmdb/tmdb.decl";
  import { fetchMovie, searchMovieByTitle } from "$lib/tmdb/tmdb";
  import type { Recommendation } from "$lib/api/recommendations.decl";
  import { moviePreferences } from "../../stores/moviePreferences.svelte";

  export type MovieEnriched = MovieTMDB & {
    reason: string;
  };

  interface Props {
    data: MoviesFormData;
  }

  let { data }: Props = $props();

  let loading = $state(false);
  let error = $state<string | null>(null);
  let movies: MovieEnriched[] | undefined = $state(undefined);

  onMount(() => {
    loadRecommendations();
  });

  async function fetchTmdbMovies(
    recommendations: Recommendation[]
  ): Promise<MovieEnriched[]> {
    const moviePromises = recommendations.map(async (rec) => {
      const movieMin = await searchMovieByTitle(rec.title, rec.year);

      if (!movieMin) {
        return null;
      }

      const movie = await fetchMovie(movieMin.id);

      if (!movie) {
        return null;
      }

      return {
        ...movie,
        reason: rec.reason
      };
    });

    const results = await Promise.all(moviePromises);

    // Filter out null results (movies that weren't found)
    return results.filter((movie): movie is MovieEnriched => movie !== null);
  }

  async function loadRecommendations() {
    loading = true;
    error = null;
    movies = undefined;

    // Use persisted preferences from store
    console.log("disliked from store:", moviePreferences.disliked);
    console.log("liked from store:", moviePreferences.liked);
    console.log(
      "already recommended from store:",
      moviePreferences.alreadyRecommended
    );

    try {
      const response = await fetchAiRecommendations(
        {
          ...data,
          recommendations_count: 10,
          disliked_movies_ids: moviePreferences.disliked,
          liked_movies_ids: moviePreferences.liked,
          already_recommended_movies_ids: moviePreferences.alreadyRecommended
        },
        { mock: false }
      );

      if (!response || !response.success || !response.recommendations) {
        throw new Error("Oops, something went wrong.");
      }

      console.log("✅ recommendations:", $state.snapshot(response));
      movies = await fetchTmdbMovies(response.recommendations);
      console.log("✅ tmdb movies:", $state.snapshot(movies));
    } catch (err) {
      console.error("❌ Fetch error:", err);
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
  {#if loading}
    <div class="flex h-full w-full items-center justify-center">
      <OptimisticProgressBar
        texts={[
          "Analyzing your taste...",
          "Scanning decades of cinema...",
          "Consulting the film archives...",
          "Reading between the frames...",
          "Curating your perfect lineup..."
        ]}
        subtext="This process will take around 40 seconds."
        duration={50}
      />
    </div>
  {:else if movies}
    <RecommendedList {movies} onComplete={handleComplete} />
  {:else if error}
    <div class="flex flex-col gap-6 items-center self-center">
      <div class="flex flex-col gap-1 items-center">
        <Warning size={60} class="text-red-500" />
        <p class="text-red-500">{error}</p>
      </div>
      <Button onclick={() => loadRecommendations()} icon={ArrowsClockwise}>
        Try again
      </Button>
    </div>
  {/if}
</div>
