<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  interface Props {
    texts: string[];
    duration: number; // in seconds
    subtext?: string;
    startFrom?: number; // elapsed seconds to start from
  }

  let { texts, duration, subtext, startFrom = 0 }: Props = $props();

  const maxProgress = 95;
  const updateFrequency = 50; // Update every 50ms for smooth animation
  const totalSteps = (duration * 1000) / updateFrequency;
  const progressPerStep = maxProgress / totalSteps;

  // Calculate initial progress based on elapsed time
  const initialProgress = Math.min((startFrom / duration) * maxProgress, maxProgress);

  // Calculate which text to show based on elapsed time
  const textDuration = duration / texts.length;
  const initialTextIndex = Math.min(Math.floor(startFrom / textDuration), texts.length - 1);

  let progress = $state(initialProgress);
  let currentTextIndex = $state(initialTextIndex);
  let intervalId: ReturnType<typeof setInterval> | null = null;
  let textIntervalId: ReturnType<typeof setInterval> | null = null;

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
    const textDurationMs = (duration * 1000) / texts.length;
    textIntervalId = setInterval(() => {
      if (currentTextIndex < texts.length - 1) {
        currentTextIndex = currentTextIndex + 1;
      } else {
        if (textIntervalId !== null) {
          clearInterval(textIntervalId);
        }
      }
    }, textDurationMs);
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

<div class="flex flex-col items-center justify-center gap-3 w-[300px]">
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
