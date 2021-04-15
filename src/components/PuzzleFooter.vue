<template>
  <div class="footer">
    <div class="footer_title">ABOUT</div>
    <div class="footer_box">
      <p>
        玩法：选中空格，填入下方文字，使行、列组成<strong>正确的成语</strong>。
      </p>
      <p><i>仅作核心功能展示。</i></p>
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
  line-height: 1.8;
  border-radius: 0 0.04rem 0.04rem 0.04rem;
  box-shadow: 0 0.04rem 0.04rem rgba(0, 0, 0, 20%);
}
</style>
