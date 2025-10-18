<script lang="ts">
  import { fetchMediaById } from "$lib/tmdb/tmdb";
  import { TMDB_MEDIA_TYPE } from "$lib/tmdb/tmdb.decl";
  import MediaCard from "../../components/MovieCard/MediaCard.svelte";
  import type { MediaEnriched } from "../../stores/recommendationsStore.svelte";

  const mediaInfo = {
    id: 76341,
    type: TMDB_MEDIA_TYPE.MOVIE
  };

  const mediaPromise = fetchMediaById(mediaInfo.id, mediaInfo.type).then(
    (media) => {
      const mediaEnriched: MediaEnriched = {
        ...media!,
        reason: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      };
      return mediaEnriched;
    }
  );
</script>

{#await mediaPromise then media}
  <MediaCard {media} />
{/await}
