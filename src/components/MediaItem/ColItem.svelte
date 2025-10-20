<script lang="ts">
  import PosterTmdb from "../Poster/PosterTmdb.svelte";

  type Props = {
    posterPath: string | null;
    title: string;
    subtitles: string[] | null;
    onclick: () => void;
  };

  let { posterPath, title, subtitles, onclick }: Props = $props();
</script>

<div
  class="flex items-center gap-4 p-2 px-4 hover:bg-gray-800 cursor-pointer"
  {onclick}
>
  {#if posterPath}
    <PosterTmdb {posterPath} height={120} />
  {/if}
  <div class="flex flex-col gap-1">
    <h2 class="font-title text-2xl">{title}</h2>
    {#if subtitles}
      <div class="flex flex-col gap-1">
        {#each subtitles as subtitle}
          <p class="text-xs text-gray-400">{subtitle}</p>
        {/each}
      </div>
    {/if}
  </div>
</div>
