<script lang="ts">
  import {
    ArrowLeft,
    Bookmarks,
    ClockCounterClockwise,
    Popcorn,
    Sparkle
  } from "phosphor-svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import IconButton from "../Button/IconButton.svelte";
  import { recommendationsStore } from "../../stores/recommendationsStore.svelte";
</script>

<header class="w-full flex p-2 justify-center gap-4">
  <!-- {#if page.url.pathname.includes("/movie/") || page.url.pathname.includes("/tv/")}
    <IconButton
      class="absolute left-2"
      icon={ArrowLeft}
      mode="ghost"
      onclick={() => {
        window.history.back();
      }}
    />
  {/if} -->

  <IconButton
    icon={Sparkle}
    mode={["/", "/form"].includes(page.url.pathname) ? "default" : "ghost"}
    onclick={() => {
      goto("/form");
    }}
  />

  <!-- {#if recommendationsStore.hasRecommendations() || recommendationsStore.loading || page.url.pathname === "/recommendations"} -->
  <IconButton
    icon={Popcorn}
    mode={["/recommendations"].includes(page.url.pathname)
      ? "default"
      : "ghost"}
    onclick={() => {
      goto("/recommendations");
    }}
    disabled={!recommendationsStore.hasRecommendations() &&
      !recommendationsStore.loading}
  />
  <!-- {/if} -->

  <div class="flex relative">
    <!-- {#if userPreferences.watchlist.length > 0}
      <span
        class="absolute z-50 top-0 right-[0px] size-5 text-center text-sm bg-teal-500"
      >
        {userPreferences.watchlist.length}
      </span>
    {/if} -->
    <IconButton
      icon={Bookmarks}
      mode={page.url.pathname === "/watchlist" ? "default" : "ghost"}
      onclick={() => {
        goto("/watchlist");
      }}
    />
  </div>

  <IconButton
    icon={ClockCounterClockwise}
    mode={page.url.pathname === "/history" ? "default" : "ghost"}
    onclick={() => {
      goto("/history");
    }}
  />
</header>
