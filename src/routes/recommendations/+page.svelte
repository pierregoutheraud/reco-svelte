<script lang="ts">
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import type { MoviesFormData } from "../../components/MoviesForm/MoviesForm.svelte";
  import RecommendationsStreamingPage from "../../components/RecommendPage/RecommendationsStreamingPage.svelte";

  // Retrieve form data from page state
  const formData = $derived(page.state.formData as MoviesFormData | undefined);

  $inspect(formData);

  // const formDataMock: MoviesFormData = {
  //   era: [1990, 2025],
  //   mood: "mystery",
  //   discovery: "hidden",
  //   duration: "under_2_hours",
  //   inspiration_movies_ids: [152601]
  // };

  // Redirect to form if no data is provided
  $effect(() => {
    if (!formData) {
      goto("/form");
    }
  });
</script>

{#if formData}
  <RecommendationsStreamingPage data={formData} />
{/if}
