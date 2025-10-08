<script lang="ts">
  import { X } from "phosphor-svelte";
  import type { MovieMinTMDB } from "$lib/tmdb/tmdb.decl";
  import PosterTmdb from "../../Poster/PosterTmdb.svelte";
  import * as m from "$lib/paraglide/messages.js";

  interface Props {
    movie: MovieMinTMDB;
    onRemove: (id: number) => void;
  }

  let { movie, onRemove }: Props = $props();

  let year = $derived(
    movie.release_date
      ? new Date(movie.release_date).getFullYear()
      : m.movie_year_unknown()
  );
</script>

<div class="flex items-center gap-4 bg-main/15 p-2">
  <PosterTmdb posterPath={movie.poster_path} height={60} />

  <div class="flex-1 min-w-0">
    <p class="text-sm font-semibold truncate">{movie.title}</p>
    <p class="text-xs text-white/60">{year}</p>
  </div>

  <button
    type="button"
    onclick={() => onRemove(movie.id)}
    class="p-1 hover:bg-white/10 transition-colors"
  >
    <X size={24} />
  </button>
</div>
