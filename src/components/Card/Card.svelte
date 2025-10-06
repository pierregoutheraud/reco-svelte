<script lang="ts">
  import { ArrowLeft, ArrowRight, FilmSlate } from "phosphor-svelte";
  import Button from "../Button/Button.svelte";
  import PosterTmdb from "../Poster/PosterTmdb.svelte";
  import type { MovieEnriched } from "../RecommendPage/RecommendPage.svelte";
  import MovieRatings from "../MovieRatings/MovieRatings.svelte";

  interface Props {
    movie: MovieEnriched;
  }

  let { movie }: Props = $props();

  let releaseYear = $derived(
    movie.release_date ? new Date(movie.release_date).getFullYear() : null
  );

  let imdbId = $derived(movie.imdb_id);
</script>

<div class="w-full flex flex-col gap-6 items-center p-4">
  {#if movie.poster_path}
    <PosterTmdb posterPath={movie.poster_path} height={260} />
  {/if}

  <div class="flex flex-col gap-0.5">
    <h2 class="font-title text-3xl text-center">{movie.title}</h2>
    <p class="text-center text-sm text-gray-400">
      {movie.director} - {releaseYear}
    </p>
  </div>

  <MovieRatings movieId={movie.id} />

  <p class="text-left text-sm bg-indigo-900 p-2">
    {movie.reason}
  </p>
  <p class="text-left text-sm">{movie.overview}</p>

  <!-- <Button
    icon={FilmSlate}
    class="!bg-imdb !text-black"
    onclick={() => {
      window.open(`https://www.imdb.com/title/${imdbId}`, "_blank");
    }}
  >
    View on IMDb
  </Button> -->
</div>
