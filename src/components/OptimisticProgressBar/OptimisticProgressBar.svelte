<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  interface Props {
    texts: string[];
    duration: number; // in seconds
    subtext?: string;
  }

  let { texts, duration, subtext }: Props = $props();

  let progress = $state(0);
  let currentTextIndex = $state(0);
  let intervalId: ReturnType<typeof setInterval> | null = null;
  let textIntervalId: ReturnType<typeof setInterval> | null = null;

  const maxProgress = 95;
  const updateFrequency = 50; // Update every 50ms for smooth animation
  const totalSteps = (duration * 1000) / updateFrequency;
  const progressPerStep = maxProgress / totalSteps;

  onMount(() => {
    // Progress bar animation
    intervalId = setInterval(() => {
      progress = Math.min(progress + progressPerStep, maxProgress);

      if (progress >= maxProgress) {
        if (intervalId !== null) {
          clearInterval(intervalId);
        }
      }
    }, updateFrequency);

    // Text cycling - show each text once
    const textDuration = (duration * 1000) / texts.length;
    textIntervalId = setInterval(() => {
      if (currentTextIndex < texts.length - 1) {
        currentTextIndex = currentTextIndex + 1;
      } else {
        if (textIntervalId !== null) {
          clearInterval(textIntervalId);
        }
      }
    }, textDuration);
  });

  onDestroy(() => {
    if (intervalId !== null) {
      clearInterval(intervalId);
    }
    if (textIntervalId !== null) {
      clearInterval(textIntervalId);
    }
  });
</script>

<div class="flex flex-col items-center justify-center gap-3">
  <p class="text-base text-white text-center">
    {texts[currentTextIndex]}
  </p>

  <div class="w-[160px] h-2 bg-gray-800 overflow-hidden shadow-inner">
    <div
      class="h-full bg-main transition-all duration-[50ms] linear"
      style="width: {progress}%"
    ></div>
  </div>

  {#if subtext}
    <p class="text-sm text-center text-gray-400">{subtext}</p>
  {/if}
</div>
