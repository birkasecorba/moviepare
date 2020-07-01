import { crossfade as svelteCrossfade } from 'svelte/transition';
import { quintOut } from 'svelte/easing';

export function crossfade(options) {
  return svelteCrossfade({
    duration: (d) => Math.sqrt(d * 200),

    fallback(node, params) {
      const style = getComputedStyle(node);
      const transform = style.transform === 'none' ? '' : style.transform;

      return {
        duration: 400,
        easing: quintOut,
        css: (t) => `
          transform: ${transform} scale(${t});
          opacity: ${t}
        `,
      };
    },
    ...options,
  });
}
