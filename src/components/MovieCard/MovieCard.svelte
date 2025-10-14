<script lang="ts">
  import PosterTmdb from "../Poster/PosterTmdb.svelte";
  import MediaRatings from "../MediaRatings/MediaRatings.svelte";
  import { ArrowSquareOut } from "phosphor-svelte";
  import Button from "../Button/Button.svelte";
  import * as m from "$lib/paraglide/messages.js";
  import { convertMinsToHrsMins } from "../../helpers/time.helpers";
  import type { MediaEnriched } from "../../stores/recommendationsStore.svelte";
  import type { MovieTMDB } from "$lib/tmdb/tmdb.decl";
  import { TMDB_MEDIA_TYPE } from "$lib/tmdb/tmdb.decl";

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

<div class="w-full flex flex-col gap-6 items-center p-4">
  {#if media.poster_path}
    <PosterTmdb posterPath={media.poster_path} height={200} />
  {/if}

  <div class="flex flex-col gap-0.5">
    <h2 class="font-title text-3xl text-center">{media.title}</h2>
    <p class="text-center text-sm text-gray-400">
      {#if media.director}
        {media.director} -
      {/if}
      {releaseYear}
      {#if runtimeFormatted}
        - {runtimeFormatted}
      {/if}
    </p>
  </div>

  <div class="flex flex-col gap-2">
    <MediaRatings mediaId={media.id} mediaType={TMDB_MEDIA_TYPE.MOVIE} />
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
    icon={ArrowSquareOut}
    class="!bg-miru !text-black"
    onclick={() => {
      window.open(`https://www.miru.live/movie/${media.id}`, "_blank");
    }}
  >
    {m.media_card_view_movie()}
  </Button>
</div>
