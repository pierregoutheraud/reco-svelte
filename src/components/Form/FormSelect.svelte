<script lang="ts">
  import { getContext } from "svelte";
  import FormSelectOption from "./FormSelectOption.svelte";
  import type { FormContext } from "./Form.svelte";
  import type { FormStepContext } from "./FormStep.svelte";

  interface Option {
    label: string;
    description?: string;
    value: string;
  }

  interface Props {
    options: Option[];
  }

  let { options }: Props = $props();

  const { data, setValue } = getContext<FormContext>("form");
  const step = getContext<FormStepContext>("form_step");

  let selectedValue = $derived(data[step.id]);

  const selectOption = (value: string) => {
    setValue(step.id, value);
  };
</script>

<div class="flex flex-col gap-4 flex-1">
  {#each options as option}
    <FormSelectOption
      label={option.label}
      sublabel={option.description}
      onclick={() => selectOption(option.value)}
      active={selectedValue === option.value}
      selected={selectedValue === option.value}
    />
  {/each}

  <div class="h-12 w-full shrink-0"></div>
</div>
