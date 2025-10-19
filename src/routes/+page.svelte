<script lang="ts">
  import { goto } from "$app/navigation";
  import Button from "../components/Button/Button.svelte";
  import Link from "../components/Button/Link.svelte";
  import { userPreferences } from "../stores/userPreferences.svelte";
  import * as m from "$lib/paraglide/messages.js";

  // const hasWatchlist = $derived(userPreferences.watchlist.length > 0);

  function handleStart() {
    goto("/form");
  }
</script>

<div
  class="relative flex flex-1 h-full flex-col gap-6 items-center justify-center w-full px-8"
>
  <h1 class="text-3xl font-bold font-title tracking-wider text-center">
    {@html m.home_title()}
  </h1>

  <p class="text-base text-center">
    {@html m.home_subtitle()}
  </p>

  <Button onclick={handleStart}>{m.home_start_button()}</Button>

  <!-- <p class="text-sm text-gray-500">{m.home_or()}</p>
  <Link href="/watchlist" class="text-base text-center">
    {m.home_watch_later_link()} ({userPreferences.watchlist.length})
  </Link> -->

  <p class="text-sm text-center text-gray-500">
    {m.home_powered_by()}
    <Link href="https://www.miru.live" target="_blank">miru.live</Link>
  </p>
</div>
