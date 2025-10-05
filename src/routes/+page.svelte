<script lang="ts">
  import MoviesForm, {
    type MoviesFormData
  } from "../components/MoviesForm/MoviesForm.svelte";
  import RecommendPage from "../components/RecommendPage/RecommendPage.svelte";

  let data = $state<MoviesFormData | undefined>(undefined);
</script>

{#if !data}
  <MoviesForm onComplete={(d) => (data = d)} />
{:else}
  <RecommendPage {data} />
{/if}
