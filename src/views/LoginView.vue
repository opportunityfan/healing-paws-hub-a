<template>
  <div class="login-main full padding-surround">
    <div class="login-panel center">
      <div class="title">Sign up</div>
      <div class="hint">Please login in to continue to your account</div>
      <HInput name="Email" v-model="data.email" style="margin: 20px 0"></HInput>
      <HInput :password="true" name="Password" v-model="data.password" style="margin: 20px 0"></HInput>
    </div>
  </div>
</template>

<script setup lang="ts">
import HInput from "@/components/HInput";
import {reactive} from "vue";
const data = reactive<{
  email : string
  password : string
}>({
  email : '',
  password : ''
})
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
