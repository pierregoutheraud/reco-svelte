<script lang="ts">
  import { fetchMovie } from "$lib/tmdb/tmdb";
  import Card from "../../components/Card/Card.svelte";
  import FormSelectOption from "../../components/Form/FormSelectOption.svelte";
  import type { MovieEnriched } from "../../components/RecommendPage/RecommendPage.svelte";

  const movieId = 152601;
  const moviePromise = fetchMovie(movieId).then((movie) => {
    const movieEnriched: MovieEnriched = {
      ...movie!,
      reason: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    };
    return movieEnriched;
  });
</script>

{#await moviePromise then movie}
  <Card {movie} />
{/await}
