<script lang="ts">
  import type { MoviesFormData } from "../MoviesForm/MoviesForm.svelte";

  interface Props {
    data: MoviesFormData;
  }

  let { data }: Props = $props();
</script>

<div>
  <h1>Data</h1>
  <pre>{JSON.stringify(data, null, 2)}</pre>
</div>
