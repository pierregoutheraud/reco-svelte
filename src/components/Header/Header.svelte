<script lang="ts">
  import {
    Bookmarks,
    BookmarkSimple,
    ClockCounterClockwise,
    Popcorn,
    Sparkle
  } from "phosphor-svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { userPreferences } from "../../stores/userPreferences.svelte";
  import IconButton from "../Button/IconButton.svelte";
  import { recommendationsStore } from "../../stores/recommendationsStore.svelte";
</script>

<header class="w-full flex p-2 justify-center gap-4">
  <IconButton
    icon={Sparkle}
    mode={["/", "/form"].includes(page.url.pathname) ? "default" : "ghost"}
    onclick={() => {
      goto("/form");
    }}
  />

  {#if recommendationsStore.hasRecommendations() || recommendationsStore.loading || page.url.pathname === "/recommendations"}
    <IconButton
      icon={Popcorn}
      mode={["/recommendations"].includes(page.url.pathname)
        ? "default"
        : "ghost"}
      onclick={() => {
        goto("/recommendations");
      }}
    />
  {/if}

  <div class="flex relative">
    <!-- {#if userPreferences.watchLater.length > 0}
      <span
        class="absolute z-50 top-0 right-[0px] size-5 text-center text-sm bg-teal-500"
      >
        {userPreferences.watchLater.length}
      </span>
    {/if} -->
    <IconButton
      icon={Bookmarks}
      mode={page.url.pathname === "/watchlater" ? "default" : "ghost"}
      onclick={() => {
        goto("/watchlater");
      }}
    />
  </div>
</header>
