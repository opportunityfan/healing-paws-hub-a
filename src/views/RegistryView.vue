<template>
  <div class="registry-panel">
    <div class="title">Sign up</div>
    <div class="hint">Sign up to enjoy the feature of Paw</div>
    <HInput name="NickName" v-model="data.nickname" style="margin:20px 0"></HInput>
    <HInput name="Email" v-model="data.email" style="margin:20px 0"></HInput>
    <HInput :password="true" v-model="data.password" name="password" style="margin:20px 0"></HInput>
    <HButton @click="onSignUp">Sign Up</HButton>
    <HDivider>Or</HDivider>
    <div style="text-align: center">
      <span class="hint">Already have an account? </span>
      <span class="clickable-text" @click="backSignIn">Sign in</span>
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
  signUp();
}
</script>



<style scoped lang="stylus">
.registry-panel
  width 100%
  height 100%
  div
    margin 10px 0
</style>
