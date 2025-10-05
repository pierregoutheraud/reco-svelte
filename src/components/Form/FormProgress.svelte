<script lang="ts">
  import { getContext } from "svelte";
  import type { FormContext } from "./Form.svelte";

  const formContext = getContext<FormContext>("form");
</script>

<div class="flex gap-2 justify-center w-full">
  {#each Array(formContext.totalSteps) as _, index}
    <div
      class={[
        "h-1 transition-all duration-300",
        index < formContext.currentStepIndex
          ? "bg-main w-8"
          : index === formContext.currentStepIndex
            ? "bg-main w-16"
            : "bg-main/30 w-8"
      ].join(" ")}
    ></div>
  {/each}
</div>
