<script lang="ts">
  import { getContext } from "svelte";

  interface FormContext {
    setValue: (stepTitle: string, value: unknown) => void;
    goToNextStep: () => void;
  }

  interface Props {
    min: number;
    max: number;
    step?: number;
    multiple?: boolean;
  }

  let { min, max, step = 1, multiple = false }: Props = $props();

  const formContext = getContext<FormContext>("form");
  const stepContext = getContext<{ id: string }>("form_step");

  let rangeValues = $state<[number, number]>([
    min,
    Math.floor((min + max) / 2)
  ]);
  let singleValue = $state<number>(Math.floor((min + max) / 2));

  const updateValue = () => {
    if (multiple) {
      formContext.setValue(stepContext.id, rangeValues);
    } else {
      formContext.setValue(stepContext.id, singleValue);
    }
  };

  const handleSingleChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    singleValue = Number(target.value);
    updateValue();
  };

  const handleMinChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    rangeValues[0] = Number(target.value);
    if (rangeValues[0] > rangeValues[1]) {
      rangeValues[1] = rangeValues[0];
    }
    updateValue();
  };

  const handleMaxChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    rangeValues[1] = Number(target.value);
    if (rangeValues[1] < rangeValues[0]) {
      rangeValues[0] = rangeValues[1];
    }
    updateValue();
  };

  const confirmSelection = () => {
    if (multiple) {
      formContext.setValue(stepContext.id, rangeValues);
    } else {
      formContext.setValue(stepContext.id, singleValue);
    }
    formContext.goToNextStep();
  };
</script>

<div>
  {#if multiple}
    <div>
      <label>
        Min: {rangeValues[0]}
        <input
          type="range"
          {min}
          {max}
          {step}
          value={rangeValues[0]}
          oninput={handleMinChange}
        />
      </label>
      <label>
        Max: {rangeValues[1]}
        <input
          type="range"
          {min}
          {max}
          {step}
          value={rangeValues[1]}
          oninput={handleMaxChange}
        />
      </label>
    </div>
  {:else}
    <div>
      <label>
        Value: {singleValue}
        <input
          type="range"
          {min}
          {max}
          {step}
          value={singleValue}
          oninput={handleSingleChange}
        />
      </label>
    </div>
  {/if}
  <button type="button" onclick={confirmSelection}> Confirm </button>
</div>
