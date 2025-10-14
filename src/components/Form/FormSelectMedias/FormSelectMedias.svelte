<script lang="ts">
  import { getContext, onMount } from "svelte";
  import type { FormContext } from "../Form.svelte";
  import type { FormStepContext } from "../FormStep.svelte";
  import {
    fetchPopularMovies,
    searchMoviesByTitle,
    fetchPopularShows,
    searchShowsByTitle
  } from "$lib/tmdb/tmdb";
  import type { MediaMinTMDB } from "$lib/tmdb/tmdb.decl";
  import { TMDB_MEDIA_TYPE } from "$lib/tmdb/tmdb.decl";
  import * as m from "$lib/paraglide/messages.js";
  import FormSearchResultMediaItem from "./FormSearchResultMediaItem.svelte";
  import FormSelectedMediaItem from "./FormSelectedMediaItem.svelte";
  import { tmdbIdToKey } from "../../../helpers/media.helpers";

  const { setValue, getValue } = getContext<FormContext>("form");
  const { id: stepId } = getContext<FormStepContext>("form_step");

  // Get media_type from form context
  const mediaType = $derived(
    (getValue("media_type") as TMDB_MEDIA_TYPE) || TMDB_MEDIA_TYPE.MOVIE
  );
  const isMovie = $derived(mediaType === TMDB_MEDIA_TYPE.MOVIE);
  const mediaLabel = $derived(isMovie ? "movie" : "series");
  const mediaLabelPlural = $derived(isMovie ? "movies" : "series");

  let searchQuery = $state("");
  let searchResults = $state<MediaMinTMDB[] | undefined>(undefined);
  let isSearching = $state(false);
  let selectedMedia = $state<MediaMinTMDB[]>([]);
  let debounceTimer: ReturnType<typeof setTimeout>;

  // Update form data whenever selected media change
  $effect(() => {
    // Store the media keys (format: "movie__123" or "tv__456") for the API
    const mediaKeys = selectedMedia.map((m) => tmdbIdToKey(m.id, mediaType));
    setValue(stepId, mediaKeys.length > 0 ? mediaKeys : undefined);
  });

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      searchResults = undefined;
      return;
    }

    isSearching = true;
    try {
      const results = isMovie
        ? await searchMoviesByTitle(query)
        : await searchShowsByTitle(query);
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

  const selectMedia = (media: MediaMinTMDB) => {
    // Check if already selected
    if (selectedMedia.some((m) => m.id === media.id)) {
      return;
    }

    selectedMedia.unshift(media);

    // Clear search
    searchQuery = "";
    searchResults = undefined;
  };

  const removeMedia = (id: number) => {
    selectedMedia = selectedMedia.filter((m) => m.id !== id);
  };
</script>

<div class="flex flex-col gap-4 flex-1 w-full">
  <!-- Selected Media -->
  {#if selectedMedia.length > 0}
    <div class="flex flex-col gap-2 overflow-auto max-h-[190px] shrink-0">
      {#each selectedMedia as media (media.id)}
        <FormSelectedMediaItem movie={media} onRemove={removeMedia} />
      {/each}
    </div>
  {/if}

  <!-- Search Input -->
  <div class="relative">
    <input
      type="text"
      class="w-full bg-white text-black p-3 outline-none placeholder:text-gray-400"
      autofocus
      placeholder={isMovie ? m.form_search_placeholder_movies() : m.form_search_placeholder_series()}
      value={searchQuery}
      oninput={(e) => onSearchInput(e.currentTarget.value)}
    />
    {#if isSearching}
      <div
        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
      >
        {m.form_search_searching()}
      </div>
    {/if}
  </div>

  <!-- Search Results -->
  {#if searchResults && searchResults.length > 0}
    <div class="flex flex-col gap-3">
      {#each searchResults as result (result.id)}
        {@const isSelected = selectedMedia.some((m) => m.id === result.id)}
        <FormSearchResultMediaItem
          movie={result}
          {isSelected}
          onSelect={selectMedia}
        />
      {/each}
    </div>
  {:else if searchResults !== undefined && searchResults.length === 0 && !isSearching}
    <div class="text-center text-white/40 py-4 text-sm">
      {m.form_search_no_results()}
    </div>
  {/if}
</div>
