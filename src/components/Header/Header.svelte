<script lang="ts">
  import { ClockCounterClockwise, Popcorn } from "phosphor-svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { userPreferences } from "../../stores/userPreferences.svelte";
  import IconButton from "../Button/IconButton.svelte";
</script>

<header class="w-full flex p-2 justify-center gap-4">
  <IconButton
    icon={Popcorn}
    mode={["/", "/form", "/recommendations"].includes(page.url.pathname)
      ? "default"
      : "ghost"}
    onclick={() => {
      goto("/");
    }}
  />
  <div class="flex relative">
    {#if userPreferences.watchLater.length > 0}
      <span
        class="absolute z-50 top-0 right-[-5px] size-5 text-center text-sm bg-teal-500"
      >
        {userPreferences.watchLater.length}
      </span>
    {/if}
    <IconButton
      icon={ClockCounterClockwise}
      mode={page.url.pathname === "/watchlater" ? "default" : "ghost"}
      onclick={() => {
        goto("/watchlater");
      }}
    />
  </div>
</header>
