<script lang="ts">
  import "../app.css";
  import type { Snippet } from "svelte";
  import Header from "../components/Header/Header.svelte";
  import Toasts from "../components/Toasts/Toasts.svelte";

  type Props = {
    children: Snippet;
  };

  let { children }: Props = $props();
</script>

<Toasts />

<main
  class="flex flex-col w-full max-w-[500px] h-full max-h-[1000px] mx-auto bg-background"
>
  <Header />
  <div
    class="main-scroll-container flex-1 min-h-0 overflow-auto overflow-x-hidden"
  >
    {@render children?.()}
  </div>
</main>
