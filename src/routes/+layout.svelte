<script lang="ts">
  import "../app.css";
  import type { Snippet } from "svelte";

  type Props = {
    children: Snippet;
  };

  let { children }: Props = $props();
</script>

<main
  class="w-full max-w-[500px] h-full max-h-[1000px] mx-auto bg-background overflow-auto"
>
  {@render children?.()}
</main>
