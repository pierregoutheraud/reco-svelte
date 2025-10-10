<script lang="ts">
  import { getContext } from "svelte";
  import type { FormContext } from "./Form.svelte";

  const formContext = getContext<FormContext>("form");
</script>

<div
  class="absolute bottom-6 mx-auto flex gap-2 justify-center w-full pointer-events-none"
>
  {#each Array(formContext.totalSteps) as _, index}
    <div
      class={[
        "h-1 transition-all duration-300",
        index < formContext.currentStepIndex
          ? "bg-main w-3"
          : index === formContext.currentStepIndex
            ? "bg-main w-12"
            : "bg-main/40 w-4"
      ].join(" ")}
    ></div>
  {/each}
</div>
