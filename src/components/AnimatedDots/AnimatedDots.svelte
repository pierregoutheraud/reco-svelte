<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  let dotCount = $state(1);
  let interval: ReturnType<typeof setInterval> | null = null;

  onMount(() => {
    interval = setInterval(() => {
      dotCount = dotCount === 3 ? 1 : dotCount + 1;
    }, 500);
  });

  onDestroy(() => {
    if (interval) {
      clearInterval(interval);
    }
  });
</script>

<span class="inline-block min-w-[1.5em]">
  {".".repeat(dotCount)}
</span>
