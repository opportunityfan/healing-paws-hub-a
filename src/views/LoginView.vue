<template>
  <div class="login-main full padding-surround">
    <div class="login-panel center">
      <div class="title">Sign up</div>
      <div class="hint">Please login in to continue to your account</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginView"
}
</script>

<style scoped lang="stylus">
.login-main
  padding-left 20px
  box-sizing border-box
  position relative

.login-panel
  width 300px
  height 600px
  text-align left
  div
    margin 10px 0
</style>
