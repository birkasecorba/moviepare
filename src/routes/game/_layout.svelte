<script>
  import TransitionWrapper from "@components/TransitionWrapper";
  export let segment;
</script>

<TransitionWrapper {segment}>
  <slot />
</TransitionWrapper>
