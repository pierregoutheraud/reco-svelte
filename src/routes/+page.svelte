<script lang="ts">
  import MoviesForm from "../components/MoviesForm/MoviesForm.svelte";
  import RecommendPage from "../components/RecommendPage/RecommendPage.svelte";

  let data = $state<Record<string, unknown> | undefined>(undefined);
</script>

{#if !data}
  <MoviesForm onComplete={(d) => (data = d)} />
{:else}
  <RecommendPage {data} />
{/if}
