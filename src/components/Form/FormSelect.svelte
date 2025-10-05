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
    // selectedValue = value;
    setValue(step.id, value);
    // formContext.goToNextStep();
  };
</script>

<div class="flex flex-col gap-4">
  {#each options as option}
    <FormSelectOption
      label={option.label}
      sublabel={option.description}
      onclick={() => selectOption(option.value)}
      active={selectedValue === option.value}
      selected={selectedValue === option.value}
    />
    <!-- <button
      type="button"
      class="border border-gray-200 w-full py-3 text-base border-b-5"
      onclick={() => selectOption(option.value)}
      disabled={selectedValue === option.value}
    >
      <p>{option.label}</p>
      {#if option.description}
        <p class="text-sm text-gray-400">
          {option.description}
        </p>
      {/if}
    </button> -->
  {/each}
</div>
