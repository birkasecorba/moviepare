<script>
  import { onMount } from "svelte";
  import PosterCard from "@components/PosterCard";

  // Props
  export let gameId;
  export let roundsData;
  export let challengerRoundsData;

  // State
  let shareEnabled = false;
  let url = "";
  let isCopied = false;

  async function share() {
    await navigator.share({
      title: "MoviePare",
      text: "Can you beat my score?",
      url
    });
  }

  async function copyText(text) {
    await navigator.clipboard.writeText(text);
    isCopied = true;

    setTimeout(() => {
      isCopied = false;
    }, 2000);
  }

  onMount(() => {
    shareEnabled = Boolean(navigator.share);
    url = `${window.location.protocol}//${window.location.host}/game/${gameId}/${roundsData.id}`;
  });
</script>

<style>
  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    100% {
      background-position: 100% 50%;
    }
  }

  .BUTTON {
    padding: 8px 24px;
    outline: none;
    border-radius: 80px;
    border: 2px solid rgba(var(--tiffany-blue-rgb), 1);
    /* animation: gradient 1s ease reverse; */
    background: linear-gradient(
      0,
      rgba(var(--tiffany-blue-rgb), 0.2),
      rgba(var(--tiffany-blue-rgb), 0)
    );
    transition: background-color 0.2s ease;
  }

  .BUTTON:hover {
    background-color: rgba(var(--tiffany-blue-rgb), 0.3);
  }

  .ROUNDS {
    --rounds-width: 80vw;
    --column: 1;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    max-width: --rounds-width;
  }

  .ROUND {
    width: calc(100% / var(--column));
  }

  @media (min-width: 768px) {
    .ROUNDS {
      --rounds-width: 90vw;
      --column: 3;
    }
  }
  @media (min-width: 1024px) {
    .ROUNDS {
      --rounds-width: 80vw;
      --column: 5;
    }
  }
  .border-transparent {
    @apply border-transparent;
  }
  .border-tiffany {
    @apply border-tiffany;
  }
  .border-bittersweet {
    @apply border-bittersweet;
  }
</style>

<div class="flex flex-col justify-center align-center flex-auto">
  <div class="mb-8 text-center flex justify-evenly flex-col lg:flex-row">
    <div
      class="flex flex-col items-center justify-center lg:flex-row
      lg:justify-evenly mb-4 lg:mb-0">
      <div class="my-4 lg:mr-10 lg:my-0">
        <div class="text-3xl">Your Score</div>
        <div class="text-6xl">
          {roundsData.score} / {roundsData.rounds.length}
        </div>
      </div>
      {#if challengerRoundsData}
        <div>
          <div class="text-3xl">Challenger's Score</div>
          <div class="text-6xl">
            {challengerRoundsData.score} / {challengerRoundsData.rounds.length}
          </div>
        </div>
      {/if}
    </div>
    <div class="flex flex-col items-center">
      <div class="mb-2 text-center">
        Share this game and compete with your friend
      </div>

      <div
        class="py-4 px-6 border-2 border-dashed cursor-pointer mx-4 mb-4
        rounded-full break-all"
        on:click={() => copyText(url)}>
        {url}
      </div>
      <div class="flex justify-end align-center">
        <button class="BUTTON " on:click={() => copyText(url)}>
          {isCopied ? 'Copied' : 'Click to Copy'}
        </button>
        {#if shareEnabled}
          <button class="BUTTON ml-2" on:click={() => share()}>Share</button>
        {/if}
      </div>

    </div>
  </div>

  <div class="ROUNDS flex-wrap">
    {#each roundsData.rounds as round, i}
      <div class="ROUND flex flex-col p-4">
        <div class="mb-2 flex">
          <div
            class="mr-2 border-4 rounded-lg overflow-hidden"
            class:border-transparent={round.movies[0].id !== round.selectedMovie.id}
            class:border-tiffany={round.movies[0].id === round.selectedMovie.id && round.isCorrect === true}
            class:border-bittersweet={round.movies[0].id === round.selectedMovie.id && round.isCorrect === false}>
            <PosterCard url={round.movies[0].poster_path} />
          </div>
          <div
            class="border-4 rounded-lg overflow-hidden"
            class:border-transparent={round.movies[1].id !== round.selectedMovie.id}
            class:border-tiffany={round.movies[1].id === round.selectedMovie.id && round.isCorrect === true}
            class:border-bittersweet={round.movies[1].id === round.selectedMovie.id && round.isCorrect === false}>
            <PosterCard url={round.movies[1].poster_path} />
          </div>
        </div>
      </div>
    {/each}
  </div>

</div>
