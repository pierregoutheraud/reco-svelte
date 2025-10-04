<script lang="ts">
  import { setContext } from "svelte";
  import type { Snippet } from "svelte";

  interface Props {
    children: Snippet;
    onComplete: (data: Record<string, unknown>) => void;
  }

  let { children, onComplete }: Props = $props();

  let currentStepIndex = $state(0);
  let formData = $state<Record<string, unknown>>({});
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

  const setValue = (stepTitle: string, value: unknown) => {
    formData[stepTitle] = value;
  };

  const getValue = (stepTitle: string) => {
    return formData[stepTitle];
  };

  const goToNextStep = () => {
    const currentStepTitle = steps[currentStepIndex];
    const hasValue =
      formData[currentStepTitle] !== undefined &&
      formData[currentStepTitle] !== null;

    if (currentStepIndex < steps.length - 1) {
      if (hasValue) {
        currentStepIndex++;
      }
    } else {
      // Last step, complete the form
      if (hasValue) {
        onComplete(formData);
      }
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
    goToNextStep,
    goToPreviousStep
  });
</script>

<div
  class="flex flex-col w-full h-full p-8 gap-6 border-4 border-white/30 overflow-scroll"
>
  {@render children()}
</div>
