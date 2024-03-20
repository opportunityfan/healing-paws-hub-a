<template>
  <div class="login-panel">
    <div class="title">Sign in</div>
    <div class="hint">Please login in to continue to your account</div>
    <HInput
        name="Email"
        v-model="data.account"
        :state="correct.account? 'default' : 'error'"
        :information="information.account"
        @blur="onBlurEmail"
        style="margin: 16px 0"
    ></HInput>
    <HInput
        :password="true"
        name="Password"
        v-model="data.password"
        :state="correct.password? 'default' : 'error'"
        :information="information.password"
        style="margin: 16px 0"
    ></HInput>
    <HButton @click="onSignIn">Sign In</HButton>
    <HDivider>Or</HDivider>
    <div style="text-align: center">
      <span class="hint">Need an account? </span>
      <span class="clickable-text" @click="goRegistry">Sign up</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import HInput from "@/components/HInput";
import HButton from "@/components/HButton"
import {reactive} from "vue";
import HDivider from "@/components/HDivider.vue";
import {goto, signIn} from "@/assets/api";
const data = reactive<{
  account : string
  password : string
}>({
  account : '',
  password : ''
})

const correct = reactive<{
  account : boolean
  password : boolean
}>({
  account : true,
  password : true
})

const information = reactive<{
  account : string
  password : string
}>({
  account : '',
  password : ''
})

function goRegistry(){
  goto('/Registry');
}
function onSignIn(){
  signIn(data)
}

const onBlurEmail = () => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if(emailRegex.test(data.account)) {
    correct.account = true
    information.account = ''
  } else {
    console.log("wrong")
    correct.account = false
    information.account = '非法的邮件格式'
  }
}
</script>

<style scoped lang="stylus">
.login-panel
  width 100%
  height 100%
  div
    margin 10px 0
</style>
