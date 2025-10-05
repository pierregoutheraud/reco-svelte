<script lang="ts">
  import { getContext, onMount } from "svelte";
  import { Slider } from "bits-ui";
  import type { FormContext } from "./Form.svelte";
  import type { FormStepContext } from "./FormStep.svelte";

  interface Props {
    min: number;
    max: number;
    step?: number;
    multiple?: boolean;
  }

  let { min, max, step = 1, multiple = false }: Props = $props();

  const formContext = getContext<FormContext>("form");
  const stepContext = getContext<FormStepContext>("form_step");

  let rangeValues = $state<[number, number]>(
    (formContext.data[stepContext.id] as [number, number]) ?? [min, 2025]
  );

  const updateValue = (newValue: number[]) => {
    rangeValues = newValue as [number, number];
    formContext.setValue(stepContext.id, rangeValues);
  };

  onMount(() => {
    if (!formContext.getValue(stepContext.id)) {
      formContext.setValue(stepContext.id, rangeValues);
    }
  });
</script>

<div class="h-full py-10 flex justify-center">
  <Slider.Root
    type="multiple"
    {min}
    {max}
    {step}
    bind:value={rangeValues}
    onValueChange={updateValue}
    orientation="vertical"
    class="relative flex h-full touch-none select-none flex-col items-center self-center"
    thumbPositioning="contain"
  >
    {#snippet children({ tickItems, thumbItems })}
      <span
        class="bg-indigo-100 relative h-full w-2 cursor-pointer overflow-hidden"
      >
        <Slider.Range class="bg-indigo-600 w-[20px]" />
      </span>

      {#each thumbItems as { index, value } (index)}
        <Slider.Thumb
          {index}
          class="bg-main size-8 cursor-pointer outline-none"
        />
        <Slider.ThumbLabel
          {index}
          position={index === 0 ? "right" : "left"}
          class={[
            "text-lg font-semibold mb-[-30px]",
            index === 0 ? "ml-14" : "",
            index === 1 ? "mr-14" : ""
          ]}>{value}</Slider.ThumbLabel
        >
      {/each}
    {/snippet}
  </Slider.Root>
</div>
