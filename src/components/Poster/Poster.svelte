<script lang="ts">
  import type { TMDB_MEDIA_TYPE } from "$lib/tmdb/tmdb.decl";

  interface Props {
    height?: number | undefined;
    width?: number | undefined;
    hasBoxShadow?: boolean;
    url: string;
    onclick?: () => void;
    mediaType?: TMDB_MEDIA_TYPE;
  }

  let {
    height = undefined,
    width = undefined,
    hasBoxShadow = false,
    url,
    mediaType,
    onclick
  }: Props = $props();

  if (!height && !width) {
    throw new Error(
      'Poster.svelte | You must provide either "height" or "width"'
    );
  }
</script>

<div
  class="aspect-[2/3] overflow-hidden shrink-0 relative"
  class:shadow-[0_0_20px_0px_rgba(0,0,0,0.5)]={hasBoxShadow}
  style:width={width ? `${width}px` : "auto"}
  style:height={height ? `${height}px` : "auto"}
  {onclick}
>
  <img
    src={url}
    alt="poster"
    class="block w-full h-full object-cover object-top"
  />
</div>
