<script lang="ts">
  import Form from "../components/Form/Form.svelte";
  import FormStep from "../components/Form/FormStep.svelte";
  import FormSelect from "../components/Form/FormSelect.svelte";
  import FormSlider from "../components/Form/FormSlider.svelte";
</script>

<Form onComplete={(data) => console.log(data)}>
  <FormStep
    title="Era"
    question="Which era of movies do you want to dive into?"
  >
    <FormSlider min={1920} max={2025} step={1} multiple />
  </FormStep>

  <FormStep title="Mood" question="What's your mood tonight?">
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
          description: "Horror/Suspense",
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

  <FormStep title="Discovery" question="What kind of pick do you want tonight?">
    <FormSelect
      options={[
        {
          label: "Popular films I should see",
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
</Form>
