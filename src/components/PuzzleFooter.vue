<template>
  <div class="footer">
    <div class="footer_title">ABOUT</div>
    <div class="footer_box">
      <p>作者：Jrc</p>
      <p>
        Github：<a href="https://github.com/Riteam/puzzle"
          >github.com/Riteam/puzzle</a
        >
      </p>
      <p>基于实际项目开发。Vue3练习DEMO。</p>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style>
.footer {
  margin-top: 0.4rem;
}
.footer_title {
  padding: 0.04rem 0.3rem;
  background: hsl(120deg 50% 44%);
  color: #fff;
  font-size: 0.24rem;
  width: fit-content;
  border-radius: 0.08rem 0.08rem 0 0;
}
.footer_box {
  background: #fff;
  padding: 0.2rem;
  text-align: left;
  font-size: 0.24rem;
  color: #7b5564;
  border-radius: 0 0.04rem 0.04rem 0.04rem;
  box-shadow: 0 0.04rem 0.04rem rgba(0, 0, 0, 20%);
}
</style>
