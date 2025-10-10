<script module>
  export type ButtonMode = "default" | "ghost";

  export type ButtonProps = {
    children: Snippet;
    class?: ClassValue;
    disabled?: boolean;
    onclick?: () => void;
    mode?: "default" | "ghost";

    icon?: Component;
    iconPosition?: "left" | "right";
    iconSize?: number;
    iconWeight?: "fill" | "light" | "regular" | "bold" | "duotone";
  };
</script>

<script lang="ts">
  import type { Snippet } from "svelte";
  import type { ClassValue } from "svelte/elements";
  import type { Component } from "svelte";
  let {
    children,
    class: className,
    disabled = false,
    onclick,
    mode = "default",

    icon: IconComponent,
    iconPosition = "left",
    iconSize = 24,
    iconWeight = "regular"
  }: ButtonProps = $props();
</script>

<button
  type="button"
  class={[
    "flex items-center justify-center h-10 px-4 text-base cursor-pointer",
    "active:opacity-80 transition-opacity duration-200 text-base",
    mode === "default" ? "bg-main hover:opacity-90" : "",
    mode === "ghost" ? "bg-transparent hover:bg-gray-800" : "",
    {
      // "bg-main": !disabled,
      "bg-gray-800 opacity-70 !cursor-not-allowed": disabled
      // "bg-main": mode === "default",
      // "bg-transparent": mode === "ghost"
    },
    className
  ]}
  {disabled}
  {onclick}
>
  <div
    class="flex gap-2 {iconPosition === 'left'
      ? 'flex-row'
      : 'flex-row-reverse'} items-center"
  >
    {#if IconComponent}
      <IconComponent size={iconSize} weight={iconWeight} />
    {/if}
    {@render children?.()}
  </div>
</button>
