<script lang="ts">
  import { getContext } from "svelte";
  import FormSelectOption from "./FormSelectOption.svelte";
  import type { FormContext } from "./Form.svelte";
  import type { FormStepContext } from "./FormStep.svelte";

  const { data } = getContext<FormContext>("form");
  const step = getContext<FormStepContext>("form_step");
</script>

<div class="flex flex-col gap-4">
  <input
    type="text"
    class="w-full bg-white text-black p-3 outline-none"
    autofocus
    placeholder="In the mood for love"
    bind:value={data[step.id]}
  />
</div>
