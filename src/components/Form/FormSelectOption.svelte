<script lang="ts">
  interface Props {
    label: string;
    sublabel?: string;
    onclick?: () => void;
    active?: boolean;
    hover?: boolean;
    selected?: boolean;
  }

  let {
    label,
    sublabel,
    onclick,
    active = false,
    hover = false,
    selected = false
  }: Props = $props();
</script>

<button
  type="button"
  class={[
    `w-full py-3 px-3 text-base bg-black text-white border border-white shadow-[0_4px_0_0_white] cursor-pointer`,
    // `transition-all duration-300`,

    // `hover:translate-y-[2px] hover:shadow-[0_2px_0_0_white]`,
    `hover:border-main hover:shadow-main`,
    `active:translate-y-[4px] active:shadow-none`,

    // `hover:translate-y-1 hover:shadow-none`,
    // `active:border-t-[5px]`

    hover ? "translate-y-[2px] !shadow-[0_2px_0_0_white]" : "",
    active ? "translate-y-[4px] shadow-none" : "",
    selected
      ? "!border-main shadow-main !bg-main !text-white font-semibold"
      : ""
  ]}
  {onclick}
>
  <p>{label}</p>
  {#if sublabel}
    <p class={["text-sm text-gray-400", selected ? "text-white" : ""]}>
      {sublabel}
    </p>
  {/if}
</button>
