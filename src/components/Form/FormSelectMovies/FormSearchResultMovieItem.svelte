<script lang="ts">
  import type { MovieMinTMDB } from "$lib/tmdb/tmdb.decl";
  import PosterTmdb from "../../Poster/PosterTmdb.svelte";

  interface Props {
    movie: MovieMinTMDB;
    isSelected: boolean;
    onSelect: (movie: MovieMinTMDB) => void;
  }

  let { movie, isSelected, onSelect }: Props = $props();

  let year = $derived(
    movie.release_date ? new Date(movie.release_date).getFullYear() : "Unknown"
  );
</script>

<button
  type="button"
  class={[
    "flex items-center gap-4 transition-all",
    "hover:bg-white/10 active:translate-y-[2px]",
    isSelected ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
  ].join(" ")}
  onclick={() => !isSelected && onSelect(movie)}
  disabled={isSelected}
>
  <PosterTmdb posterPath={movie.poster_path} height={120} />

  <div class="flex-1 text-left min-w-0">
    <p class="font-semibold truncate">{movie.title}</p>
    <p class="text-sm text-white/60">{year}</p>
  </div>

  {#if isSelected}
    <span class="text-xs text-white/50 px-2">Selected</span>
  {/if}
</button>
