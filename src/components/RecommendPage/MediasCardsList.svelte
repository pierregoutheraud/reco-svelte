<script lang="ts">
  import MediaCard from "../Card/MediaCard.svelte";
  import { ArrowLeft, ArrowRight, ArrowsClockwise } from "phosphor-svelte";
  import { userPreferences } from "../../stores/userPreferences.svelte";
  import IconButton from "../Button/IconButton.svelte";
  import type { MediaEnriched } from "../../stores/recommendationsStore.svelte";
  import type { MovieTMDB } from "$lib/tmdb/tmdb.decl";
  import { toasts } from "../../stores/toasts.store";
  import { getMediaType } from "$lib/tmdb/tmdb";
  import MediaActions from "../MediaActions/MediaActions.svelte";

  interface Props {
    medias: MediaEnriched[];
    currentMovieId?: number;
    onComplete: () => void;
    onDelete?: () => void;
  }

  let { medias, onComplete, currentMovieId = $bindable() }: Props = $props();

  let currentMovieIndex = $state(0);
  let currentMedia = $derived(medias?.[currentMovieIndex]);

  // Type guard
  const isMovie = (m: MediaEnriched): m is MediaEnriched & MovieTMDB =>
    "title" in m;

  // Get current media type
  const currentMediaType = $derived(getMediaType(currentMedia));

  // Check if the current media is already liked or disliked
  const isCurrentMediaLiked = $derived(
    currentMedia && userPreferences.isLiked(currentMedia.id)
  );
  const isCurrentMediaDisliked = $derived(
    currentMedia && userPreferences.isDisliked(currentMedia.id)
  );
  const isCurrentMediaInWatchlist = $derived(
    currentMedia &&
      userPreferences.getWatchlistByMediaId(currentMedia.id) !== undefined
  );

  // Update the bindable currentMovieId when current media changes
  $effect(() => {
    if (currentMedia) {
      currentMovieId = currentMedia.id;
    }
  });

  function goToNextMedia() {
    // Mark this media as already recommended (shown to user)
    userPreferences.addAlreadyRecommended(currentMedia.id, currentMediaType);

    currentMovieIndex++;
    if (currentMovieIndex >= medias.length) {
      onComplete();
    }
  }

  function goToPreviousMedia() {
    if (currentMovieIndex === 0) {
      return;
    }

    currentMovieIndex--;
  }

  function handleNextMedia() {
    goToNextMedia();
  }

  function handlePreviousMedia() {
    goToPreviousMedia();
  }
</script>

{#if currentMedia}
  <div class="flex flex-1 min-h-0 flex-col w-full relative">
    <div class="flex-1 overflow-y-auto">
      <MediaCard media={currentMedia} />
    </div>

    <MediaActions media={currentMedia}>
      {#snippet right()}
        <div class="flex gap-3 items-center">
          <IconButton
            icon={ArrowLeft}
            mode="ghost"
            size={24}
            disabled={currentMovieIndex === 0}
            onclick={() => {
              handlePreviousMedia();
            }}
          />

          <p class="flex gap-0 items-baseline">
            <span class="font-semibold">{currentMovieIndex + 1}</span>
            <span class="text-sm text-gray-400">/{medias.length}</span>
          </p>

          <IconButton
            mode="ghost"
            icon={currentMovieIndex === medias.length - 1
              ? ArrowsClockwise
              : ArrowRight}
            size={24}
            onclick={() => {
              handleNextMedia();
            }}
          />
        </div>
      {/snippet}
    </MediaActions>
  </div>
{/if}
