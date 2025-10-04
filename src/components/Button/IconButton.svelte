<script lang="ts">
  import type { Component } from "svelte";
  import Button from "./Button.svelte";
  import type { ClassValue } from "svelte/elements";

  interface Props {
    component: Component;
    size: number;
    disabled?: boolean;
    class?: ClassValue;
    onclick?: () => void;
  }

  let {
    component: IconComponent,
    size = 26,
    disabled = false,
    class: className,
    onclick
  }: Props = $props();
</script>

<Button class={["!px-0 !w-10", className]} {disabled} {onclick}>
  <IconComponent {size} />
</Button>
