<script lang="ts">
  import Button from "../../components/Button/Button.svelte";
  import { toasts } from "../../stores/toasts.store";
</script>

<Button
  onclick={() => {
    toasts.success("Movie added to your watchlist!", {
      duration: 1000
    });
  }}
>
  Add to watchlist
</Button>
