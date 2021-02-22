<template>
  <div
    class="grid_wrap"
    :class="{ shake: doShake, wave: doWave }"
    @animationEnd="removeAni"
  >
    <div class="grid grid_default" :class="getStyle()">
      {{ showChar }}
    </div>
  </div>
</template>

<script>
import { ref, onUpdated, computed, watch } from 'vue'
export default {
  props: {
    data: Object,
  },
  setup(props) {
    console.log('重新创建')
    let data = computed(() => props.data)

    let showChar = computed(() => {
      if (data.value.type % 4 === 0) return data.value.char
      else return data.value.filledChar
    })

    function getStyle() {
      let classObj = {
        pending: data.value.type === 1,
        selected: data.value.selected,
        rejected: data.value.type === 3,
        resolved: data.value.type === 4,
      }
      return classObj
    }

    function getWrapperStyle() {
      if (data.value.type === 3) return 'shake'
      else return ''
    }

    onUpdated(() => {
      console.log(data.value.char, '更新了')
    })

    let doShake = ref(false)
    let doWave = ref(false)

    watch(
      () => data.value.type,
      (newValue) => {
        if (newValue === 3) {
          doShake.value = true
        }
      }
    )

    watch(
      () => data.value.delay,
      (newVal, oldVal) => {
        // console.log(data.index, newValue)
        if (oldVal === 0) {
          setTimeout(() => {
            doWave.value = true
          }, newVal)
        }
      }
    )

    function removeAni() {
      doShake.value = false
      doWave.value = false
    }

    return {
      showChar,
      getStyle,
      getWrapperStyle,
      doShake,
      doWave,
      removeAni,
    }
  },
}
</script>

<style src="../assets/anim.css"></style>
<style>
.grid {
  font-size: 0.4rem;
  font-weight: bold;
  color: #7b5564;
  /* color: #aa9699; */
  transition: all 0.2s;
  -webkit-tap-highlight-color: transparent;
  box-shadow: 0 0.02rem 0.06rem rgba(0, 0, 0, 0.3);
}
.grid.pending {
  z-index: 2;
  background: hsl(37deg 56% 87%);
  cursor: pointer;
}
.grid.resolved {
  color: #fff;
  background: hsl(120deg 50% 44%);
}
.grid.rejected {
  color: #fff;
  background: hsl(0deg 62% 55%);
  z-index: 3;
}
.grid.selected {
  transform: scale(1.4);
  z-index: 10;
}
.shake {
  z-index: 4;
  animation: shake 0.3s linear;
}
.wave {
  animation: wave 0.4s linear;
}
</style>
