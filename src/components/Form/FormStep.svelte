<script module>
  export type FormStepContext = {
    id: string;
  };
</script>

<script lang="ts">
  import { getContext, setContext, onMount, onDestroy } from "svelte";
  import { ArrowLeft, ArrowRight } from "phosphor-svelte";
  import IconButton from "../Button/IconButton.svelte";
  import type { Snippet } from "svelte";
  import Button from "../Button/Button.svelte";
  import type { FormContext } from "./Form.svelte";
  import * as m from "$lib/paraglide/messages.js";

  interface Props {
    id: string;
    title?: string;
    question?: string | ((formContext: FormContext) => string);
    children?: Snippet;
    required?: boolean;
    skippable?: boolean;
  }

  let {
    id,
    title,
    question,
    children,
    required = false,
    skippable = false
  }: Props = $props();

  setContext<FormStepContext>("form_step", {
    id
  });
  const formContext = getContext<FormContext>("form");

  let stepIndex = $state(-1);
  let isActive = $derived(formContext.currentStepIndex === stepIndex);
  let data = $derived(formContext.getValue(id));
  let hasData = $derived(!!data);
  let canContinue = $derived(required ? hasData : true);
  let computedQuestion = $derived(
    typeof question === "function" ? question(formContext) : question
  );

  onMount(() => {
    stepIndex = formContext.registerStep(id);
  });

  // onDestroy(() => {
  //   if (stepIndex !== -1) {
  //     formContext.unregisterStep(stepIndex);
  //   }
  // });
</script>

{#if isActive}
  <div class="flex flex-1 flex-col min-h-0 justify-between gap-5">
    {#if title || question}
      <header>
        <div class="flex flex-col gap-1">
          {#if title}
            <h1
              class="text-3xl font-title font-bold text-center tracking-wider"
            >
              {title}
            </h1>
          {/if}
          {#if computedQuestion}
            <h2 class="text-base px-4 text-center">{computedQuestion}</h2>
          {/if}
        </div>
      </header>
    {/if}

    <div class="flex flex-1 overflow-auto overflow-x-hidden w-full px-4">
      {@render children?.()}
    </div>

    <footer class="flex justify-between w-full bg-background">
      {#if stepIndex > 0}
        <IconButton
          icon={ArrowLeft}
          size={24}
          onclick={() => formContext.goToPreviousStep()}
        />
      {/if}

      <div class="flex gap-2 ml-auto">
        {#if skippable}
          {#if hasData}
            <IconButton
              icon={ArrowRight}
              size={24}
              disabled={!canContinue}
              onclick={() => {
                formContext.goToNextStep();
              }}
            />
          {:else}
            <Button onclick={() => formContext.goToNextStep()}>
              <div class="flex gap-2">
                {m.form_skip_button()}
                <ArrowRight size={24} />
              </div>
            </Button>
          {/if}
        {:else}
          <IconButton
            icon={ArrowRight}
            size={24}
            disabled={!canContinue}
            onclick={() => {
              formContext.goToNextStep();
            }}
          />
        {/if}
      </div>
    </footer>
  </div>
{/if}
