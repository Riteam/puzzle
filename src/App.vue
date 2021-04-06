<template>
  <div class="content_wrap">
    <PuzzleGame />
  </div>
</template>

<script>
import PuzzleGame from './components/PuzzleGame.vue'

export default {
  name: 'App',
  components: {
    PuzzleGame,
  },
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}

html {
  font-size: calc(100vw / 7.5);
  -webkit-text-size-adjust: 100%;
}
@media screen and (min-width: 751px) {
  html {
    font-size: 60px;
  }
}
body {
  font-size: 0.48rem;
}
.content_wrap {
  margin: auto;
  max-width: 8rem;
  min-height: 100vh;
  background: #e3d2a4;
  user-select: none;
}
#app {
  font-family: 'pingfang SC', Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
