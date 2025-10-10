<script lang="ts">
  import { onMount } from "svelte";
  import { userPreferences } from "../../stores/userPreferences.svelte";
  import { fetchMovie } from "$lib/tmdb/tmdb";
  import type { MovieEnriched } from "../../components/RecommendPage/RecommendationsStreamingPage.svelte";
  import RecommendationsList from "../../components/RecommendPage/RecommendationsList.svelte";
  import Button from "../../components/Button/Button.svelte";
  import IconButton from "../../components/Button/IconButton.svelte";
  import { ArrowLeft, House, Trash } from "phosphor-svelte";
  import { goto } from "$app/navigation";
  import * as m from "$lib/paraglide/messages.js";

  let loading = $state(true);
  let movies = $state<MovieEnriched[]>([]);
  let currentMovieId = $state<number | undefined>(undefined);

  onMount(async () => {
    await loadHistory();
  });

  async function loadHistory() {
    loading = true;

    // Get movie history with reasons
    const historyWithReasons = userPreferences.history;

    // Fetch movie data from TMDB for movies that have reasons
    const moviePromises = historyWithReasons.map(async (historyEntry) => {
      const movie = await fetchMovie(historyEntry.id);
      if (!movie) return null;

      return {
        ...movie,
        reason: historyEntry.reason
      };
    });

    const results = await Promise.all(moviePromises);
    const validMovies = results.filter((m): m is MovieEnriched => m !== null);

    // Sort by most recent
    movies = validMovies.sort((a, b) => {
      const aHistory = userPreferences.getMovieHistory(a.id);
      const bHistory = userPreferences.getMovieHistory(b.id);
      return (bHistory?.timestamp ?? 0) - (aHistory?.timestamp ?? 0);
    });

    loading = false;
  }

  function handleComplete() {
    // When user finishes reviewing history, just reload
    loadHistory();
  }

  function clearCurrentMovie() {
    if (!currentMovieId) return;

    // if (confirm(m.history_clear_confirmation())) {
    //     return;
    // }

    userPreferences.removeFromHistory(currentMovieId);
    movies = movies.filter((movie) => movie.id !== currentMovieId);
  }
</script>

<div class="flex h-full flex-col">
  <header class="relative p-4 flex justify-center items-center">
    <IconButton
      class="absolute left-4"
      icon={ArrowLeft}
      onclick={() => {
        goto("/");
      }}
    />

    <h1 class="text-xl font-bold">{m.history_title()}</h1>

    {#if movies.length > 0}
      <IconButton
        class="!bg-red-500 absolute right-4"
        icon={Trash}
        onclick={clearCurrentMovie}
      />
    {/if}
  </header>

  {#if loading}{:else if movies.length === 0}
    <div
      class="flex flex-col gap-4 justify-center items-center self-center my-auto"
    >
      <p class="text-gray-500 text-base px-6 text-center">
        {m.history_empty()}
      </p>
      <a
        href="/"
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
