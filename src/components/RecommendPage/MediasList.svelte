<script lang="ts">
  import MediaCard from "../MovieCard/MediaCard.svelte";
  import {
    ArrowLeft,
    ArrowRight,
    ArrowsClockwise,
    ListPlus,
    ThumbsDown,
    ThumbsUp
  } from "phosphor-svelte";
  import { userPreferences } from "../../stores/userPreferences.svelte";
  import IconButton from "../Button/IconButton.svelte";
  import type { MediaEnriched } from "../../stores/recommendationsStore.svelte";
  import type { MovieTMDB, ShowTMDB } from "$lib/tmdb/tmdb.decl";
  import { TMDB_MEDIA_TYPE } from "$lib/tmdb/tmdb.decl";

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
  const currentMediaType = $derived(
    currentMedia
      ? isMovie(currentMedia)
        ? TMDB_MEDIA_TYPE.MOVIE
        : TMDB_MEDIA_TYPE.SHOW
      : TMDB_MEDIA_TYPE.MOVIE
  );

  // Check if the current media is already liked or disliked
  const isCurrentMediaLiked = $derived(
    currentMedia && userPreferences.isLiked(currentMedia.id)
  );
  const isCurrentMediaDisliked = $derived(
    currentMedia && userPreferences.isDisliked(currentMedia.id)
  );
  const isCurrentMediaInWatchLater = $derived(
    currentMedia &&
      userPreferences.getWatchLaterByMediaId(currentMedia.id) !== undefined
  );

  // Update the bindable currentMovieId when current media changes
  $effect(() => {
    if (currentMedia) {
      currentMovieId = currentMedia.id;
    }
  });

  // $inspect({
  //   watchLater: userPreferences.watchLater,
  //   liked: userPreferences.liked,
  //   disliked: userPreferences.disliked,
  //   alreadyRecommended: userPreferences.alreadyRecommended
  // });

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

  function handleDisliked() {
    userPreferences.addDisliked(currentMedia.id, currentMediaType);
  }

  function handleLiked() {
    userPreferences.addLiked(currentMedia.id, currentMediaType);
  }

  function handleNextMedia() {
    goToNextMedia();
  }

  function handlePreviousMedia() {
    goToPreviousMedia();
  }

  function handleClickWatchLater() {
    if (isCurrentMediaInWatchLater) {
      userPreferences.removeFromWatchLater(currentMedia.id);
    } else {
      userPreferences.addToWatchLater(
        currentMedia.id,
        currentMediaType,
        currentMedia.reason
      );
    }
  }
</script>

{#if currentMedia}
  <div class="flex flex-1 min-h-0 flex-col w-full relative">
    <div class="flex-1 overflow-y-auto">
      <MediaCard media={currentMedia} />
    </div>

    <div class="flex p-3 px-4 gap-2 justify-between bg-background/90">
      <div class="flex gap-2">
        <IconButton
          icon={ThumbsDown}
          class="bg-rose-500"
          size={24}
          weight={isCurrentMediaDisliked ? "fill" : "regular"}
          onclick={() => {
            handleDisliked();
          }}
        />

        <IconButton
          icon={ThumbsUp}
          class="bg-teal-500"
          size={24}
          weight={isCurrentMediaLiked ? "fill" : "regular"}
          onclick={() => {
            handleLiked();
          }}
        />

        <IconButton
          icon={ListPlus}
          size={24}
          weight={isCurrentMediaInWatchLater ? "fill" : "regular"}
          onclick={() => {
            handleClickWatchLater();
          }}
        />
      </div>

      <div class="flex gap-3 items-center">
        <IconButton
          icon={ArrowLeft}
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
          icon={currentMovieIndex === medias.length - 1
            ? ArrowsClockwise
            : ArrowRight}
          size={24}
          onclick={() => {
            handleNextMedia();
          }}
        />
      </div>
    </div>
  </div>
{/if}
