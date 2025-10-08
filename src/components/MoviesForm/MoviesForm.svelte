<script module>
  export type MoviesFormData = {
    era: [number, number];
    mood:
      | "comedy_feelgood"
      | "drama_emotional"
      | "action_adventure"
      | "thriller_suspense"
      | "horror"
      | "scifi"
      | "fantasy"
      | "mystery_cerebral";
    discovery: "popular" | "hidden" | "surprise";
    duration: "under_2_hours" | "it_doesnt_matter";
    inspiration_movies_ids?: number[];
    selected_movies?: MovieMinTMDB[];
  };
</script>

<script lang="ts">
  import Form from "../Form/Form.svelte";
  import FormStep from "../Form/FormStep.svelte";
  import FormSlider from "../Form/FormSlider.svelte";
  import FormSelect from "../Form/FormSelect.svelte";
  import FormSelectMovies from "../Form/FormSelectMovies/FormSelectMovies.svelte";
  import type { MovieMinTMDB } from "$lib/tmdb/tmdb.decl";

  interface Props {
    onComplete: (data: MoviesFormData) => void;
  }

  let { onComplete }: Props = $props();

  let currentYear = new Date().getFullYear();
</script>

<Form {onComplete}>
  <FormStep
    id="era"
    title="Era"
    question="Which era of movies do you want to dive into?"
    required
  >
    <FormSlider min={1920} max={currentYear} step={1} multiple />
  </FormStep>

  <FormStep
    id="mood"
    title="Mood"
    question="What kind of mood are you going for?"
    required
  >
    <FormSelect
      options={[
        {
          label: "A good laugh",
          description: "Comedy / Feel-good / Rom-com",
          value: "comedy_feelgood"
        },
        {
          label: "Heartfelt & moving",
          description: "Drama / Emotional / Romance",
          value: "drama_emotional"
        },
        {
          label: "Adrenaline rush",
          description: "Action / Adventure / Big set-pieces",
          value: "action_adventure"
        },
        {
          label: "Something suspenseful",
          description: "Thriller / Tension / High stakes",
          value: "thriller_suspense"
        },
        {
          label: "Scare me",
          description: "Horror / Creepy / Disturbing",
          value: "horror"
        },
        {
          label: "Big ideas",
          description: "Sci-Fi / High-concept / Futuristic",
          value: "scifi"
        },
        {
          label: "Escape into another world",
          description: "Fantasy / Mythic / Magical",
          value: "fantasy"
        },
        {
          label: "Clever & cerebral",
          description: "Mystery / Psychological / Noir",
          value: "mystery_cerebral"
        }
      ]}
    />
  </FormStep>

  <FormStep
    id="discovery"
    title="Discovery"
    question="What kind of pick do you want tonight?"
    required
  >
    <FormSelect
      options={[
        {
          label: "Popular movies",
          value: "popular"
        },
        {
          label: "Hidden gems",
          value: "hidden"
        },
        {
          label: "Surprise me",
          value: "surprise"
        }
      ]}
    />
  </FormStep>

  <FormStep
    id="duration"
    title="Duration"
    question="How much time do you have?"
    required
  >
    <FormSelect
      options={[
        {
          label: "Under 2 hours",
          value: "under_2_hours"
        },
        {
          label: "It doesn't matter",
          value: "it_doesnt_matter"
        }
      ]}
    />
  </FormStep>

  <FormStep
    id="inspiration_movies_ids"
    title="Inspiration"
    question="Select movies that you love and that should inspire the recommendations."
    skippable
  >
    <FormSelectMovies />
  </FormStep>
</Form>
