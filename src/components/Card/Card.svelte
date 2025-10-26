<script lang="ts">
  import PosterTmdb from "../Poster/PosterTmdb.svelte";
  import MediaRatings from "../MediaRatings/MediaRatings.svelte";
  import { ArrowSquareOut } from "phosphor-svelte";
  import Button from "../Button/Button.svelte";
  import * as m from "$lib/paraglide/messages.js";
  import { BACKDROP_SIZE, TMDB_MEDIA_TYPE } from "$lib/tmdb/tmdb.decl";
  import type { Snippet } from "svelte";
  import { getMiruUrl } from "../../helpers/miru.helpers";
  import { getImageUrl } from "$lib/tmdb/tmdb";

  interface Props {
    posterPath: string | null;
    backdropPath?: string | null;
    title: string;
    subtitle: Snippet;
    id: number;
    mediaType: TMDB_MEDIA_TYPE;
    reason: string | null;
    overview: string;
  }

  let {
    posterPath,
    backdropPath,
    title,
    subtitle,
    id,
    mediaType,
    reason,
    overview
  }: Props = $props();

  let backdropUrl = $derived(
    backdropPath ? getImageUrl(backdropPath, BACKDROP_SIZE.W1280) : null
  );
</script>

<div
  class="w-full min-h-full flex flex-col gap-4 items-center p-4 relative overflow-hidden"
>
  {#if backdropUrl}
    <div
      class="absolute z-10 inset-0 opacity-30 blur-xl scale-110 bg-cover bg-center"
      style:background-image="url('{backdropUrl}')"
    ></div>
  {/if}

  <div class="relative z-10 flex flex-col gap-4 items-center w-full">
    <div class="flex flex-col gap-3 items-center">
      {#if posterPath}
        <PosterTmdb {posterPath} height={200} />
      {/if}

      <div class="flex flex-col gap-0.5">
        <h2 class="font-title text-3xl text-center">{title}</h2>
        {@render subtitle()}
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <MediaRatings mediaId={id} {mediaType} />
      {#if reason}
        <div class="flex flex-col gap-1 bg-indigo-950 p-4">
          <p class="font-semibold text-base">{m.movie_card_why_recommend()}</p>
          <p class="text-sm">{reason}</p>
        </div>
      {/if}
    </div>

    <div class="flex flex-col gap-1">
      <p class="font-semibold text-base">{m.movie_card_overview()}</p>
      <p class="text-sm">{overview}</p>
    </div>

    <Button
      icon={ArrowSquareOut}
      class="!bg-miru !text-black"
      onclick={() => {
        window.open(getMiruUrl(mediaType, id), "_blank");
      }}
    >
      {m.media_card_view_movie()}
    </Button>
  </div>
</div>
