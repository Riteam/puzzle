<template>
  <div class="charsPanel">
    <div
      class="charAns"
      v-for="i of chars"
      :key="i"
      @click="clickHandler(i)"
      :class="{ used: i in used }"
    >
      {{ i }}
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'
export default {
  name: 'PuzzleCharsPanel',
  props: ['chars', 'used'],
  setup(props, context) {
    let used = reactive(props.used)
    used
    function clickHandler(char) {
      context.emit('charClick', char)
    }

    let chars = reactive(props.chars)
    console.log(chars)

    return {
      clickHandler,
    }
  },
}
</script>

<style>
.charsPanel {
  padding: 0.4rem 0;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.12rem;
}
.charsPanel .charAns {
  padding: 0.1rem;
  background: #fff;
  border-radius: 0.04rem;
  box-shadow: 0 0.04rem rgb(0 0 0 / 20%);
  font-size: 0.34rem;
  cursor: pointer;
  text-align: left;
  transition: opacity 0.2s;
  -webkit-tap-highlight-color: transparent;
  font-weight: bold;
  color: #7b5564;
}
.charAns:active {
  /* box-shadow: none;
  transform: translateY(0.04rem); */
}
.charAns.used {
  opacity: 0.5;
  pointer-events: none;

  box-shadow: none;
  transform: translateY(0.04rem);
}
</style>
