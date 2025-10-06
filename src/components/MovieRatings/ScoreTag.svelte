<script lang="ts">
  import type { CRAWLER_SOURCE } from "$lib/api/ratings.decl";
  import { getCrawlerRatingsColor } from "../../helpers/ratings.helpers";

  interface Props {
    value: number;
    divider?: string;
    title?: string;
    crawlerSource?: CRAWLER_SOURCE;
  }

  let { value, divider, title, crawlerSource }: Props = $props();

  const { backgroundColor, color } = $derived(
    getCrawlerRatingsColor(crawlerSource)
  );
</script>

<div
  class="flex flex-col px-2.5 py-[3px] items-center justify-center gap-0"
  style:background-color={backgroundColor}
>
  {#if title}
    <p class="text-[13px] font-normal pt-px" style:color>
      {title}
    </p>
  {/if}
  <p class="text-lg font-medium" style:color>
    {value}<span class="text-xs font-normal opacity-70">{divider}</span>
  </p>
</div>
