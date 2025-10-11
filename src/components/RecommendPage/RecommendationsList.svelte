<script lang="ts">
  import Card from "../MovieCard/MovieCard.svelte";
  import { ArrowRight, ListPlus, ThumbsDown, ThumbsUp } from "phosphor-svelte";
  import { userPreferences } from "../../stores/userPreferences.svelte";
  import IconButton from "../Button/IconButton.svelte";
  import type { MovieEnriched } from "../../stores/recommendationsStore.svelte";
  import Button from "../Button/Button.svelte";

  interface Props {
    movies: MovieEnriched[];
    onComplete: () => void;
    onDelete?: () => void;
    currentMovieId?: number;
  }

  let { movies, onComplete, currentMovieId = $bindable() }: Props = $props();

  let currentMovieIndex = $state(0);
  let currentMovie = $derived(movies?.[currentMovieIndex]);

  // Check if the current movie is already liked or disliked
  let isCurrentMovieLiked = $derived(
    currentMovie && userPreferences.liked.includes(currentMovie.id)
  );
  let isCurrentMovieDisliked = $derived(
    currentMovie && userPreferences.disliked.includes(currentMovie.id)
  );
  let isCurrentMovieInWatchLater = $derived(
    currentMovie &&
      userPreferences.watchLater.some((item) => item.id === currentMovie.id)
  );

  // Update the bindable currentMovieId when current movie changes
  $effect(() => {
    if (currentMovie) {
      currentMovieId = currentMovie.id;
    }
  });

  // $inspect({
  //   watchLater: userPreferences.watchLater,
  //   liked: userPreferences.liked,
  //   disliked: userPreferences.disliked,
  //   alreadyRecommended: userPreferences.alreadyRecommended
  // });

  function goToNextMovie() {
    // Mark this movie as already recommended (shown to user) with its reason
    userPreferences.addAlreadyRecommended(currentMovie.id);

    currentMovieIndex++;
    if (currentMovieIndex >= movies.length) {
      onComplete();
    }
  }

  function handleDisliked() {
    userPreferences.addDisliked(currentMovie.id);
    // goToNextMovie();
  }

  function handleLiked() {
    userPreferences.addLiked(currentMovie.id);
    // goToNextMovie();
  }

  function handleNextMovie() {
    goToNextMovie();
  }

  function handleClickWatchLater() {
    if (isCurrentMovieInWatchLater) {
      userPreferences.removeFromWatchLater(currentMovie.id);
    } else {
      userPreferences.addToWatchLater(currentMovie.id, currentMovie.reason);
    }
  }
</script>

{#if currentMovie}
  <div class="flex flex-1 min-h-0 flex-col w-full relative">
    <div class="flex-1 overflow-y-auto">
      <Card movie={currentMovie} />
    </div>

    <div class="flex p-2 gap-2 justify-between bg-background/90">
      <!-- <Button
      icon={ArrowsClockwise}
      iconPosition="left"
      onclick={() => {
        window.location.reload();
      }}
    >
      Try again
    </Button> -->

      <div class="flex gap-2">
        <IconButton
          icon={ThumbsDown}
          class="bg-rose-500"
          size={24}
          weight={isCurrentMovieDisliked ? "fill" : "regular"}
          onclick={() => {
            handleDisliked();
          }}
        />

        <IconButton
          icon={ThumbsUp}
          class="bg-teal-500"
          size={24}
          weight={isCurrentMovieLiked ? "fill" : "regular"}
          onclick={() => {
            handleLiked();
          }}
        />

        <IconButton
          icon={ListPlus}
          size={24}
          weight={isCurrentMovieInWatchLater ? "fill" : "regular"}
          onclick={() => {
            handleClickWatchLater();
          }}
        />
      </div>

      <IconButton
        icon={ArrowRight}
        size={24}
        onclick={() => {
          handleNextMovie();
        }}
      />
    </div>
  </div>
{/if}
