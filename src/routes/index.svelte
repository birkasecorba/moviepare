<script context="module">
  export async function preload(aa, ff) {
    const fetchRes = await this.fetch("/backend/prefetched/genres");
    let { genres } = await fetchRes.json();

    if (!process.browser) {
      genres = genres.map(g => ({ ...g, loaded: true }));
    }

    return { genres };
  }
</script>

<script>
  import { onMount } from "svelte";
  import TransitionWrapper from "@components/TransitionWrapper";
  import PosterCard from "@components/PosterCard";

  // Props
  export let genres = [];
  export const segment = "";

  onMount(async () => {
    const promises = genres.map(async (genre, i) => {
      await fetch(`https://image.tmdb.org/t/p/w342/${genre.poster_path}`);
      genres[i].loaded = true;
    });
  });
</script>

<style>
  .CARD-WRAPPER {
    --max-content: 90vw;
    --gap: 8px;
    --column: 2;
    --scale-factor: 1;
    --card-width: calc((var(--max-content) / var(--column)) - (var(--gap)));
    --image-width: calc(var(--card-width));

    margin: auto;
    display: grid;
    grid-gap: var(--gap);
    grid-template-columns: repeat(var(--column), var(--card-width));
  }

  .CARD {
    transition: transform 0.1s ease-out, opacity 1s;
    transform: scale(1);
    width: var(--image-width);
    height: calc(var(--image-width) * 1.5);
  }

  .CARD:hover {
    transform: scale(var(--scale-factor));
  }

  @media (min-width: 768px) {
    .CARD-WRAPPER {
      --column: 3;
      --max-content: 85vw;
      --gap: 16px;
      --scale-factor: 1.05;
    }
  }
  @media (min-width: 1024px) {
    .CARD-WRAPPER {
      --column: 6;
      --max-content: 80vw;
    }
  }

  @media (min-width: 1280px) {
    .CARD-WRAPPER {
      --column: 6;
      --max-content: 60vw;
    }
  }
</style>

<svelte:head>
  <title>MoviePare</title>
</svelte:head>

<TransitionWrapper>
  <div class="CARD-WRAPPER">
    {#each genres as genre, i (genre.id)}
      <a class="CARD" href={`game/new?genreId=${genre.id}`} rel="prefetch">
        <PosterCard
          utilityClass="rounded-sm"
          url={genre.poster_path}
          title={genre.name} />
      </a>
    {/each}
  </div>
</TransitionWrapper>
