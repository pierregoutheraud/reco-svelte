<script lang="ts">
  import mongoApi from "$lib/api/ratings";
  import { TMDB_MEDIA_TYPE } from "$lib/tmdb/tmdb.decl";
  import type { CrawlerRatings } from "$lib/api/ratings.decl";
  import { CRAWLER_SOURCE } from "$lib/api/ratings.decl";
  import Ratings from "./Ratings.svelte";

  interface Props {
    movieId: number;
    mediaType?: TMDB_MEDIA_TYPE;
  }

  let { movieId, mediaType = TMDB_MEDIA_TYPE.MOVIE }: Props = $props();

  let ratings = $state<CrawlerRatings | null>(null);
  let loading = $state(true);
  let error = $state(false);

  $effect(() => {
    loading = true;
    error = false;

    mongoApi
      .fetchRatings(movieId, mediaType)
      .then((fetchedRatings) => {
        if (fetchedRatings) {
          ratings = fetchedRatings;
        } else {
          error = true;
        }
      })
      .catch((err) => {
        console.error("Error fetching ratings:", err);
        error = true;
      })
      .finally(() => {
        loading = false;
      });
  });

  function formatScore(score: number | null): string {
    if (score === null) return "N/A";
    return score.toFixed(1);
  }

  function getScoreColor(score: number | null, max = 10): string {
    if (score === null) return "text-gray-500";
    const normalized = (score / max) * 100;
    if (normalized >= 75) return "text-green-500";
    if (normalized >= 60) return "text-yellow-500";
    return "text-red-500";
  }
</script>

<div class="h-[50px]">
  {#if loading}
    <!-- <div class="flex justify-center items-center py-4">
    <p class="text-gray-400 text-sm">Loading ratings...</p>
  </div> -->
  {:else if error || !ratings}
    <!-- <div class="flex justify-center items-center py-4">
    <p class="text-gray-500 text-sm">Ratings unavailable</p>
  </div> -->
  {:else}
    <Ratings {ratings} title="Movie title" releaseDate="2025-01-01" />
  {/if}
</div>
