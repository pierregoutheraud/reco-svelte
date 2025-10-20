<script lang="ts">
  import { page } from "$app/state";
  import { fetchMediaById } from "$lib/tmdb/tmdb";
  import { TMDB_MEDIA_TYPE } from "$lib/tmdb/tmdb.decl";
  import MediaCard from "../../../components/Card/MediaCard.svelte";
  import type { MediaEnriched } from "../../../stores/recommendationsStore.svelte";

  // Use page.params.id for normal navigation, fallback to page.state.mediaId for modal
  const id = $derived(page.params.id || page.state.mediaId);

  const mediaPromise = $derived(
    fetchMediaById(Number(id), TMDB_MEDIA_TYPE.MOVIE).then((media) => {
      const mediaEnriched: MediaEnriched = {
        ...media!,
        reason: null
      };
      return mediaEnriched;
    })
  );
</script>

{#await mediaPromise then media}
  <MediaCard {media} />
{/await}
