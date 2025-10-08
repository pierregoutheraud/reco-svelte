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
          label: m.form_mood_comedy_label(),
          description: m.form_mood_comedy_description(),
          value: "comedy_feelgood"
        },
        {
          label: m.form_mood_drama_label(),
          description: m.form_mood_drama_description(),
          value: "drama_emotional"
        },
        {
          label: m.form_mood_action_label(),
          description: m.form_mood_action_description(),
          value: "action_adventure"
        },
        {
          label: m.form_mood_thriller_label(),
          description: m.form_mood_thriller_description(),
          value: "thriller_suspense"
        },
        {
          label: m.form_mood_horror_label(),
          description: m.form_mood_horror_description(),
          value: "horror"
        },
        {
          label: m.form_mood_scifi_label(),
          description: m.form_mood_scifi_description(),
          value: "scifi"
        },
        {
          label: m.form_mood_fantasy_label(),
          description: m.form_mood_fantasy_description(),
          value: "fantasy"
        },
        {
          label: m.form_mood_mystery_label(),
          description: m.form_mood_mystery_description(),
          value: "mystery_cerebral"
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

  <FormStep
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
  </FormStep>

  <FormStep
    id="inspiration_movies_ids"
    title={m.form_inspiration_title()}
    question={m.form_inspiration_question()}
    skippable
  >
    <FormSelectMovies />
  </FormStep>
</Form>
