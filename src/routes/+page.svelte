<script lang="ts">
  import MoviesForm, {
    type MoviesFormData
  } from "../components/MoviesForm/MoviesForm.svelte";
  import RecommendPage from "../components/RecommendPage/RecommendPage.svelte";

  let data = $state<MoviesFormData | undefined>(undefined);

  // const data: MoviesFormData = {
  //   era: [1990, 2010],
  //   mood: "mystery",
  //   discovery: "hidden",
  //   duration: "under_2_hours",
  //   favorite_movie: "In the mood for love"
  // };
</script>

{#if !data}
  <MoviesForm
    onComplete={(d) => {
      console.log("onComplete", d);
      data = d;
    }}
  />
{:else}
  <RecommendPage {data} />
{/if}
