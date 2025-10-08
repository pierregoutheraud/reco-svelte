<script lang="ts">
  import { getContext } from "svelte";
  import FormSelectOption from "./FormSelectOption.svelte";
  import type { FormContext } from "./Form.svelte";
  import type { FormStepContext } from "./FormStep.svelte";

  type Props = {
    placeholder: string;
  };

  const { placeholder }: Props = $props();

  const { data } = getContext<FormContext>("form");
  const step = getContext<FormStepContext>("form_step");
</script>

<div class="flex flex-col gap-4">
  <input
    type="text"
    class="w-full bg-white text-black p-3 outline-none"
    autofocus
    {placeholder}
    bind:value={data[step.id]}
  />
</div>
