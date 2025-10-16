<script module>
  import type { MediaMinTMDB } from "$lib/tmdb/tmdb.decl";
  import { TMDB_MEDIA_TYPE } from "$lib/tmdb/tmdb.decl";

  export type MediasFormData = {
    media_type: TMDB_MEDIA_TYPE.MOVIE | TMDB_MEDIA_TYPE.SHOW;
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
    inspiration_media_keys?: string[];
  };
</script>

<script lang="ts">
  import Form from "../Form/Form.svelte";
  import FormStep from "../Form/FormStep.svelte";
  import FormSlider from "../Form/FormSlider.svelte";
  import FormSelect from "../Form/FormSelect.svelte";
  import * as m from "$lib/paraglide/messages.js";
  import FormSelectMedias from "../Form/FormSelectMedias/FormSelectMedias.svelte";
  import type { FormContext } from "../Form/Form.svelte";

  interface Props {
    onComplete: (data: MediasFormData) => void;
  }

  let { onComplete }: Props = $props();

  let currentYear = new Date().getFullYear();
</script>

<Form {onComplete}>
  <FormStep
    id="media_type"
    title={m.form_media_type_title()}
    question={m.form_media_type_question()}
    required
  >
    <FormSelect
      options={[
        {
          label: m.form_media_type_movies_label(),
          value: TMDB_MEDIA_TYPE.MOVIE
        },
        {
          label: m.form_media_type_series_label(),
          value: TMDB_MEDIA_TYPE.SHOW
        }
      ]}
    />
  </FormStep>

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
    id="inspiration_media_keys"
    title={m.form_inspiration_title()}
    question={(formContext) => {
      const mediaType = formContext.getValue("media_type");
      return mediaType === TMDB_MEDIA_TYPE.SHOW
        ? m.form_inspiration_question_series()
        : m.form_inspiration_question_movies();
    }}
    skippable
  >
    <FormSelectMedias />
  </FormStep>
</Form>
