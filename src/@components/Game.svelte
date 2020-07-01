<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { stores } from "@sapper/app";
  import { postJson, generateId } from "@api/utils";
  import PosterCard from "@components/PosterCard";
  import { fade } from "svelte/transition";
  import { crossfade } from "@components/animation";

  const dispatch = createEventDispatcher();

  const { session } = stores();

  // Props
  export let movies = [];
  export let moviePerRound = 2;

  // State
  const timeBetweenRounds = 400;
  const [send, receive] = crossfade();
  let isMobile = $session.deviceType === "mobile";

  // State
  let rounds = Array(movies.length / moviePerRound)
    .fill(null)
    .map((_, i) => ({
      movies: movies.slice(
        i * moviePerRound,
        i * moviePerRound + moviePerRound
      ),
      selectedMovie: null,
      isCorrect: null
    }));

  let currentRoundIndex = 0;
  $: score = rounds.filter(r => r.isCorrect).length;
  $: isDone = currentRoundIndex === rounds.length;
  $: currentRound = rounds[currentRoundIndex];
  $: currentSelection = currentRound ? currentRound.selectedMovie : null;

  $: if (isDone) {
    dispatch("done", { rounds, score, roundId: generateId() });
  }

  async function pick(selectedMovie) {
    // Already picked for this round
    if (currentRound.selectedMovie) {
      return;
    }
    rounds[currentRoundIndex].selectedMovie = selectedMovie;
    const winningMovie = await postJson(`/backend/compare`, {
      movieIds: currentRound.movies.map(m => m.id)
    });
    rounds[currentRoundIndex].isCorrect = selectedMovie.id === winningMovie.id;

    setTimeout(() => {
      currentRoundIndex += 1;
    }, timeBetweenRounds);
  }

  onMount(async () => {
    isMobile = isMobile || document.body.getBoundingClientRect().width < 768;

    movies
      .slice(2)
      .map(movie =>
        isMobile
          ? fetch(`https://image.tmdb.org/t/p/w300/${movie.backdrop_path}`)
          : fetch(`https://image.tmdb.org/t/p/w342/${movie.poster_path}`)
      );
  });
</script>

<style>
  .GAME-WRAPPER {
    --rounds-section-height: 100px;
    display: grid;
    grid-template:
      "poster-section" 1fr
      "round-section" var(--rounds-section-height)
      / minmax(95%, 900px);
    min-height: var(--content-height);
  }

  .POSTER-SECTION {
    display: grid;
    grid-template-columns: 1fr;
    margin: auto;
    grid-area: poster-section;
    grid-gap: 50px;
  }

  @media (min-width: 768px) {
    .GAME-WRAPPER {
      --rounds-section-height: 140px;
    }

    .POSTER-SECTION {
      grid-template-columns: 1fr 1fr;
      grid-gap: 100px;
    }
  }

  .POSTER-WRAPPER {
    transition: transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out;
    cursor: pointer;
    border-radius: 16px;
    user-select: none;
  }

  .POSTER-WRAPPER.PICKED.CORRECT {
    box-shadow: 0px 0px 20px 5px theme("colors.tiffany");
  }

  .POSTER-WRAPPER.PICKED.WRONG {
    box-shadow: 0px 0px 20px 5px theme("colors.bittersweet");
  }

  .PICKED {
    transform: scale(1.1);
  }
  .NOT-PICKED {
    transform: scale(0.9);
  }
  .ROUNDS {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    grid-area: round-section;
  }

  .ROUND-TOKEN {
    width: 100%;
    height: 5px;
    border-radius: 5px;
    background: gray;
  }

  .ROUND-TOKEN.CORRECT {
    background-color: theme("colors.tiffany");
  }

  .ROUND-TOKEN.WRONG {
    background-color: theme("colors.bittersweet");
  }
</style>

<svelte:head>
  <title>New Game</title>
</svelte:head>

<div class="GAME-WRAPPER">
  {#each rounds as round}
    <div class="POSTER-SECTION">
      {#if currentRound === round}
        {#each currentRound.movies as movie, i}
          <div
            class="POSTER-WRAPPER"
            class:NOT-PICKED={currentSelection && currentSelection !== movie}
            class:PICKED={currentSelection === movie}
            class:CORRECT={currentRound.isCorrect === true}
            class:WRONG={currentRound.isCorrect === false}
            in:receive={{ key: movie.title }}
            out:send={{ key: movie.title }}>
            <PosterCard
              utilityClass="rounded-lg"
              url={isMobile ? movie.backdrop_path : movie.poster_path}
              size={isMobile ? 'w300' : 'w342'}
              title={movie.title}
              on:click={() => pick(movie)} />
          </div>
        {/each}
      {/if}
    </div>
  {/each}

  <div class="ROUNDS flex-wrap">
    {#each rounds as round, i}
      <div
        class="flex flex-col"
        style="width: 50px; max-width: {100 / (rounds.length * 2)}%">
        {#if round.selectedMovie && currentRoundIndex > i}
          <div
            class="mb-2"
            in:receive={{ key: round.selectedMovie.title }}
            out:send={{ key: round.selectedMovie.title }}>
            <PosterCard
              url={round.selectedMovie[isMobile ? 'backdrop_path' : 'poster_path']}
              size={isMobile ? 'w300' : 'w342'} />
          </div>
        {/if}
        <div
          class="ROUND-TOKEN"
          class:CORRECT={round.isCorrect === true}
          class:WRONG={round.isCorrect === false} />
      </div>
    {/each}
  </div>
</div>
