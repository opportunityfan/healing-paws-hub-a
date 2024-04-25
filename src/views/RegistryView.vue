<template>
  <div class="registry-panel">
    <div class="title">注册</div>
    <div class="hint">注册账号以开始你的Healp学习之旅</div>
    <HInput name="昵称" v-model="data.nickname" style="margin:16px 0"></HInput>
    <HInput name="邮箱" v-model="data.email" style="margin:16px 0"></HInput>
    <HInput :password="true" v-model="data.password" name="密码" style="margin:16px 0"></HInput>
    <HButton @click="onSignUp">注册</HButton>
    <HDivider>Or</HDivider>
    <div style="text-align: center">
      <span class="hint">已经拥有账号? </span>
      <span class="clickable-text" @click="backSignIn">登录</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import HInput from "@/components/HInput.vue";
import HButton from "@/components/HButton"
import HDivider from "@/components/HDivider.vue";
import {reactive} from "vue";
import {goto,signUp} from "@/assets/api";

const data = reactive<{
  nickname : string
  email : string
  password : string
}>({
  nickname : '',
  email : '',
  password : ''
})
function backSignIn(){
  goto('/login');
}
const onSignUp = () => {

  signUp(data);
}
</script>



<style scoped lang="stylus">
.registry-panel
  width 100%
  height 100%
  div
    margin 10px 0
</style>
