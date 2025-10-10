<script lang="ts">
  import { fetchMovie } from "$lib/tmdb/tmdb";
  import Card from "../../components/MovieCard/MovieCard.svelte";
  import FormSelectOption from "../../components/Form/FormSelectOption.svelte";
  import OptimisticProgressBar from "../../components/OptimisticProgressBar/OptimisticProgressBar.svelte";
  import Button from "../../components/Button/Button.svelte";
  import { House } from "phosphor-svelte";
  import IconButton from "../../components/Button/IconButton.svelte";
  import type { MovieEnriched } from "../../stores/recommendationsStore.svelte";

  const movieId = 152601;
  const moviePromise = fetchMovie(movieId).then((movie) => {
    const movieEnriched: MovieEnriched = {
      ...movie!,
      reason: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    };
    return movieEnriched;
  });
</script>

<!-- <Button mode="ghost">Hello</Button>
<Button>Hello</Button>
<IconButton icon={House} mode="ghost" />
<IconButton icon={House} /> -->

{#await moviePromise then movie}
  <Card {movie} />
{/await}

<!-- <OptimisticProgressBar
  texts={[
    "Analyzing your taste...",
    "Scanning decades of cinema...",
    "Consulting the film archives...",
    "Reading between the frames...",
    "Curating your perfect lineup..."
  ]}
  subtext="This will take around 40 seconds."
  duration={60}
/> -->
