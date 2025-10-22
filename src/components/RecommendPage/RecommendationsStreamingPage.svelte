<script lang="ts">
  import { onMount } from "svelte";
  import OptimisticProgressBar from "../OptimisticProgressBar/OptimisticProgressBar.svelte";
  import { ArrowsClockwise, Warning } from "phosphor-svelte";
  import Button from "../Button/Button.svelte";
  import MediasList from "./MediasCardsList.svelte";
  import { recommendationsStore } from "../../stores/recommendationsStore.svelte";
  import * as m from "$lib/paraglide/messages.js";
  import type { MediasFormData } from "../MediasForm/MediasForm.svelte";

  interface Props {
    data: MediasFormData;
  }

  let { data }: Props = $props();

  onMount(() => {
    // Only load if we need to (no data or formData changed)
    if (recommendationsStore.shouldReload(data)) {
      loadRecommendations();
    }
  });

  async function loadRecommendations() {
    await recommendationsStore.loadRecommendations(data);
  }

  function handleComplete() {
    console.log("handleComplete - reloading recommendations");

    // All preferences are already saved in the store via RecommendationsList
    // Just reload recommendations
    loadRecommendations();
  }
</script>

<div class="flex h-full">
  {#if recommendationsStore.error}
    <div class="flex flex-1 flex-col gap-6 items-center self-center">
      <div class="flex flex-col gap-1 items-center">
        <Warning size={60} class="text-red-500" />
        <p class="text-red-500">{recommendationsStore.error}</p>
      </div>
      <Button onclick={() => loadRecommendations()} icon={ArrowsClockwise}>
        {m.recommendations_try_again()}
      </Button>
    </div>
  {:else if recommendationsStore.enrichedMedias?.length}
    <MediasList
      medias={recommendationsStore.enrichedMedias}
      onComplete={handleComplete}
    />
  {:else if recommendationsStore.loading}
    <div class="flex h-full w-full items-center justify-center">
      <OptimisticProgressBar
        texts={[
          m.recommendations_loading_1(),
          m.recommendations_loading_2(),
          m.recommendations_loading_3(),
          m.recommendations_loading_4(),
          m.recommendations_loading_5()
        ]}
        subtext={m.recommendations_loading_subtext({ seconds: 60 })}
        duration={recommendationsStore.loadingDuration}
        startFrom={recommendationsStore.elapsedSeconds}
      />
    </div>
  {/if}
</div>
