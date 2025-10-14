<script lang="ts">
  import type {
    MediaMinTMDB,
    MovieMinTMDB,
    ShowMinTMDB
  } from "$lib/tmdb/tmdb.decl";
  import PosterTmdb from "../../Poster/PosterTmdb.svelte";
  import * as m from "$lib/paraglide/messages.js";

  interface Props {
    movie: MediaMinTMDB;
    isSelected: boolean;
    onSelect: (movie: MediaMinTMDB) => void;
  }

  let { movie, isSelected, onSelect }: Props = $props();

  const isMovie = (media: MediaMinTMDB): media is MovieMinTMDB =>
    "title" in media;

  const title = $derived(isMovie(movie) ? movie.title : movie.name);

  const year = $derived.by(() => {
    if (isMovie(movie) && movie.release_date) {
      return new Date(movie.release_date).getFullYear();
    }
    if (!isMovie(movie) && movie.first_air_date) {
      return new Date(movie.first_air_date).getFullYear();
    }
    return m.movie_year_unknown();
  });
</script>

<button
  type="button"
  class={[
    "flex items-center gap-4 transition-all pr-4",
    "hover:bg-white/10 active:translate-y-[2px]",
    isSelected ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
  ].join(" ")}
  onclick={() => !isSelected && onSelect(movie)}
  disabled={isSelected}
>
  <PosterTmdb posterPath={movie.poster_path} height={120} />

  <div class="flex-1 text-left min-w-0">
    <p class="font-semibold truncate">{title}</p>
    <p class="text-sm text-white/60">{year}</p>
  </div>

  {#if isSelected}
    <span class="text-xs text-white/50 px-2">{m.form_search_selected()}</span>
  {/if}
</button>
