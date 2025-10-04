<script module>
  export type FormOption = {
    label: string;
    description?: string;
    value: string;
  };
</script>

<script lang="ts">
  type Props = {
    title: string;
    question: string;
    options: FormOption[];
    onOptionSelect: (value: string) => void;
  };

  let { title, question, options, onOptionSelect }: Props = $props();
</script>

<div
  class="flex flex-col w-full h-full p-8 gap-6 border-4 border-white/30 overflow-scroll"
>
  <div class="flex flex-col gap-4">
    <h1 class="text-3xl font-bold text-center">{title}</h1>
    <h2 class="text-lg/6 px-4 text-center">{question}</h2>
  </div>

  <div class="flex flex-col gap-4">
    {#each options as option}
      <button
        class="border border-gray-200 p-4 text-base border-b-5"
        onclick={() => onOptionSelect(option.value)}
      >
        <p>{option.label}</p>
        {#if option.description}
          <p>
            <span class="text-sm text-gray-400">{option.description}</span>
          </p>
        {/if}
      </button>
    {/each}
  </div>
</div>
