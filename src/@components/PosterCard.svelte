<script>
  import { createEventDispatcher } from "svelte";

  // Props
  export let url;
  export let title = "";
  export let alt = title;
  export let size = "w342";
  export let utilityClass = "";

  let loaded = false;

  const dispatch = createEventDispatcher();
</script>

<style>
  .WRAPPER {
    position: relative;
    overflow: hidden;
    transition: transform 0.1s, box-shadow 0.1s;
  }

  .TITLE {
    background: linear-gradient(
      0,
      rgba(var(--gunmetal-rgb), 1) 0%,
      rgba(var(--prussian-blue-rgb), 0.5) 30%,
      rgba(var(--prussian-blue-rgb), 0)
    );
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    top: 0;
    display: flex;
    font-weight: 200;
    font-size: 150%;
    align-items: flex-end;
    padding: 4% 6%;
  }
</style>

<div class="WRAPPER {utilityClass}" on:click={() => dispatch('click')}>
  <img src="https://image.tmdb.org/t/p/{size}/{url}" alt={alt.title} />
  <div class="TITLE">{title}</div>
</div>
