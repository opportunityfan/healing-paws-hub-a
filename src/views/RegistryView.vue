<template>
  <div class="registry-main full padding-surround">
    <div class="registry-panel center">
      <div class="title">Sign up</div>
      <div class="hint">Sign up to enjoy the feature of Paw</div>
      <HInput name="NickName" style="margin:20px 0"></HInput>
      <HInput name="Email" style="margin:20px 0"></HInput>

      <HInput :password="true" name="password"></HInput>
      <HDivider>Or</HDivider>
      <div style="text-align: center">
        <span class="hint">Already have an account? </span>
        <span class="clickable-text" @click="backSignIn">Sign in</span>
      </div>


    </div>
  </div>
</template>

<script setup lang="ts">
import HInput from "@/components/HInput.vue";
import HDivider from "@/components/HDivider.vue";
import {useRouter} from "vue-router";
import {reactive} from "vue";

const data = reactive<{
  nickname : string
  email : string
  password : string
}>({
  nickname : '',
  email : '',
  password : ''
})
const router=useRouter()
function backSignIn(){
  router.push({path:'/login'})
}
</script>



<style scoped lang="stylus">
.registry-main
  padding-left 20px
  box-sizing border-box
  position relative

.registry-panel
  width 300px
  height 600px
  text-align left
  div
    margin 10px 0
</style>