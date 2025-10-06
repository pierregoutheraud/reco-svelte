<script lang="ts">
  import type { MovieEnriched } from "./RecommendPage.svelte";
  import PosterTmdb from "../Poster/PosterTmdb.svelte";
  import CardsList from "../CardsList/CardsList.svelte";
  import Card from "../Card/Card.svelte";
  import Button from "../Button/Button.svelte";
  import { ArrowLeft, ArrowRight, ArrowsClockwise } from "phosphor-svelte";
  import IconButton from "../Button/IconButton.svelte";

  interface Props {
    movies: MovieEnriched[];
  }

  let { movies }: Props = $props();

  let currentMovieIndex = $state(0);

  function nextMovie() {
    currentMovieIndex++;
    if (currentMovieIndex >= movies.length) {
      currentMovieIndex = 0;
    }
  }

  function previousMovie() {
    currentMovieIndex--;
    if (currentMovieIndex < 0) {
      currentMovieIndex = movies.length - 1;
    }
  }
</script>

<!-- <div class="flex flex-col gap-4">
  <CardsList items={movies}>
    {#snippet children({ item })}
      <Card movie={item} />
    {/snippet}
  </CardsList>
</div> -->

<div class="flex flex-col gap-4 items-center">
  <Card movie={movies[currentMovieIndex]} />

  <div
    class="flex gap-2 items-end fixed bottom-4 right-4 left-4 justify-between"
  >
    <!-- <Button
      icon={ArrowLeft}
      iconPosition="left"
      onclick={() => {
        previousMovie();
      }}>Previous</Button
    > -->

    <Button
      icon={ArrowsClockwise}
      iconPosition="left"
      onclick={() => {
        window.location.reload();
      }}
    >
      Try again
    </Button>

    <Button
      icon={ArrowRight}
      iconPosition="right"
      onclick={() => {
        nextMovie();
      }}
    >
      Next
    </Button>

    <!-- <IconButton
      component={ArrowRight}
      size={28}
      onclick={() => {
        nextMovie();
      }}
    /> -->
  </div>
</div>
