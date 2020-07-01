<script context="module">
  export async function preload({ params, query, path }, session) {
    const { genreId } = query;
    const fetchRes = await this.fetch(`/backend/game/generate/${genreId}`);
    const { id, movies } = await fetchRes.json();

    const promises = movies
      .slice(0, 2)
      .map(movie =>
        session.deviceType === "mobile"
          ? this.fetch(`https://image.tmdb.org/t/p/w300/${movie.backdrop_path}`)
          : this.fetch(`https://image.tmdb.org/t/p/w342/${movie.poster_path}`)
      );
    Promise.all(promises);

    return { gameId: id, movies };
  }
</script>

<script>
  import { postJson } from "@api/utils";
  import Game from "@components/Game";
  import Share from "@components/Share";
  import TransitionWrapper from "@components/TransitionWrapper";

  // Props
  export let movies = [];
  export let gameId = generateId();

  // State
  let isGameEnded = false;
  let roundsData = {};

  async function save({ roundId, rounds, score }) {
    roundsData = { id: roundId, rounds, score };

    const promises = [
      postJson("/backend/game/save", { id: gameId, movies }),
      postJson("/backend/round/save", { id: roundId, rounds, score })
    ];

    await Promise.all(promises);

    isGameEnded = true;
  }
</script>

{#if !isGameEnded}
  <TransitionWrapper>
    <Game {movies} on:done={event => save(event.detail)} />
  </TransitionWrapper>
{:else}
  <TransitionWrapper>
    <Share {gameId} {roundsData} />
  </TransitionWrapper>
{/if}
