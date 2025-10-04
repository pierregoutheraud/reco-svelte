<script lang="ts">
  import { getContext, setContext, onMount, onDestroy } from "svelte";
  import { ArrowLeft, ArrowRight } from "phosphor-svelte";
  import IconButton from "../Button/IconButton.svelte";
  import type { Snippet } from "svelte";
  import Button from "../Button/Button.svelte";

  interface FormContext {
    currentStepIndex: number;
    totalSteps: number;
    registerStep: (title: string) => number;
    unregisterStep: (index: number) => void;
    setValue: (stepTitle: string, value: unknown) => void;
    getValue: (stepTitle: string) => unknown;
    goToNextStep: () => void;
    goToPreviousStep: () => void;
  }

  interface Props {
    title: string;
    question: string;
    children: Snippet;
  }

  let { title, question, children }: Props = $props();

  setContext("form_step", {
    id: title
  });
  const formContext = getContext<FormContext>("form");

  let stepIndex = $state(-1);
  let isActive = $derived(formContext.currentStepIndex === stepIndex);
  let isValid = $derived.by(() => {
    const value = formContext.getValue(title);
    return value !== undefined;
  });

  // $inspect({
  //   title,
  //   isActive,
  //   stepIndex,
  //   currentStepIndex: formContext.currentStepIndex
  // });

  onMount(() => {
    stepIndex = formContext.registerStep(title);
  });

  onDestroy(() => {
    // if (stepIndex !== -1) {
    //   formContext.unregisterStep(stepIndex);
    // }
  });
</script>

{#if isActive}
  <div class="flex flex-col gap-4">
    <h1 class="text-3xl font-bold text-center">{title}</h1>
    <h2 class="text-lg/6 px-4 text-center">{question}</h2>
  </div>

  {@render children()}

  <div class="flex">
    <!-- {#if stepIndex > 0} -->
    <!-- <button type="button" onclick={() => formContext.goToPreviousStep()}>
      <ArrowLeft size={28} />
    </button> -->
    <!-- {/if} -->

    <div class="flex justify-between w-full">
      {#if stepIndex > 0}
        <IconButton
          component={ArrowLeft}
          size={24}
          onclick={() => formContext.goToPreviousStep()}
        />
      {/if}

      {#if stepIndex < formContext.totalSteps - 1}
        <IconButton
          component={ArrowRight}
          size={24}
          disabled={!isValid}
          onclick={() => formContext.goToNextStep()}
          class="ml-auto"
        />
      {:else}
        <Button disabled={!isValid}>OK</Button>
      {/if}
    </div>

    <!-- <button
      type="button"
      onclick={() => formContext.goToNextStep()}
      disabled={!isValid()}
    >
      {stepIndex < formContext.totalSteps - 1 ? "Next" : "Submit"}
      <ArrowRight size={28} />
    </button> -->
  </div>
{/if}
