<script>
  import { quintOut } from "svelte/easing";
  export const segment = "";

  const fade = (_, { delay = 0, duration = 150 }) => {
    return {
      duration,
      delay,
      easing: quintOut,
      css: t => `
        opacity: ${t};
        transform: scale(${t * 0.7 + 0.3});
        `
    };
  };
</script>

<style>
  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto;
    min-height: var(--content-height);
    min-width: 100vw;
    will-change: opacity;
    position: relative;
  }
</style>

<div in:fade={{ delay: 500, duration: 500 }} out:fade={{ duration: 500 }}>
  <slot />
</div>
