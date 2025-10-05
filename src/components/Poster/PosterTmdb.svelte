<script lang="ts">
  import { getPosterUrl } from "$lib/tmdb/tmdb";
  import type { TMDB_MEDIA_TYPE } from "$lib/tmdb/tmdb.decl";
  import Poster from "./Poster.svelte";

  interface Props {
    posterPath: string;
    height?: number | undefined;
    width?: number | undefined;
    hasBoxShadow?: boolean;
    mediaType?: TMDB_MEDIA_TYPE;
    onclick?: () => void;
  }

  let {
    posterPath,
    height = undefined,
    width = undefined,
    hasBoxShadow = false,
    mediaType,
    onclick
  }: Props = $props();

  if (!height && !width) {
    throw new Error('PosterTmdb | You must provide either "height" or "width"');
  }

  let posterUrl = $derived(
    getPosterUrl(
      posterPath,
      width
        ? { width, height: undefined as never }
        : { width: undefined as never, height: height! }
    )
  );
</script>

{#if posterUrl}
  <Poster
    {width}
    {height}
    url={posterUrl}
    {hasBoxShadow}
    {onclick}
    {mediaType}
  />
{/if}
