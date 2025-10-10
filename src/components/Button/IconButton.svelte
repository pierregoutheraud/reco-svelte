<script lang="ts">
  import type { Component } from "svelte";
  import Button, { type ButtonProps } from "./Button.svelte";
  import type { ClassValue } from "svelte/elements";

  type Props = Pick<ButtonProps, "mode"> & {
    icon: Component;
    size?: number;
    disabled?: boolean;
    class?: ClassValue;
    onclick?: () => void;
    weight?: "fill" | "light" | "regular" | "bold" | "duotone";
  };

  let {
    icon: IconComponent,
    size = 26,
    disabled = false,
    class: className,
    onclick,
    weight = "regular",
    ...buttonProps
  }: Props = $props();
</script>

<Button
  class={["!px-0 !w-10", className]}
  {disabled}
  {onclick}
  {...buttonProps}
>
  <IconComponent {size} {weight} />
</Button>
