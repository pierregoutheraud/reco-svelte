<script lang="ts">
  import { getContext } from "svelte";
  import type { FormContext } from "./Form.svelte";

  const formContext = getContext<FormContext>("form");
</script>

<div class="mx-auto flex gap-2 justify-center w-full pointer-events-none">
  {#each Array(formContext.totalSteps) as _, index}
    <div
      class={[
        "h-1 transition-all duration-300",
        index < formContext.currentStepIndex
          ? "bg-main w-6"
          : index === formContext.currentStepIndex
            ? "bg-main w-14"
            : "bg-main/30 w-6"
      ].join(" ")}
    ></div>
  {/each}
</div>
