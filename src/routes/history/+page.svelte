<script lang="ts">
  import { onMount } from "svelte";
  import { fetchMediasByKeys } from "$lib/tmdb/tmdb";
  import type { MediaTMDB } from "$lib/tmdb/tmdb.decl";
  import ColMediaItem from "../../components/MediaItem/ColMediaItem.svelte";
  import ColItemSkeleton from "../../components/MediaItem/ColItemSkeleton.svelte";
  import { preloadData, pushState } from "$app/navigation";
  import { observeIntersection } from "../../actions/intersectionObserver";
  import { userPreferences } from "../../stores/userPreferences.svelte";

  const PAGE_SIZE = 20;
  const TRIGGER_OFFSET = 3; // Load more when 3 items before end

  let medias = $state<MediaTMDB[]>([]);
  let isLoading = $state(false);
  let currentOffset = $state(0);
  let hasMore = $state(true);

  let allKeys = $derived(userPreferences.alreadyRecommendedKeys);

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

  async function handleMediaClick(
    e: MouseEvent,
    id: number,
    mediaType: "movie" | "tv"
  ) {
    // Bail if modifier keys
    if (e.shiftKey || e.metaKey || e.ctrlKey) return;

    // Prevent navigation
    e.preventDefault();

    const href = `/${mediaType}/${id}`;

    // Preload the code for faster modal opening
    await preloadData(href);

    // Use shallow routing to show modal
    pushState(href, { showModal: true, mediaType, mediaId: String(id) });
  }

  onMount(async () => {
    await loadMoreItems();
  });
</script>

<div class="flex flex-col pt-2">
  {#each medias as media, index (media.id)}
    {@const mediaType = "title" in media ? "movie" : "tv"}
    {#if index === medias.length - TRIGGER_OFFSET}
      <div
        use:observeIntersection={{
          onIntersect: loadMoreItems,
          root: ".main-scroll-container",
          threshold: 0.1
        }}
      >
        <a
          href="/{mediaType}/{media.id}"
          onclick={(e) => handleMediaClick(e, media.id, mediaType)}
        >
          <ColMediaItem {media} onclick={() => {}} />
        </a>
      </div>
    {:else}
      <a
        href="/{mediaType}/{media.id}"
        onclick={(e) => handleMediaClick(e, media.id, mediaType)}
      >
        <ColMediaItem {media} onclick={() => {}} />
      </a>
    {/if}
  {/each}

  {#if isLoading}
    {#each Array(1) as _, i (i)}
      <ColItemSkeleton />
    {/each}
  {/if}
</div>
