<script lang="ts">
  import { CRAWLER_SOURCE } from "$lib/api/ratings.decl";
  import { getCrawlerRatingsColor } from "../../helpers/ratings.helpers";
  import ScoreTag from "./ScoreTag.svelte";

  interface Props {
    title?: string | undefined;
    scores?: {
      value: number;
      divider: string;
    }[];
    crawlerSource?: CRAWLER_SOURCE;
    onclick?: () => void;
  }

  let {
    title = undefined,
    scores = [],
    crawlerSource = CRAWLER_SOURCE.AVERAGE,
    onclick
  }: Props = $props();

  const { backgroundColor, color } = $derived(
    getCrawlerRatingsColor(crawlerSource)
  );
</script>

<div class="RatingItem" {onclick}>
  {#if title}
    <h3 class="whitespace-pre-line" style:color={backgroundColor}>{title}</h3>
  {/if}

  <div class="scores">
    {#each scores as score}
      <ScoreTag value={score.value} divider={score.divider} {crawlerSource} />
    {/each}
  </div>
</div>

<style>
  .RatingItem {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    flex-shrink: 0;
    cursor: pointer;
  }

  .RatingItem h3 {
    font-size: 14px;
    font-weight: 500;
    border-radius: 8px;
    align-self: center;
  }

  .scores {
    display: flex;
    gap: 8px;
  }
</style>
