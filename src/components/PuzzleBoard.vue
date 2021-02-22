<template>
  <div class="board">
    <template v-for="(row, i) of matrix" :key="i">
      <template v-for="char of row" :key="char.id">
        <PuzzleGrid
          v-if="char"
          :data="char"
          @click="clickHandler(char)"
        ></PuzzleGrid>

        <div v-else class="grid_wrap">
          <div class="grid_default grid_empty"></div>
        </div>
      </template>
    </template>
  </div>
  <PuzzleCharsPanel
    :chars="chars"
    :used="charUsed"
    @charClick="charClickHandler"
  ></PuzzleCharsPanel>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { debounce } from 'lodash'

// eslint-disable-next-line no-unused-vars
import { reactive, ref, toRefs, watch } from 'vue'
import PuzzleGrid from './PuzzleGrid'
import PuzzleCharsPanel from './PuzzleCharsPanel.vue'

function FisherYatesShuffle(array) {
  let ArrCopy = []
  for (let i = 0; i < array.length; i++) {
    ArrCopy.push(array[i])
    let ramIndex = (Math.random() * ArrCopy.length) | 0
    ArrCopy[i] = ArrCopy[ramIndex]
    ArrCopy[ramIndex] = array[i]
  }
  return ArrCopy
}

let uid = 0
function initPuzzle(puzzle) {
  let { matrix, chars } = puzzle
  let charsSet = new Set(chars)

  let newMatrix = [],
    firstEmptyIndex = 0

  for (let i = 0; i < matrix.length; i++) {
    let row = matrix[i]
    newMatrix[i] = [...row]
    for (let j = 0; j < row.length; j++) {
      let char = row[j]
      if (char) {
        let item = {
          id: uid++,
          char: char,
          filledChar: '',
          type: charsSet.has(char) ? 1 : 0,
          selected: false,
          index: i * 9 + j,
          delay: 0,
        }

        if (!firstEmptyIndex && item.type === 1) {
          firstEmptyIndex = item.index
          item.selected = true
        }

        newMatrix[i][j] = item
      }
    }
  }

  return {
    ...puzzle,
    matrix: newMatrix,
    chars: FisherYatesShuffle(chars),
    firstEmptyIndex,
  }
}

function getItem(array, index) {
  let len = array.length
  if (index < 0 || index / len >= len) return
  return array[(index / len) | 0][index % len]
}

function findWord(array, startPoint) {
  /**
   * 2处使用：
   * 1、填充后[同组]进行校对
   * 2、擦除后消除[同组]错误状态
   */
  const len = array.length
  const rowWord = [],
    colWord = []
  let row = (startPoint / len) | 0,
    col = startPoint % len,
    rowPointer = row,
    colPointer = col

  // 找横向成语
  while (colPointer > 0 && array[row][colPointer - 1]) colPointer--
  do {
    rowWord.push(array[row][colPointer++])
  } while (colPointer < len && array[row][colPointer])

  // 找竖向成语
  while (rowPointer > 0 && array[rowPointer - 1][col]) rowPointer--
  do {
    colWord.push(array[rowPointer++][col])
  } while (rowPointer < len && array[rowPointer][col])

  return {
    row: rowWord,
    col: colWord,
  }
}

function findNextGrid(array, sIndex) {
  let self = getItem(array, sIndex)
  if (self.type === 3) return self

  const len = array.length
  let pos = [-len, len, -1, 1]
  let queue = [],
    target = null

  // stage1 寻找十字范围，优先错格，再空格
  for (let i = 1; i <= 3; i++) {
    for (let j = 0; j < pos.length; j++) {
      if (pos[j] === 0) continue
      let char = getItem(array, sIndex + i * pos[j])
      if (!char) pos[j] = 0
      else queue.push(char)
    }
  }
  if ((target = queue.find((i) => i.type === 3))) return target
  if ((target = queue.find((i) => i.type === 1 && i.filledChar === '')))
    return target

  // stage2 不在十字范围内，开启BFS寻找
  return findNextGrid_BFS(array, sIndex)
}

function findNextGrid_BFS(array, sIndex) {
  console.log('开启BFS')
  const len = array.length
  let count = 0
  let res = undefined
  let queue = [sIndex]
  let visited = new Set()
  while (queue.length) {
    count++
    let currIndex = queue.shift()
    visited.add(currIndex)

    let charObj = getItem(array, currIndex)
    if (
      charObj.type % 4 !==
      0
      // (charObj.filledChar == '' && charObj.type === 1) ||
      // charObj.type === 3
    ) {
      res = charObj
      break
    }

    let nextIndex = 0,
      colMin = Math.floor(currIndex / len) * len,
      colMax = Math.ceil(currIndex / len) * len - 1

    nextIndex = currIndex - len //top
    if (!visited.has(nextIndex) && getItem(array, nextIndex)) {
      queue.push(nextIndex)
    }

    nextIndex = currIndex + len //bottom
    if (!visited.has(nextIndex) && getItem(array, nextIndex)) {
      queue.push(nextIndex)
    }

    nextIndex = currIndex - 1 //left
    if (
      nextIndex >= colMin &&
      !visited.has(nextIndex) &&
      getItem(array, nextIndex)
    ) {
      queue.push(nextIndex)
    }

    nextIndex = currIndex + 1 //right
    if (
      nextIndex <= colMax &&
      !visited.has(nextIndex) &&
      getItem(array, nextIndex)
    ) {
      queue.push(nextIndex)
    }
  }

  console.log('bfs次数：' + count)
  return res
}

