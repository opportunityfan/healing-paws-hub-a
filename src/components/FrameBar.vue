<template>
  <div class="frame-background">
<!--      <transition-->
<!--          name="animate__animated animate__fade"-->
<!--          enter-active-class="animate__fadeInLeft"-->
<!--          leave-active-class="animate__fadeOutRight"-->
<!--          mode="out-in"-->
<!--      >-->
<!--        <HSearch v-if="store.state.online" ></HSearch>-->
<!--      </transition>-->
      <transition
          name="animate__animated animate__fade"
          enter-active-class="animate__fadeInLeft"
          leave-active-class="animate__fadeOutRight"
          mode="out-in"
      >

        <HBackKey v-if="isBackKey"></HBackKey>
      </transition>
    <div class="top-bar flex-row">

    </div>
    <div class="button-bar flex-row">
      <div class="box-icon button-hover" style="font-size: 16px" @click="openTalkBar">
        <i class='bx bxs-message-alt-dots'></i>
      </div>
      <div class="box-icon button-hover" style="font-size: 19px" @click="onMinimize">
        <i class='bx bx-minus'></i>
      </div>
      <div class="box-icon button-hover" style="font-size: 19px" @click="onMaxMize">
        <i class='bx bx-minus'></i>
      </div>
      <div class="box-icon button-hover" style="font-size: 21px;margin-right: 3px" @click="onClose">
        <i class='bx bx-x'></i>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import store from "@/store";
import HBackKey from "@/components/HBackKey.vue";
import {computed, ref} from "vue";
import { openTalkBar } from "@/assets/api";
import {remote} from "electron"

const onClose = () => {
  console.log('close');
  window.electronAPI.close();
}
const onMinimize = () => {
  window.electronAPI.minimize();
}

const onMaxMize = () => {
  window.electronAPI.maxmize()
  // const win = remote.getCurrentWindow()
  // if(win.isMaximized()){
  //   win.restore()
  // }else{
  //   win.maximize()
  // }
}

const isBackKey = computed(()=>{

  if(store.state.online&&store.state.ifBackKey) {
    return true
  }else{
    return false
  }
})
</script>

<style scoped lang="stylus">
.frame-background
  color var(--font-text-color)
  width 100%
  height 35px
  display flex
  justify-content space-between

.top-bar
  height 100%
  flex-grow 1
  justify-content flex-start
  -webkit-app-region drag

.icon
  height 100%
  width 50px
  display flex
  img
    width 28px
    height 27px
    margin auto

.button-bar
  height 100%
  justify-content flex-end
  gap 3px
</style>
