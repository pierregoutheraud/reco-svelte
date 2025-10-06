<script lang="ts">
  import { getContext } from "svelte";
  import type { FormContext } from "../Form.svelte";
  import type { FormStepContext } from "../FormStep.svelte";
  import { searchMoviesByTitle } from "$lib/tmdb/tmdb";
  import type { MovieMinTMDB } from "$lib/tmdb/tmdb.decl";
  import FormSelectedMovieItem from "./FormSelectedMovieItem.svelte";
  import FormSearchResultMovieItem from "./FormSearchResultMovieItem.svelte";

  const { setValue } = getContext<FormContext>("form");
  const { id: stepId } = getContext<FormStepContext>("form_step");

  let searchQuery = $state("");
  let searchResults = $state<MovieMinTMDB[] | undefined>(undefined);
  let isSearching = $state(false);
  let selectedMovies = $state<MovieMinTMDB[]>([]);
  let debounceTimer: ReturnType<typeof setTimeout>;

  // Update form data whenever selected movies change
  $effect(() => {
    // Store the TMDB IDs for the API
    const movieIds = selectedMovies.map((m) => m.id);
    setValue(stepId, movieIds.length > 0 ? movieIds : undefined);
  });

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      searchResults = undefined;
      return;
    }

    isSearching = true;
    try {
      const results = await searchMoviesByTitle(query);
      searchResults = results || [];
    } catch (error) {
      console.error("Search error:", error);
      searchResults = [];
    } finally {
      isSearching = false;
    }
  };

  const onSearchInput = (value: string) => {
    searchQuery = value;

    // Debounce search
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      handleSearch(value);
    }, 300);
  };

  const selectMovie = (movie: MovieMinTMDB) => {
    // Check if already selected
    if (selectedMovies.some((m) => m.id === movie.id)) {
      return;
    }

    selectedMovies.push(movie);

    // Clear search
    searchQuery = "";
    searchResults = undefined;
  };

  const removeMovie = (id: number) => {
    selectedMovies = selectedMovies.filter((m) => m.id !== id);
  };
</script>

<div class="flex flex-col gap-4">
  <!-- Selected Movies -->
  {#if selectedMovies.length > 0}
    <div class="flex flex-col gap-2">
      {#each selectedMovies as movie (movie.id)}
        <FormSelectedMovieItem {movie} onRemove={removeMovie} />
      {/each}
    </div>
  {/if}

  <!-- Search Input -->
  <div class="relative">
    <input
      type="text"
      class="w-full bg-white text-black p-3 outline-none placeholder:text-gray-400"
      autofocus
      placeholder="Search for a movie"
      value={searchQuery}
      oninput={(e) => onSearchInput(e.currentTarget.value)}
    />
    {#if isSearching}
      <div
        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
      >
        Searching...
      </div>
    {/if}
  </div>

  <!-- Search Results -->
  {#if searchResults && searchResults.length > 0}
    <div class="flex flex-col gap-3">
      {#each searchResults as result (result.id)}
        {@const isSelected = selectedMovies.some((m) => m.id === result.id)}
        <FormSearchResultMovieItem
          movie={result}
          {isSelected}
          onSelect={selectMovie}
        />
      {/each}
    </div>
  {:else if searchResults !== undefined && searchResults.length === 0 && !isSearching}
    <div class="text-center text-white/40 py-4 text-sm">No movies found.</div>
  {/if}
</div>
