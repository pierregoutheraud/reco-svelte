<script module>
  export type RecommendedFeedback = {
    dislikedMoviesIds: number[];
    likedMoviesIds: number[];
    watchedMoviesIds: number[];
  };
</script>

<script lang="ts">
  import type { MovieEnriched } from "./RecommendPage.svelte";
  import Card from "../Card/Card.svelte";
  import Button from "../Button/Button.svelte";
  import { ArrowRight, ThumbsDown, ThumbsUp } from "phosphor-svelte";

  interface Props {
    movies: MovieEnriched[];
    onComplete: (data: RecommendedFeedback) => void;
  }

  let { movies, onComplete }: Props = $props();

  let currentMovieIndex = $state(0);
  let currentMovie = $derived(movies[currentMovieIndex]);
  let dislikedMoviesIds = $state<number[]>([]);
  let likedMoviesIds = $state<number[]>([]);
  let watchedMoviesIds = $state<number[]>([]);

  function goToNextMovie() {
    currentMovieIndex++;
    if (currentMovieIndex >= movies.length) {
      onComplete({
        dislikedMoviesIds,
        likedMoviesIds,
        watchedMoviesIds
      });
    }
  }

  function handleDisliked() {
    dislikedMoviesIds.push(currentMovie.id);
    goToNextMovie();
  }

  function handleLiked() {
    likedMoviesIds.push(currentMovie.id);
    goToNextMovie();
  }

  function handleNextMovie() {
    watchedMoviesIds.push(currentMovie.id);
    goToNextMovie();
  }
</script>

<div class="w-full">
  <Card movie={currentMovie} />

  <div class="w-full h-[200px]"></div>

  <div
    class="flex flex-col gap-4 fixed bottom-0 left-0 right-0 p-4 bg-background/90"
  >
    <!-- <Button
      icon={ArrowsClockwise}
      iconPosition="left"
      onclick={() => {
        window.location.reload();
      }}
    >
      Try again
    </Button> -->

    <div class="flex gap-2 justify-between">
      <Button
        icon={ThumbsDown}
        iconPosition="right"
        class="!bg-rose-500"
        iconSize={24}
        onclick={() => {
          handleDisliked();
        }}
      >
        Disliked
      </Button>

      <Button
        icon={ThumbsUp}
        iconPosition="right"
        class="!bg-teal-500"
        iconSize={24}
        onclick={() => {
          handleLiked();
        }}
      >
        Liked
      </Button>

      <Button
        icon={ArrowRight}
        iconPosition="right"
        iconSize={24}
        onclick={() => {
          handleNextMovie();
        }}
      >
        Next
      </Button>
    </div>
  </div>
</div>
