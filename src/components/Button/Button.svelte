<script lang="ts">
  import type { Snippet } from "svelte";
  import type { ClassValue } from "svelte/elements";

  interface Props {
    children: Snippet;
    class?: ClassValue;
    disabled?: boolean;
    onclick?: () => void;
  }

  let {
    children,
    class: className,
    disabled = false,
    onclick
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
  {@render children?.()}
</button>
