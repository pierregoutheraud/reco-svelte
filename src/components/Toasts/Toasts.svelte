<script lang="ts">
  import { preventDefault } from "svelte/legacy";

  import { fly } from "svelte/transition";
  import { flip } from "svelte/animate";
  import CheckMarkIcon from "./Icons/CheckMarkIcon.svelte";
  import ErrorIcon from "./Icons/ErrorIcon.svelte";
  import LoadingIcon from "./Icons/LoadingIcon.svelte";
  import { toasts, TOAST_TYPES } from "../../stores/toasts.store";
  import { goto } from "$app/navigation";
  import { Info } from "phosphor-svelte";
  import Button from "../Button/Button.svelte";

  async function remove() {
    if ($toasts.messages.length === 0) return;
    toasts.remove($toasts.messages[0].id);
  }

  async function removeAll() {
    $toasts.messages = [];
  }
</script>

<div
  class="fixed inset-x-0 top-0 z-[10000]"
  class:pointer-events-none={$toasts.messages.length === 0}
>
  <div class="flex flex-col gap-1.5 p-4 w-full">
    {#each $toasts.messages as message (message.id)}
      <div
        class="flex items-center gap-2.5 text-white font-normal p-[15px] bg-gray-900 cursor-pointer"
        role="button"
        tabindex="0"
        in:fly={{ x: -100, duration: 400 }}
        out:fly={{ x: 100, duration: 400 }}
        animate:flip={{ duration: 600 }}
        onclick={() => toasts.remove(message.id)}
        onkeydown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toasts.remove(message.id);
          }
        }}
      >
        {#if message.type === TOAST_TYPES.SUCCESS}
          <CheckMarkIcon />
        {:else if message.type === TOAST_TYPES.ERROR}
          <ErrorIcon />
        {:else if message.type === TOAST_TYPES.LOADING}
          <LoadingIcon />
        {:else if message.type === TOAST_TYPES.INFO}
          <Info size={24} />
        {/if}
        <p class="text-center flex-1">{message.content}</p>
        {#if message.settings.link}
          <a
            class="text-indigo-500 underline underline-offset-2"
            href={null}
            onclick={preventDefault(message.settings.link.callback)}
          >
            {message.settings.link.text}
          </a>
        {/if}
      </div>
    {/each}
  </div>
</div>

<div
  class="flex flex-col absolute inset-x-0 bottom-0 z-[100000] gap-0.5 hidden"
>
  <Button
    class="flex-1"
    onclick={() => {
      toasts.success("Movie added to your watchlist!", {
        duration: 0,
        link: { text: "Edit collection", callback: () => goto("/top") }
      });
    }}
  >
    success + link
  </Button>

  <Button
    class="flex-1"
    onclick={() => {
      toasts.success("Movie added to your watchlist!", {
        duration: 0
      });
    }}
  >
    success
  </Button>

  <Button
    class="flex-1"
    onclick={() => {
      toasts.success("Movie added to your watchlist!", {
        duration: 0,
        replace: true
      });
    }}
  >
    success replace
  </Button>

  <Button
    class="flex-1"
    onclick={() => {
      toasts.info("Movie added to your watchlist!", { duration: 0 });
    }}
  >
    info
  </Button>

  <Button
    class="flex-1"
    onclick={() => {
      toasts.error("Movie added to your watchlist!", { duration: 0 });
    }}
  >
    error
  </Button>

  <Button class="flex-1" onclick={remove}>remove</Button>

  <Button class="flex-1" onclick={removeAll}>remove all</Button>
</div>
