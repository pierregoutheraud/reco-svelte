<script lang="ts">
  interface Props {
    primary?: string;
    secondary?: string;
  }

  let { primary = "#616161", secondary = "#e0e0e0" }: Props = $props();
</script>

<div style:--primary={primary} style:--secondary={secondary}></div>

<style>
  div {
    width: 16px;
    height: 16px;
    box-sizing: border-box;
    border: 2px solid;
    border-radius: 100%;
    border-color: var(--secondary, #e0e0e0);
    border-right-color: var(--primary, #616161);
    animation: rotate 1s linear infinite;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
