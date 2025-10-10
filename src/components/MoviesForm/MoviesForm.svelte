<script module>
  export type MoviesFormData = {
    era: [number, number];
    mood:
      | "light_funny"
      | "romantic"
      | "thoughtful_deep"
      | "action_packed"
      | "tense_twisty"
      | "scary"
      | "wonder_worlds";
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
  import * as m from "$lib/paraglide/messages.js";

  interface Props {
    onComplete: (data: MoviesFormData) => void;
  }

  let { onComplete }: Props = $props();

  let currentYear = new Date().getFullYear();
</script>

<Form {onComplete}>
  <FormStep
    id="era"
    title={m.form_era_title()}
    question={m.form_era_question()}
    required
  >
    <FormSlider min={1920} max={currentYear} step={1} multiple />
  </FormStep>

  <FormStep
    id="mood"
    title={m.form_mood_title()}
    question={m.form_mood_question()}
    required
  >
    <FormSelect
      options={[
        {
          label: m.form_mood_light_funny_label(),
          description: m.form_mood_light_funny_description(),
          value: "light_funny"
        },
        {
          label: m.form_mood_romantic_label(),
          description: m.form_mood_romantic_description(),
          value: "romantic"
        },
        {
          label: m.form_mood_thoughtful_deep_label(),
          description: m.form_mood_thoughtful_deep_description(),
          value: "thoughtful_deep"
        },
        {
          label: m.form_mood_action_packed_label(),
          description: m.form_mood_action_packed_description(),
          value: "action_packed"
        },
        {
          label: m.form_mood_tense_twisty_label(),
          description: m.form_mood_tense_twisty_description(),
          value: "tense_twisty"
        },
        {
          label: m.form_mood_scary_label(),
          description: m.form_mood_scary_description(),
          value: "scary"
        },
        {
          label: m.form_mood_wonder_worlds_label(),
          description: m.form_mood_wonder_worlds_description(),
          value: "wonder_worlds"
        }
      ]}
    />
  </FormStep>

  <FormStep
    id="discovery"
    title={m.form_discovery_title()}
    question={m.form_discovery_question()}
    required
  >
    <FormSelect
      options={[
        {
          label: m.form_discovery_popular_label(),
          value: "popular"
        },
        {
          label: m.form_discovery_hidden_label(),
          value: "hidden"
        },
        {
          label: m.form_discovery_surprise_label(),
          value: "surprise"
        }
      ]}
    />
  </FormStep>

  <!-- <FormStep
    id="duration"
    title={m.form_duration_title()}
    question={m.form_duration_question()}
    required
  >
    <FormSelect
      options={[
        {
          label: m.form_duration_under2h_label(),
          value: "under_2_hours"
        },
        {
          label: m.form_duration_doesnt_matter_label(),
          value: "it_doesnt_matter"
        }
      ]}
    />
  </FormStep> -->

  <FormStep
    id="inspiration_movies_ids"
    title={m.form_inspiration_title()}
    question={m.form_inspiration_question()}
    skippable
  >
    <FormSelectMovies />
  </FormStep>
</Form>
