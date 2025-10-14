<script lang="ts">
  import { onMount } from "svelte";
  import { userPreferences } from "../../stores/userPreferences.svelte";
  import { fetchMediaById } from "$lib/tmdb/tmdb";
  import type { MediaEnriched } from "../../stores/recommendationsStore.svelte";
  import MediasList from "../../components/RecommendPage/MediasList.svelte";
  import * as m from "$lib/paraglide/messages.js";
  import { tmdbKeyToId } from "../../helpers/media.helpers";
  import { TMDB_MEDIA_TYPE } from "$lib/tmdb/tmdb.decl";

  let loading = $state(true);
  let medias = $state<MediaEnriched[]>([]);
  let currentMediaId = $state<number | undefined>(undefined);

  onMount(async () => {
    await loadWatchLater();
  });

  async function loadWatchLater() {
    loading = true;

    // Get watch later media with reasons
    const watchLaterWithReasons = userPreferences.watchLater;

    // Fetch media data from TMDB
    const mediaPromises = watchLaterWithReasons.map(async (watchLaterEntry) => {
      const { tmdbId, mediaType } = tmdbKeyToId(watchLaterEntry.key);

      const media = await fetchMediaById(tmdbId, mediaType);
      if (!media) return null;

      return {
        ...media,
        reason: watchLaterEntry.reason
      };
    });

    const results = await Promise.all(mediaPromises);
    const validMedias = results.filter((m) => m !== null) as MediaEnriched[];

    // Sort by most recent
    medias = validMedias.sort((a, b) => {
      const aWatchLater = userPreferences.getWatchLaterByMediaId(a.id);
      const bWatchLater = userPreferences.getWatchLaterByMediaId(b.id);
      return (bWatchLater?.timestamp ?? 0) - (aWatchLater?.timestamp ?? 0);
    });

    loading = false;
  }

  function handleComplete() {
    // When user finishes reviewing watch later, just reload
    loadWatchLater();
  }

  function clearCurrentMedia() {
    if (!currentMediaId) return;

    userPreferences.removeFromWatchLater(currentMediaId);
    medias = medias.filter((media) => media.id !== currentMediaId);
  }
</script>

<div class="flex h-full flex-col">
  {#if loading}{:else if medias.length === 0}
    <div
      class="flex flex-col gap-4 justify-center items-center self-center my-auto"
    >
      <p class="text-gray-500 text-base px-10 text-center">
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
    <MediasList
      {medias}
      onComplete={handleComplete}
      bind:currentMovieId={currentMediaId}
    />
  {/if}
</div>
