<script lang="ts">
  import PosterTmdb from "../Poster/PosterTmdb.svelte";
  import type { MovieEnriched } from "../RecommendPage/RecommendationsPage.svelte";
  import MovieRatings from "../MovieRatings/MovieRatings.svelte";
  import { FilmStrip } from "phosphor-svelte";
  import Button from "../Button/Button.svelte";
  import * as m from "$lib/paraglide/messages.js";
  import { convertMinsToHrsMins } from "../../helpers/time.helpers";

  interface Props {
    movie: MovieEnriched;
  }

  let { movie }: Props = $props();

  let releaseYear = $derived(
    movie.release_date ? new Date(movie.release_date).getFullYear() : null
  );

  let runtime = $derived(movie.runtime ? `${movie.runtime} min` : null);
  let runtimeFormatted = $derived(
    movie.runtime ? convertMinsToHrsMins(movie.runtime) : null
  );
</script>

<div class="w-full flex flex-col gap-6 items-center p-4">
  {#if movie.poster_path}
    <PosterTmdb posterPath={movie.poster_path} height={260} />
  {/if}

  <div class="flex flex-col gap-0.5">
    <h2 class="font-title text-3xl text-center">{movie.title}</h2>
    <p class="text-center text-sm text-gray-400">
      {movie.director} - {releaseYear} - {runtimeFormatted}
    </p>
  </div>

  <MovieRatings movieId={movie.id} />

  <div class="flex flex-col gap-1 bg-indigo-900 p-4">
    <p class="font-semibold text-base">{m.movie_card_why_recommend()}</p>
    <p class="text-sm">{movie.reason}</p>
  </div>

  <div class="flex flex-col gap-1">
    <p class="font-semibold text-base">{m.movie_card_overview()}</p>
    <p class="text-sm">{movie.overview}</p>
  </div>

  <Button
    icon={FilmStrip}
    class="!bg-miru !text-black"
    onclick={() => {
      window.open(`https://www.miru.live/movie/${movie.id}`, "_blank");
    }}
  >
    {m.movie_card_view_on_miru()}
  </Button>
</div>
