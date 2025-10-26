<script lang="ts">
  import { fly } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import { X } from "phosphor-svelte";
  import IconButton from "../Button/IconButton.svelte";

  type Props = {
    onclose: () => void;
    children: import("svelte").Snippet;
  };

  let { onclose, children }: Props = $props();

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      onclose();
    }
  }

  function handleBackdropClick(e: MouseEvent | KeyboardEvent) {
    if (e.target === e.currentTarget) {
      onclose();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- Backdrop -->
<div
  class="absolute inset-0 bg-background z-50 overflow-y-auto"
  onclick={handleBackdropClick}
  onkeydown={(e) => e.key === "Enter" && handleBackdropClick(e)}
  transition:fly={{
    y: "100%",
    duration: 500,
    opacity: 1,
    easing: cubicOut
  }}
  role="dialog"
  aria-modal="true"
  tabindex="-1"
>
  <div class="relative h-full w-full max-w-4xl shadow-xl">
    <IconButton
      icon={X}
      onclick={onclose}
      class="absolute top-4 right-4 z-50"
      mode="ghost"
    />

    {@render children()}
  </div>
</div>
