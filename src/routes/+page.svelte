<script lang="ts">
  import { goto } from "$app/navigation";
  import Button from "../components/Button/Button.svelte";
  import { moviePreferences } from "../stores/moviePreferences.svelte";

  const hasHistory = $derived(moviePreferences.history.length > 0);

  function handleStart() {
    goto("/form");
  }
</script>

<div
  class="flex flex-1 h-full flex-col gap-4 items-center justify-center w-full px-8"
>
  <h1 class="text-2xl font-bold text-center">
    Let's find a movie<br />for you!
  </h1>

  <p class="text-base text-center">
    This process will take<br />less than 2 minutes.
  </p>

  <Button onclick={handleStart}>Start</Button>

  {#if hasHistory}
    <p class="text-sm text-gray-500">or</p>
    <a
      href="/history"
      class="text-base text-center text-blue-500 underline underline-offset-3"
    >
      Recommendations history
    </a>
  {/if}

  <p class="absolute bottom-6 right-6 text-sm text-center text-gray-500">
    Powered by
    <a
      href="https://www.miru.live"
      target="_blank"
      class="text-blue-500 underline underline-offset-3"
    >
      miru.live
    </a>
  </p>
</div>
