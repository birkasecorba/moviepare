<script context="module">
  export async function preload({ params }, session) {
    const [gameId, challengerRoundsId] = params.gameId;
    const fetchRes = await this.fetch(`/backend/game/${gameId}`);
    const { movies } = await fetchRes.json();

    const promises = movies
      .slice(0, 2)
      .map(movie =>
        session.deviceType === "mobile"
          ? this.fetch(`https://image.tmdb.org/t/p/w300/${movie.backdrop_path}`)
          : this.fetch(`https://image.tmdb.org/t/p/w342/${movie.poster_path}`)
      );
    await Promise.all(promises);

    return { movies, gameId, challengerRoundsId };
  }
</script>

<script>
  import { onMount } from "svelte";
  import { fetchJson, postJson } from "@api/utils";
  import Game from "@components/Game";
  import Share from "@components/Share";
  import TransitionWrapper from "@components/TransitionWrapper";

  // Props
  export let movies = [];
  export let challengerRoundsId;
  export let gameId;

  // State
  let isGameEnded = false;
  let roundsData = {};
  let challengerRoundsData;

  async function save({ roundId, rounds, score }) {
    roundsData = { id: roundId, rounds, score };
    await postJson("/backend/round/save", { id: roundId, rounds, score });

    isGameEnded = true;
  }

  onMount(async () => {
    challengerRoundsData = await fetchJson(
      `/backend/round/${challengerRoundsId}`
    );
    console.log(challengerRoundsData);
  });
</script>

{#if !isGameEnded}
  <TransitionWrapper>
    <Game {movies} on:done={event => save(event.detail)} />
  </TransitionWrapper>
{:else}
  <TransitionWrapper>
    <Share {gameId} {roundsData} {challengerRoundsData} />
  </TransitionWrapper>
{/if}
