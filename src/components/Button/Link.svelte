<script module>
  import type { HTMLAnchorAttributes } from "svelte/elements";
  import type { Snippet } from "svelte";

  export type LinkProps = HTMLAnchorAttributes & {
    children: Snippet;
    href: string;
  };
</script>

<script lang="ts">
  let { children, class: className, ...restProps }: LinkProps = $props();
</script>

<a
  class={[
    className,
    "text-blue-500 underline underline-offset-3 hover:no-underline"
  ]}
  {...restProps}
>
  {@render children?.()}
</a>
