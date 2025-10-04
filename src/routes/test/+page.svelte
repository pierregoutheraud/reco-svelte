<script lang="ts">
  import FormSelectOption from "../../components/Form/FormSelectOption.svelte";

  let active = $state(false);
</script>

<main class="flex flex-col gap-4 p-10">
  <FormSelectOption label="Test" />
  <FormSelectOption label="Test" hover />
  <FormSelectOption label="Test" active />
</main>
