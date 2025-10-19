<script lang="ts">
  import mongoApi from "$lib/api/ratings";
  import { TMDB_MEDIA_TYPE } from "$lib/tmdb/tmdb.decl";
  import type { CrawlerRatings } from "$lib/api/ratings.decl";
  import Ratings from "./Ratings.svelte";
  import { watch } from "runed";
  import AnimatedDots from "../AnimatedDots/AnimatedDots.svelte";

  interface Props {
    mediaId: number;
    mediaType?: TMDB_MEDIA_TYPE;
  }

  let { mediaId, mediaType = TMDB_MEDIA_TYPE.MOVIE }: Props = $props();

  let ratings = $state<CrawlerRatings | null | undefined>(undefined);
  let loading = $state(true);
  let error = $state(false);

  watch(
    () => mediaId,
    (currMediaId, prevMediaId) => {
      // Skip if the mediaId hasn't actually changed
      if (ratings !== undefined && currMediaId === prevMediaId) {
        return;
      }

      loading = true;
      error = false;

      mongoApi
        .fetchRatings(mediaId, mediaType)
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
    }
  );

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

{#if loading}
  <div class="flex justify-center items-center h-[44px]">
    <p class="text-gray-400 text-sm">Loading ratings<AnimatedDots /></p>
  </div>
{:else if ratings}
  <Ratings {ratings} />
{/if}
