<script lang="ts">
  import { fetchMediaById } from "$lib/tmdb/tmdb";
  import { TMDB_MEDIA_TYPE } from "$lib/tmdb/tmdb.decl";
  import MediaCard from "../../components/MovieCard/MediaCard.svelte";
  import type { MediaEnriched } from "../../stores/recommendationsStore.svelte";

  const mediaId = 1399;
  const mediaType = TMDB_MEDIA_TYPE.SHOW;
  const mediaPromise = fetchMediaById(mediaId, mediaType).then((media) => {
    const mediaEnriched: MediaEnriched = {
      ...media!,
      reason: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    };
    return mediaEnriched;
  });
</script>

<!-- <Button mode="ghost">Hello</Button>
<Button>Hello</Button>
<IconButton icon={House} mode="ghost" />
<IconButton icon={House} /> -->

{#await mediaPromise then media}
  <MediaCard {media} />
{/await}

<!-- <OptimisticProgressBar
  texts={[
    "Analyzing your taste...",
    "Scanning decades of cinema...",
    "Consulting the film archives...",
    "Reading between the frames...",
    "Curating your perfect lineup..."
  ]}
  subtext="This will take around 40 seconds."
  duration={60}
/> -->
