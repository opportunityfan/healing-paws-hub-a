<template>
  <div class="login-main full padding-surround">
    <div class="login-panel center">
      <div class="title">Sign in</div>
      <div class="hint">Please login in to continue to your account</div>
      <HInput name="Email" v-model="data.email" style="margin: 20px 0"></HInput>
      <HInput :password="true" name="Password" v-model="data.password" style="margin: 20px 0"></HInput>

      <div style="text-align: center">
        <span class="hint">Need an account? </span>
        <span class="clickable-text" @click="goRegistry">Sign up</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import HInput from "@/components/HInput";
import {reactive} from "vue";
import HDivider from "@/components/HDivider.vue";
import {useRouter} from "vue-router";
const data = reactive<{
  email : string
  password : string
}>({
  email : '',
  password : ''
})

const router = useRouter()
function goRegistry(){
  router.push({path:'/Registry'})
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
