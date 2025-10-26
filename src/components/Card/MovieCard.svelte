<script lang="ts">
  import { convertMinsToHrsMins } from "../../helpers/time.helpers";
  import type { MediaEnriched } from "../../stores/recommendationsStore.svelte";
  import type { MovieTMDB } from "$lib/tmdb/tmdb.decl";
  import { TMDB_MEDIA_TYPE } from "$lib/tmdb/tmdb.decl";
  import Card from "./Card.svelte";

  interface Props {
    media: MediaEnriched & MovieTMDB;
  }

  let { media }: Props = $props();

  const releaseYear = $derived(
    media.release_date ? new Date(media.release_date).getFullYear() : null
  );

  const runtimeFormatted = $derived.by(() =>
    media.runtime ? convertMinsToHrsMins(media.runtime) : null
  );
</script>

<Card
  id={media.id}
  mediaType={TMDB_MEDIA_TYPE.MOVIE}
  posterPath={media.poster_path}
  backdropPath={media.backdrop_path}
  title={media.title}
  reason={media.reason}
  overview={media.overview}
>
  {#snippet subtitle()}
    <p class="text-center text-sm text-gray-400">
      {#if media.director}
        {media.director} -
      {/if}
      {releaseYear}
      {#if runtimeFormatted}
        - {runtimeFormatted}
      {/if}
    </p>
  {/snippet}
</Card>
