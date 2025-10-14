<script lang="ts">
  import { CRAWLER_SOURCE } from "$lib/api/ratings.decl";
  import { getCrawlerRatingsColor } from "../../helpers/ratings.helpers";

  interface Props {
    title?: string | undefined;
    scores?: {
      value: number;
      divider?: string;
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

<div
  class="flex flex-1 flex-col items-center shrink-0 cursor-pointer"
  {onclick}
>
  <!-- {#if title}
    <h3
      class="text-xs font-medium rounded-lg self-center whitespace-pre-line"
      style:color={backgroundColor}
    >
      {title}
    </h3>
  {/if} -->

  <div class="flex gap-2 flex-1 w-full">
    {#each scores as score}
      <div
        class="text-center p-1 pt-1.5 px-2 w-full"
        style:background-color={backgroundColor}
        style:color
      >
        <p class="text-xs">{title}</p>
        <p class="text-base font-medium inline-flex items-baseline gap-0.5">
          {score.value}
          {#if score.divider}
            <span class="text-xs font-normal opacity-60">
              {score.divider}
            </span>
          {/if}
        </p>
      </div>
    {/each}
  </div>
</div>
