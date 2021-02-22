<template>
  <div class="header">
    <div class="content">
      <div class="sub_box residue">
        <h5>当前关卡</h5>
        <span class="text">{{ puzzleResidue }}/{{ puzzleCount }}</span>
      </div>
      <div class="sub_box time">
        <h5>已用时</h5>
        <span>{{ time }}s</span>
      </div>
      <div class="sub_box wrong">
        <h5>错误计数</h5>
        <span v-if="wrong <= wrongMax">{{ wrong }}/{{ wrongMax }}</span>
        <span v-else>{{ wrong }}/<small>🔥</small></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['time', 'wrong', 'wrongMax', 'puzzleResidue', 'puzzleCount'],
  setup() {},
}
</script>

<style>
.header {
  border-top: 0.2rem solid currentColor;
  background: #fff;
  height: 1rem;
  margin-bottom: 0.1rem;
  box-shadow: 0 0.04rem 0.04rem rgba(0, 0, 0, 20%);
  display: flex;
  align-items: center;
  color: hsl(337deg 17% 40%);
}
.header .content {
  flex: 1;
  display: flex;
  padding: 0 0.3rem;
  text-align: center;
  font-size: 0.3rem;
}
.header .content .sub_box {
  flex: 1;
}
.wrong small {
  font-size: 0.24rem;
}
.residue h5 {
  color: rgb(69, 147, 147);
}
.wrong h5 {
  color: rgb(211, 70, 70);
}
</style>
