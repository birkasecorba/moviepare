<script>
  export let urls = [];

  import { onMount } from "svelte";

  $: confetti = urls
    .map(url => {
      return {
        url,
        x: Math.random() * 100,
        y: -20 - Math.random() * 100,
        r: 0.1 + Math.random() * 1
      };
    })
    .sort((a, b) => a.r - b.r);

  // $: console.log(confetti);
  onMount(() => {
    let frame;

    function loop() {
      frame = requestAnimationFrame(loop);

      confetti = confetti.map(emoji => {
        // Speed
        emoji.y += 0.2 * emoji.r;

        // Reset
        if (emoji.y > 130) emoji.y = -30;
        return emoji;
      });
    }

    loop();

    return () => cancelAnimationFrame(frame);
  });
</script>

<style>
  img {
    position: absolute;
    width: 150px;
  }
</style>

{#each confetti as c}
  <img
    src="https://image.tmdb.org/t/p/w154/{c.url}"
    style="left: {c.x}%; top: {c.y}%; transform: scale({c.r})"
    alt="flying poster" />
{/each}
