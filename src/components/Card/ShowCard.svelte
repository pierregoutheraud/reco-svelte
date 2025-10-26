<script lang="ts">
  import * as m from "$lib/paraglide/messages.js";
  import type { MediaEnriched } from "../../stores/recommendationsStore.svelte";
  import type { ShowTMDB } from "$lib/tmdb/tmdb.decl";
  import { TMDB_MEDIA_TYPE } from "$lib/tmdb/tmdb.decl";
  import Card from "./Card.svelte";

  interface Props {
    media: MediaEnriched & ShowTMDB;
  }

  let { media }: Props = $props();

  const firstAirYear = $derived(
    media.first_air_date ? new Date(media.first_air_date).getFullYear() : null
  );

  const creator = $derived(
    media.created_by?.length > 0 ? media.created_by[0].name : null
  );

  const seasonsInfo = $derived.by(() => {
    const seasons = media.number_of_seasons;
    const episodes = media.number_of_episodes;
    const seasonLabel =
      seasons === 1 ? m.media_card_season() : m.media_card_seasons();
    const episodesLabel = m.media_card_episodes();
    return `${seasons} ${seasonLabel}, ${episodes} ${episodesLabel}`;
  });
</script>

<Card
  id={media.id}
  mediaType={TMDB_MEDIA_TYPE.SHOW}
  posterPath={media.poster_path}
  backdropPath={media.backdrop_path}
  title={media.name}
  reason={media.reason}
  overview={media.overview}
>
  {#snippet subtitle()}
    <div class="flex flex-col">
      <p class="text-center text-sm text-gray-400">
        {#if creator}
          {creator} -
        {/if}
        {firstAirYear}
      </p>
      {#if seasonsInfo}
        <p class="text-center text-sm text-gray-400">
          {seasonsInfo}
        </p>
      {/if}
    </div>
  {/snippet}
</Card>
