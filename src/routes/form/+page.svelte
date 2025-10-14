<script lang="ts">
  import { goto } from "$app/navigation";
  import MediasForm, {
    type MediasFormData
  } from "../../components/MediasForm/MediasForm.svelte";

  const handleComplete = (formData: MediasFormData) => {
    if (!formData) return;

    // Navigate to recommendations page with form data in state
    goto("/recommendations", {
      state: { formData: $state.snapshot(formData) }
    });
  };
</script>

<MediasForm onComplete={handleComplete} />
