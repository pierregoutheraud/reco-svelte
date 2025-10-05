<script lang="ts">
  interface Props {
    data: Record<string, unknown>;
  }

  let { data }: Props = $props();
</script>

<div>
  <h1>Data</h1>
  <pre>{JSON.stringify(data, null, 2)}</pre>
</div>
