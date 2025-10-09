<script lang="ts">
  import "../app.css";
  import type { Snippet } from "svelte";
  import IconButton from "../components/Button/IconButton.svelte";
  import { ClockCounterClockwise, House } from "phosphor-svelte";
  import { goto } from "$app/navigation";

  type Props = {
    children: Snippet;
  };

  let { children }: Props = $props();
</script>

<main
  class="flex flex-col w-full max-w-[500px] h-full max-h-[1000px] mx-auto bg-background overflow-auto overflow-x-hidden"
>
  <!-- <div class="flex-1 min-h-0"> -->
  {@render children?.()}
  <!-- </div>
  <footer class="w-full flex p-3 justify-center gap-4">
    <IconButton
      icon={House}
      onclick={() => {
        goto("/");
      }}
    />
    <IconButton
      icon={ClockCounterClockwise}
      onclick={() => {
        goto("/history");
      }}
    />
  </footer> -->
</main>