export default {
  name: 'PuzzleBoard',
  components: { PuzzleGrid, PuzzleCharsPanel },
  emits: ['wrong', 'resolve'],
  props: ['puzzle'],
  setup(props, context) {
    let selectedIndex = 0
    let puzzleObj = null
    const PZ = reactive({
      matrix: [],
      chars: [],
      charUsed: {},
    })
    init(props.puzzle)

    function init(souecePuzzle) {
      puzzleObj = initPuzzle(souecePuzzle)
      PZ.matrix = puzzleObj.matrix
      PZ.chars = puzzleObj.chars
      PZ.charUsed = {}
      selectedIndex = puzzleObj.firstEmptyIndex
    }

    watch(
      () => props.puzzle,
      (newPuzzle) => {
        init(newPuzzle)
      }
    )

    // 设置选中状态
    function setSelect(charObj) {
      if (!charObj) return false
      getItem(PZ.matrix, selectedIndex).selected = false
      charObj.selected = true
      selectedIndex = charObj.index
    }

    // 格子点击事件
    function clickHandler(charObj) {
      if (charObj.type % 4 === 0) return
      if (charObj.type < 4 && charObj.filledChar) {
        eraseChar(charObj.filledChar)
      }
      setSelect(charObj)
    }

    // 文字填充与擦除
    function fillChar(char) {
      let item = getItem(PZ.matrix, selectedIndex)
      if (item.filledChar) {
        eraseChar(item.filledChar)
      }
      PZ.charUsed[char] = item
      item.filledChar = char

      checkFilled(selectedIndex)
    }
    function eraseChar(char) {
      let charObj = PZ.charUsed[char]
      charObj.filledChar = ''
      delete PZ.charUsed[char]
      let { row, col } = findWord(PZ.matrix, charObj.index)
      ;[...row, ...col].forEach((i) => {
        if (i.type === 3) i.type = 1
      })
    }
    function charClickHandler(char) {
      if (PZ.charUsed[char]) {
        // eraseChar(char)
      } else {
        fillChar(char)
      }
    }

    function checkFilled(index) {
      let { row, col } = findWord(PZ.matrix, index)
      let emitWrongOnce = true

      function helper(word) {
        if (word.length < 4) return false
        if (word.some((i) => i.type % 4 !== 0 && i.filledChar.length === 0))
          return false
        let CharsToCheck = word.filter((i) => i.type > 0 && i.type < 4)
        if (CharsToCheck.some((i) => i.filledChar !== i.char)) {
          // 错误处理
          CharsToCheck.forEach((i) => {
            i.type = 3
          })
          if (emitWrongOnce) {
            // 防止发送两次
            context.emit('wrong')
            emitWrongOnce = false
          }
        } else {
          // 成功处理
          for (let i = 0; i < word.length; i++) {
            word[i].type = 4
            word[i].selected = false
            word[i].delay = 0
            setTimeout(() => {
              word[i].delay = (i + 1) * 50
            }, 0)
          }
        }
      }

      helper(row)
      helper(col)
      autoSelectNext(index)
    }

    function autoSelectNext(sIndex) {
      let nextSelectCharObj = findNextGrid(PZ.matrix, sIndex)
      if (nextSelectCharObj) {
        setSelect(nextSelectCharObj)
      } else {
        console.log('无下一空格')
        if (Object.keys(PZ.charUsed).length === PZ.chars.length) {
          setTimeout(() => {
            context.emit('resolve')
          }, 1000)
        }
      }
    }

    return {
      ...toRefs(PZ),
      clickHandler,
      charClickHandler,
    }
  },
}
</script>

<style>
.board {
  padding: 0.12rem;
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  grid-template-rows: auto;
  grid-gap: 0.08rem;
  background: #fff;
  border-radius: 0.08rem;
  box-shadow: 0 0.04rem 0.06rem 1px rgba(0, 0, 0, 0.2);
}
.grid_wrap {
  position: relative;
  padding-top: 100%;
}
.grid_default {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;

  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.04rem;
  background: hsl(37deg 56% 72%);
}
.grid_default.grid_empty {
  background: hsl(37deg 56% 72% / 10%);
  z-index: 0;
}
</style>
