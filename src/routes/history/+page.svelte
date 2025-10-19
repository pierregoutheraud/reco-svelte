<script lang="ts">
  import { onMount } from "svelte";
  import { userPreferences } from "../../stores/userPreferences.svelte";
  import { fetchMediasByKeys } from "$lib/tmdb/tmdb";
  import type { MediaTMDB } from "$lib/tmdb/tmdb.decl";
  import ColMediaItem from "../../components/MediaItem/ColMediaItem.svelte";
  import { goto } from "$app/navigation";
  import type { Snapshot } from "./$types";

  let medias = $state<MediaTMDB[]>([]);
  let scrollToRestore = $state<number | null>(null);

  onMount(async () => {
    medias = await fetchMediasByKeys(userPreferences.alreadyRecommendedKeys);

    // Restore scroll after data is loaded
    if (scrollToRestore !== null) {
      const savedScroll = scrollToRestore;
      requestAnimationFrame(() => {
        const mainScrollContainer = document.querySelector(
          ".main-scroll-container"
        );
        if (mainScrollContainer) {
          mainScrollContainer.scrollTop = savedScroll;
        }
      });
    }
  });

  export const snapshot: Snapshot<number> = {
    capture: () => {
      // Capture scroll position of main element when we navigate to another page
      const scrollTop =
        document.querySelector(".main-scroll-container")?.scrollTop ?? 0;
      return scrollTop;
    },
    restore: (scrollY) => {
      // Restore scroll position of main element when we navigate back to this page
      scrollToRestore = scrollY;
    }
  };
</script>

<div class="flex flex-col pt-2">
  {#each medias as media}
    <ColMediaItem
      {media}
      onclick={(id, mediaType) => {
        goto(`/${mediaType}/${id}`);
      }}
    />
  {/each}
</div>
