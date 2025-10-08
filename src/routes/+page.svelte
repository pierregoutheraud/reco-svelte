<script lang="ts">
  import { goto } from "$app/navigation";
  import Button from "../components/Button/Button.svelte";
  import { userPreferences } from "../stores/userPreferences.svelte";
  import * as m from "$lib/paraglide/messages.js";

  const hasHistory = $derived(userPreferences.history.length > 0);

  function handleStart() {
    goto("/form");
  }
</script>

<div
  class="relative flex flex-1 h-full flex-col gap-4 items-center justify-center w-full px-8"
>
  <h1 class="text-2xl font-bold text-center">
    {@html m.home_title()}
  </h1>

  <p class="text-base text-center">
    {@html m.home_subtitle()}
  </p>

  <Button onclick={handleStart}>{m.home_start_button()}</Button>

  {#if hasHistory}
    <p class="text-sm text-gray-500">{m.home_or()}</p>
    <a
      href="/history"
      class="text-base text-center text-blue-500 underline underline-offset-3"
    >
      {m.home_history_link()}
    </a>
  {/if}

  <p class="absolute bottom-6 right-6 text-sm text-center text-gray-500">
    {m.home_powered_by()}
    <a
      href="https://www.miru.live"
      target="_blank"
      class="text-blue-500 underline underline-offset-3"
    >
      miru.live
    </a>
  </p>
</div>
