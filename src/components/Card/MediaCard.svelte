<script lang="ts">
  import MovieCard from "./MovieCard.svelte";
  import SeriesCard from "./ShowCard.svelte";
  import type { MediaEnriched } from "../../stores/recommendationsStore.svelte";
  import type { MovieTMDB, ShowTMDB } from "$lib/tmdb/tmdb.decl";

  interface Props {
    media: MediaEnriched;
  }

  let { media }: Props = $props();

  // Type guards
  const isMovie = (m: MediaEnriched): m is MediaEnriched & MovieTMDB => {
    return "title" in m;
  };

  const isShow = (m: MediaEnriched): m is MediaEnriched & ShowTMDB => {
    return "name" in m;
  };
</script>

{#if isMovie(media)}
  <MovieCard {media} />
{:else if isShow(media)}
  <SeriesCard {media} />
{/if}
