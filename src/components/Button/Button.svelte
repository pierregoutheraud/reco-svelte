<script lang="ts">
  import type { Snippet } from "svelte";
  import type { ClassValue } from "svelte/elements";
  import type { Component } from "svelte";
  interface Props {
    children: Snippet;
    class?: ClassValue;
    disabled?: boolean;
    onclick?: () => void;
    icon?: Component;
    iconPosition?: "left" | "right";
  }

  let {
    children,
    class: className,
    disabled = false,
    onclick,
    icon: IconComponent,
    iconPosition = "left"
  }: Props = $props();
</script>

<button
  type="button"
  class={[
    className,
    "flex items-center justify-center h-10 px-4 text-base cursor-pointer",
    {
      "bg-main": !disabled,
      "bg-gray-800 opacity-70 !cursor-not-allowed": disabled
    }
  ]}
  {onclick}
>
  <div
    class="flex gap-3 {iconPosition === 'left'
      ? 'flex-row'
      : 'flex-row-reverse'}"
  >
    {#if IconComponent}
      <IconComponent size={24} />
    {/if}
    {@render children?.()}
  </div>
</button>
