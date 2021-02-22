<template>
  <PuzzleHeader v-bind="stat"></PuzzleHeader>
  <div class="board_wrap">
    <PuzzleBoard
      ref="board"
      :puzzle="puzzle"
      @wrong="stat.wrong++"
      @resolve="resolveHandler"
    />
    <PuzzleFooter></PuzzleFooter>
  </div>
</template>

<script>
import PuzzleBoard from './PuzzleBoard.vue'
import PuzzleHeader from './PuzzleHeader.vue'
import PuzzleFooter from './PuzzleFooter.vue'
import Puzzles from '@/assets/puzzles.js'
import { onBeforeUnmount, reactive, ref } from 'vue'

export default {
  name: 'PuzzleGame',
  components: {
    PuzzleBoard,
    PuzzleHeader,
    PuzzleFooter,
  },
  setup() {
    let puzzle = ref(Puzzles[0])

    let stat = reactive({
      wrong: 0,
      wrongMax: 3,
      time: 0,
      puzzleResidue: 1,
      puzzleCount: Puzzles.length,
    })

    // 计时器
    let timer = setInterval(() => {
      stat.time++
    }, 1000)
    onBeforeUnmount(() => {
      clearInterval(timer)
      console.log('game unmount')
    })

    // 过关事件
    function resolveHandler() {
      if (stat.puzzleResidue === 3) {
        alert(`恭喜过关\n用时 ${stat.time} 秒\n错误 ${stat.wrong} 次`)
        clearInterval(timer)
      } else {
        puzzle.value = Puzzles[stat.puzzleResidue]
        stat.puzzleResidue++
      }
    }

    return {
      puzzle,
      stat,
      resolveHandler,
    }
  },
}
</script>

<style>
.board_wrap {
  padding: 0.16rem;
}
</style>
