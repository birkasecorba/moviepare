<script>
  import { onMount } from "svelte";
  import { stores } from "@sapper/app";
  import { fetchJson } from "@api/utils";
  import Matrix from "@components/Matrix";
  import _sampleSize from "lodash/sampleSize";

  // Props
  export const segment = "";

  // State
  const { session } = stores();
  let posters = [];

  // Life-cycle
  onMount(async () => {
    if ($session.deviceType !== "mobile") {
      const { movies } = await fetchJson("/backend/prefetched/movies");
      posters = _sampleSize(movies, 25);

      posters.map(movie =>
        fetch(`https://image.tmdb.org/t/p/w154/${movie.poster_path}`)
      );
    }
  });
</script>

<style>
  main {
    --nav-height: 120px;
    --content-padding-y: 16px;
    --content-height: calc(
      100vh - var(--nav-height) - 2 * var(--content-padding-y)
    );

    backdrop-filter: blur(3px);
    min-height: 100vh;
    min-width: 100vw;
    background: linear-gradient(
      50deg,
      rgba(var(--prussian-blue-rgb), 0.8),
      rgba(var(--gunmetal-rgb), 0.8)
    );
  }
  nav {
    height: var(--nav-height);
  }

  .LOGO {
    height: 80%;
  }

  .CONTENT {
    height: var(--content-height);
    padding: var(--content-padding-y) 0;
  }
</style>

{#if $session.deviceType !== 'mobile'}
  <div class="absolute inset-0 overflow-hidden">
    <Matrix urls={posters.map(p => p.poster_path)} />
  </div>
{/if}

<main>
  <nav class="flex justify-center items-end">
    <a href="/" rel="prefetch" class="text-6xl">
      <img class="LOGO" src="moviepare.svg" alt="Moviepare Logo" />
    </a>
  </nav>
  <div class="CONTENT">
    <slot />
  </div>
</main>
