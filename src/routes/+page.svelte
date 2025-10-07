<script lang="ts">
  import MoviesForm, {
    type MoviesFormData
  } from "../components/MoviesForm/MoviesForm.svelte";
  import RecommendationsStreamingPage from "../components/RecommendPage/RecommendationsStreamingPage.svelte";

  let data = $state<MoviesFormData | undefined>(undefined);

  // const data: MoviesFormData = {
  //   era: [1990, 2025],
  //   mood: "mystery",
  //   discovery: "hidden",
  //   duration: "under_2_hours",
  //   inspiration_movies_ids: [152601]
  // };
</script>

{#if !!data}
  <RecommendationsStreamingPage {data} />
{:else}
  <MoviesForm
    onComplete={(d) => {
      console.log("onComplete", d);
      data = d;
    }}
  />
{/if}
