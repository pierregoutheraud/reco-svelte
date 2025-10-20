<script lang="ts">
  import { onMount, tick } from "svelte";
  import { fetchMediasByKeys } from "$lib/tmdb/tmdb";
  import type { MediaKey, MediaTMDB } from "$lib/tmdb/tmdb.decl";
  import ColMediaItem from "../../components/MediaItem/ColMediaItem.svelte";
  import ColItemSkeleton from "../../components/MediaItem/ColItemSkeleton.svelte";
  import { goto } from "$app/navigation";
  import type { Snapshot } from "./$types";
  import { observeIntersection } from "../../actions/intersectionObserver";
  import { userPreferences } from "../../stores/userPreferences.svelte";

  const PAGE_SIZE = 10;
  const TRIGGER_OFFSET = 3; // Load more when 3 items before end

  let medias = $state<MediaTMDB[]>([]);
  let snapshotToRestore = $state<{
    scrollTop: number;
    itemCount: number;
  } | null>(null);
  let isLoading = $state(false);
  let currentOffset = $state(0);
  let hasMore = $state(true);
  let isInitialized = $state(false);

  let allKeys = $derived(
    userPreferences.alreadyRecommendedKeys

    // test stuff, do not remove
    // new Array(200)
    //   .fill(0)
    //   .map((_, index) => `movie__${5000 + index}` as MediaKey)
  );

  async function loadMoreItems() {
    if (isLoading || !hasMore) return;

    isLoading = true;

    const nextKeys = allKeys.slice(currentOffset, currentOffset + PAGE_SIZE);

    if (nextKeys.length === 0) {
      hasMore = false;
      isLoading = false;
      return;
    }

    const newMedias = await fetchMediasByKeys(nextKeys);
    medias = [...medias, ...newMedias];
    currentOffset += PAGE_SIZE;

    if (currentOffset >= allKeys.length) {
      hasMore = false;
    }

    isLoading = false;
  }

  // Handle snapshot restoration reactively
  $effect(() => {
    if (snapshotToRestore && !isInitialized) {
      const { itemCount, scrollTop } = snapshotToRestore;

      // Load enough items to support the scroll position
      const batchesNeeded = Math.ceil(itemCount / PAGE_SIZE);

      (async () => {
        for (let i = 0; i < batchesNeeded; i++) {
          await loadMoreItems();
        }

        // Restore scroll position after items are loaded
        requestAnimationFrame(() => {
          const mainScrollContainer = document.querySelector(
            ".main-scroll-container"
          );
          if (mainScrollContainer) {
            mainScrollContainer.scrollTop = scrollTop;
          }
        });

        isInitialized = true;
      })();
    }
  });

  onMount(async () => {
    // Only do initial load if we don't have a snapshot to restore
    // Wait a tick to see if snapshot.restore() is called
    await tick();

    if (!snapshotToRestore) {
      await loadMoreItems();
      isInitialized = true;
    }
  });

  export const snapshot: Snapshot<{ scrollTop: number; itemCount: number }> = {
    capture: () => {
      const scrollTop =
        document.querySelector(".main-scroll-container")?.scrollTop ?? 0;
      const itemCount = medias.length;
      return { scrollTop, itemCount };
    },
    restore: (snapshot) => {
      snapshotToRestore = snapshot;
    }
  };
</script>

<div class="flex flex-col pt-2">
  {#each medias as media, index (media.id)}
    {#if index === medias.length - TRIGGER_OFFSET}
      <div
        use:observeIntersection={{
          onIntersect: loadMoreItems,
          root: ".main-scroll-container",
          threshold: 0.1
        }}
      >
        <ColMediaItem
          {media}
          onclick={(id, mediaType) => {
            goto(`/${mediaType}/${id}`);
          }}
        />
      </div>
    {:else}
      <ColMediaItem
        {media}
        onclick={(id, mediaType) => {
          goto(`/${mediaType}/${id}`);
        }}
      />
    {/if}
  {/each}

  {#if isLoading}
    {#each Array(1) as _, i (i)}
      <ColItemSkeleton />
    {/each}
  {/if}
</div>
