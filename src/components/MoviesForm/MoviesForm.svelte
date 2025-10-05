<script module>
  export type FormData = {
    era: [number, number];
    mood: string;
    discovery: string;
    duration: string;
    favorite_movie?: string;
  };
</script>

<script lang="ts">
  import Form from "../Form/Form.svelte";
  import FormStep from "../Form/FormStep.svelte";
  import FormSlider from "../Form/FormSlider.svelte";
  import FormSelect from "../Form/FormSelect.svelte";
  import FormInput from "../Form/FormInput.svelte";

  interface Props {
    onComplete: (data: Record<string, unknown>) => void;
  }

  let { onComplete }: Props = $props();
</script>

<Form {onComplete}>
  <FormStep
    id="hello"
    title="Hello!"
    question="Let's find a movie for you. This process will take less than 1 minute."
  />

  <FormStep
    id="era"
    title="Era"
    question="Which era of movies do you want to dive into?"
    required
  >
    <FormSlider min={1920} max={2025} step={1} multiple />
  </FormStep>

  <FormStep
    id="mood"
    title="Mood"
    question="What's your mood tonight?"
    required
  >
    <FormSelect
      options={[
        {
          label: "Need a good laugh",
          description: "Comedy/Light",
          value: "comedy"
        },
        {
          label: "Want to feel something deep",
          description: "Drama/Emotional",
          value: "drama"
        },
        {
          label: "Craving excitement",
          description: "Thriller/Action",
          value: "action"
        },
        {
          label: "Looking to escape reality",
          description: "Sci-Fi/Fantasy",
          value: "scifi_fantasy"
        },
        {
          label: "Want to be scared",
          description: "Thriller/Suspense/Horror",
          value: "horror"
        },
        {
          label: "Something thought-provoking",
          description: "Mystery/Cerebral",
          value: "mystery"
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
    id="favorite_movie"
    title="Favorite movie"
    question="What's your favorite movie?"
    skippable
  >
    <FormInput />
  </FormStep>
</Form>
