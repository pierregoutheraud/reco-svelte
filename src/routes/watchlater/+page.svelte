<script lang="ts">
  import { onMount } from "svelte";
  import { userPreferences } from "../../stores/userPreferences.svelte";
  import { fetchMovie } from "$lib/tmdb/tmdb";
  import type { MovieEnriched } from "../../stores/recommendationsStore.svelte";
  import RecommendationsList from "../../components/RecommendPage/MoviesList.svelte";
  import * as m from "$lib/paraglide/messages.js";

  let loading = $state(true);
  let movies = $state<MovieEnriched[]>([]);
  let currentMovieId = $state<number | undefined>(undefined);

  onMount(async () => {
    await loadWatchLater();
  });

  async function loadWatchLater() {
    loading = true;

    // Get watch later movies with reasons
    const watchLaterWithReasons = userPreferences.watchLater;

    // Fetch movie data from TMDB for movies that have reasons
    const moviePromises = watchLaterWithReasons.map(async (watchLaterEntry) => {
      const movie = await fetchMovie(watchLaterEntry.id);
      if (!movie) return null;

      return {
        ...movie,
        reason: watchLaterEntry.reason
      };
    });

    const results = await Promise.all(moviePromises);
    const validMovies = results.filter((m): m is MovieEnriched => m !== null);

    // Sort by most recent
    movies = validMovies.sort((a, b) => {
      const aWatchLater = userPreferences.getWatchLaterMovie(a.id);
      const bWatchLater = userPreferences.getWatchLaterMovie(b.id);
      return (bWatchLater?.timestamp ?? 0) - (aWatchLater?.timestamp ?? 0);
    });

    loading = false;
  }

  function handleComplete() {
    // When user finishes reviewing watch later, just reload
    loadWatchLater();
  }

  function clearCurrentMovie() {
    if (!currentMovieId) return;

    // if (confirm(m.history_clear_confirmation())) {
    //     return;
    // }

    userPreferences.removeFromWatchLater(currentMovieId);
    movies = movies.filter((movie) => movie.id !== currentMovieId);
  }
</script>

<div class="flex h-full flex-col">
  <!--<header class="relative p-4 flex justify-center items-center">
    <IconButton
      class="absolute left-4"
      icon={ArrowLeft}
      onclick={() => {
        goto("/");
      }}
    />

    <h1 class="text-xl font-bold">{m.watchlater_title()}</h1>

     {#if movies.length > 0}
      <IconButton
        class="!bg-red-500 absolute right-4"
        icon={Trash}
        onclick={clearCurrentMovie}
      />
    {/if}
  </header>-->

  {#if loading}{:else if movies.length === 0}
    <div
      class="flex flex-col gap-4 justify-center items-center self-center my-auto"
    >
      <p class="text-gray-500 text-base px-6 text-center">
        {m.history_empty()}
      </p>
      <a
        href="/form"
        class="text-base text-center text-blue-500 underline underline-offset-3"
      >
        {m.history_get_recommendations_link()}
      </a>
    </div>
  {:else}
    <RecommendationsList
      {movies}
      onComplete={handleComplete}
      bind:currentMovieId
    />
  {/if}
</div>
