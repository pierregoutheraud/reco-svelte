<script lang="ts" generics="T">
  import type { Snippet } from "svelte";

  interface Props {
    items: T[];
    children: Snippet<[{ item: T }]>;
  }

  let { items, children }: Props = $props();
</script>

<div class="flex flex-col gap-4 border-1 border-red-500">
  {#each items as item}
    {@render children({ item })}
  {/each}
</div>
