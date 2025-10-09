<script lang="ts">
  import type { MovieEnriched } from "./RecommendationsPage.svelte";
  import Card from "../MovieCard/MovieCard.svelte";
  import Button from "../Button/Button.svelte";
  import { ArrowRight, ThumbsDown, ThumbsUp } from "phosphor-svelte";
  import { userPreferences } from "../../stores/userPreferences.svelte";
  import IconButton from "../Button/IconButton.svelte";
  import * as m from "$lib/paraglide/messages.js";

  interface Props {
    movies: MovieEnriched[];
    onComplete: () => void;
    currentMovieId?: number;
  }

  let { movies, onComplete, currentMovieId = $bindable() }: Props = $props();

  let currentMovieIndex = $state(0);
  let currentMovie = $derived(movies[currentMovieIndex]);

  // Check if the current movie is already liked or disliked
  let isCurrentMovieLiked = $derived(
    currentMovie && userPreferences.liked.includes(currentMovie.id)
  );
  let isCurrentMovieDisliked = $derived(
    currentMovie && userPreferences.disliked.includes(currentMovie.id)
  );

  // Update the bindable currentMovieId when current movie changes
  $effect(() => {
    if (currentMovie) {
      currentMovieId = currentMovie.id;
    }
  });

  function goToNextMovie() {
    // Mark this movie as already recommended (shown to user) with its reason
    userPreferences.addAlreadyRecommended({
      movieId: currentMovie.id,
      reason: currentMovie.reason
    });

    currentMovieIndex++;
    if (currentMovieIndex >= movies.length) {
      onComplete();
    }
  }

  function handleDisliked() {
    userPreferences.addDisliked(currentMovie.id);
    goToNextMovie();
  }

  function handleLiked() {
    userPreferences.addLiked(currentMovie.id);
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
        iconWeight={isCurrentMovieDisliked ? "fill" : "regular"}
        onclick={() => {
          handleDisliked();
        }}
      >
        {m.recommendations_disliked_button()}
      </Button>

      <Button
        icon={ThumbsUp}
        iconPosition="right"
        class="!bg-teal-500"
        iconSize={24}
        iconWeight={isCurrentMovieLiked ? "fill" : "regular"}
        onclick={() => {
          handleLiked();
        }}
      >
        {m.recommendations_liked_button()}
      </Button>
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
