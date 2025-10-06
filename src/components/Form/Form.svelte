<script module lang="ts">
  export interface FormContext {
    currentStepIndex: number;
    totalSteps: number;
    data: Record<string, unknown>;
    registerStep: (stepId: string) => number;
    unregisterStep: (stepId: string) => void;
    setValue: (stepId: string, value: unknown) => void;
    getValue: (stepId: string) => unknown;
    goToNextStep: () => void;
    goToPreviousStep: () => void;
  }
</script>

<script lang="ts" generics="TData extends Record<string, unknown>">
  import { setContext } from "svelte";
  import type { Snippet } from "svelte";
  import FormProgress from "./FormProgress.svelte";

  interface Props {
    children: Snippet;
    onComplete: (data: TData) => void;
  }

  let { children, onComplete }: Props = $props();

  let currentStepIndex = $state(0);
  let data = $state<Record<string, unknown>>({});
  let steps = $state<string[]>([]);

  const registerStep = (id: string) => {
    // Check if step already exists (HMR case)
    const existingIndex = steps.indexOf(id);
    if (existingIndex !== -1) {
      return existingIndex;
    }
    // Add new step and return its index
    steps.push(id);
    return steps.length - 1;
  };

  const unregisterStep = (id: string) => {
    const index = steps.indexOf(id);
    if (index !== -1) {
      steps.splice(index, 1);
    }
  };

  const setValue = (stepId: string, value: unknown) => {
    data[stepId] = value;
  };

  const getValue = (stepId: string) => {
    return data[stepId];
  };

  const goToNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      currentStepIndex++;
    } else {
      // Last step, complete the form
      onComplete(data as TData);
    }
  };

  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      currentStepIndex--;
    }
  };

  setContext("form", {
    get currentStepIndex() {
      return currentStepIndex;
    },
    get totalSteps() {
      return steps.length;
    },
    registerStep,
    unregisterStep,
    setValue,
    getValue,
    data,
    goToNextStep,
    goToPreviousStep
  });
</script>

<div
  class="flex flex-col relative w-full h-full p-6 gap-6 overflow-scroll pb-[200px] no-scrollbar"
>
  <FormProgress />
  {@render children()}
</div>
<!-- border-4 border-white/30  -->
