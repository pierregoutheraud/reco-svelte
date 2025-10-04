<script lang="ts">
  import FormPage from "../components/FormPage/FormPage.svelte";
</script>

<Form onComplete={(data) => console.log(data)}>
  <FormStep
    title="Era"
    question="Which era of movies do you want to dive into?"
  >
    <FormSlider min={1900} max={2025} step={1} multiple />
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
        }
      ]}
    />
  </FormStep>
</Form>
