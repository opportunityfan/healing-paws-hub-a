<template>
  <div class="login-main full padding-surround">
    <div class="login-panel center">
      <div class="title">Sign up</div>
      <div class="hint">Please login in to continue to your account</div>
      <HInput name="email"></HInput>
      <HInput :password="true" name="password"></HInput>
    </div>
  </div>
</template>

<script>
import HInput from "@/components/HInput";
export default {
  name: "LoginView",
  components: {HInput}
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
