<script lang="ts">
  import type { MovieEnriched } from "./RecommendationsPage.svelte";
  import Card from "../MovieCard/MovieCard.svelte";
  import Button from "../Button/Button.svelte";
  import { ArrowRight, ThumbsDown, ThumbsUp } from "phosphor-svelte";
  import { moviePreferences } from "../../stores/moviePreferences.svelte";
  import IconButton from "../Button/IconButton.svelte";

  interface Props {
    movies: MovieEnriched[];
    onComplete: () => void;
  }

  let { movies, onComplete }: Props = $props();

  let currentMovieIndex = $state(0);
  let currentMovie = $derived(movies[currentMovieIndex]);

  function goToNextMovie() {
    // Mark this movie as already recommended (shown to user) with its reason
    moviePreferences.addAlreadyRecommended({
      movieId: currentMovie.id,
      reason: currentMovie.reason
    });

    currentMovieIndex++;
    if (currentMovieIndex >= movies.length) {
      onComplete();
    }
  }

  function handleDisliked() {
    moviePreferences.addDisliked(currentMovie.id);
    goToNextMovie();
  }

  function handleLiked() {
    moviePreferences.addLiked(currentMovie.id);
    goToNextMovie();
  }

  function handleNextMovie() {
    goToNextMovie();
  }
</script>

<div class="flex flex-1 min-h-0 flex-col w-full relative">
  <div class="flex-1 overflow-y-auto">
    <Card movie={currentMovie} />
  </div>

  <div class="flex p-4 gap-2 justify-between bg-background/90">
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
    </div>

    <IconButton
      component={ArrowRight}
      size={24}
      onclick={() => {
        handleNextMovie();
      }}
    />
  </div>
</div>
