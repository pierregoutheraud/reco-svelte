<script lang="ts">
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import type { MoviesFormData } from "../../components/MoviesForm/MoviesForm.svelte";
  import RecommendationsStreamingPage from "../../components/RecommendPage/RecommendationsStreamingPage.svelte";
  import { recommendationsStore } from "../../stores/recommendationsStore.svelte";

  // Retrieve form data from page state or store
  const formData = $derived(
    page.state.formData || recommendationsStore.currentFormData
  );

  // const formDataMock: MoviesFormData = {
  //   era: [1990, 2025],
  //   mood: "mystery",
  //   discovery: "hidden",
  //   duration: "under_2_hours",
  //   inspiration_movies_ids: [152601]
  // };

  // Redirect to form if no data is provided in either page state or store
  $effect(() => {
    if (!formData) {
      goto("/form");
    }
  });
</script>

{#if formData}
  <RecommendationsStreamingPage data={formData} />
{/if}
