<script lang="ts">
  import { goto } from "$app/navigation";
  import MoviesForm from "../../components/MoviesForm/MoviesForm.svelte";
  import type { MoviesFormData } from "../../components/MoviesForm/MoviesForm.svelte";

  const handleComplete = (formData: MoviesFormData) => {
    if (!formData) return;

    // Navigate to recommendations page with form data in state
    goto("/recommendations", {
      state: { formData: $state.snapshot(formData) }
    });
  };
</script>

<MoviesForm onComplete={handleComplete} />
