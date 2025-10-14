<script lang="ts">
  import PosterTmdb from "../Poster/PosterTmdb.svelte";
  import MediaRatings from "../MediaRatings/MediaRatings.svelte";
  import { Television } from "phosphor-svelte";
  import Button from "../Button/Button.svelte";
  import * as m from "$lib/paraglide/messages.js";
  import type { MediaEnriched } from "../../stores/recommendationsStore.svelte";
  import type { ShowTMDB } from "$lib/tmdb/tmdb.decl";
  import { TMDB_MEDIA_TYPE } from "$lib/tmdb/tmdb.decl";

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

<div class="w-full flex flex-col gap-6 items-center p-4">
  {#if media.poster_path}
    <PosterTmdb posterPath={media.poster_path} height={200} />
  {/if}

  <div class="flex flex-col gap-1.5">
    <h2 class="font-title text-3xl text-center">{media.name}</h2>
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
  </div>

  <div class="flex flex-col gap-2">
    <MediaRatings mediaId={media.id} mediaType={TMDB_MEDIA_TYPE.SHOW} />
    <div class="flex flex-col gap-1 bg-indigo-900 p-4">
      <p class="font-semibold text-base">{m.movie_card_why_recommend()}</p>
      <p class="text-sm">{media.reason}</p>
    </div>
  </div>

  <div class="flex flex-col gap-1">
    <p class="font-semibold text-base">{m.movie_card_overview()}</p>
    <p class="text-sm">{media.overview}</p>
  </div>

  <Button
    icon={Television}
    class="!bg-miru !text-black"
    onclick={() => {
      window.open(
        `https://www.miru.live/${TMDB_MEDIA_TYPE.SHOW}/${media.id}`,
        "_blank"
      );
    }}
  >
    {m.media_card_view_series()}
  </Button>
</div>
