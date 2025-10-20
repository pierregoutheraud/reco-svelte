<script lang="ts">
  import { fade, fly } from "svelte/transition";
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
  class="absolute top-0 left-0 bottom-0 bg-background z-50 overflow-y-auto"
  onclick={handleBackdropClick}
  onkeydown={(e) => e.key === "Enter" && handleBackdropClick(e)}
  transition:fade={{ duration: 200 }}
  role="dialog"
  aria-modal="true"
  tabindex="-1"
>
  <!-- Modal Content -->
  <div
    class="relative h-full w-full max-w-4xl shadow-xl"
    transition:fly={{ y: 50, duration: 300 }}
  >
    <!-- Close Button -->
    <IconButton
      icon={X}
      onclick={onclose}
      class="absolute top-4 right-4 z-10"
      mode="ghost"
    />

    {@render children()}
  </div>
</div>
