<script lang="ts">
  import * as m from "$lib/paraglide/messages.js";
  import { isMovie, isShow } from "$lib/tmdb/tmdb";
  import { TMDB_MEDIA_TYPE, type MediaTMDB } from "$lib/tmdb/tmdb.decl";
  import PosterTmdb from "../Poster/PosterTmdb.svelte";
  import ColItem from "./ColItem.svelte";

  type Props = {
    media: MediaTMDB;
    onclick: (id: number, mediaType: TMDB_MEDIA_TYPE) => void;
  };

  let { media, onclick }: Props = $props();

  let title = $derived(isMovie(media) ? media.title : media.name);

  let mediaType = $derived(
    isMovie(media) ? TMDB_MEDIA_TYPE.MOVIE : TMDB_MEDIA_TYPE.SHOW
  );

  let posterPath = $derived(media.poster_path);

  const subtitles = $derived.by(() => {
    if (isMovie(media)) {
      const releaseYear = media.release_date
        ? new Date(media.release_date).getFullYear()
        : null;
      const director = media.director ? media.director : null;
      return [`${director}`, `${releaseYear}`];
    }

    if (isShow(media)) {
      const releaseYear = media.first_air_date
        ? new Date(media.first_air_date).getFullYear()
        : null;
      const seasons = media.number_of_seasons;
      return [`${seasons} ${m.media_card_seasons()}`, `${releaseYear}`];
    }

    return null;
  });
</script>

<ColItem
  {posterPath}
  {title}
  {subtitles}
  onclick={() => onclick(media.id, mediaType)}
/>
