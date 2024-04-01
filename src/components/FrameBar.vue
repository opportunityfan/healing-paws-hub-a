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

        <HBackKey v-if="store.state.ifBackKey"></HBackKey>
      </transition>
    <div class="top-bar flex-row">

    </div>
    <div class="button-bar flex-row">
      <div class="box-icon button-hover" style="font-size: 16px">
        <i class='bx bxs-cog' ></i>
      </div>
      <div class="box-icon button-hover" style="font-size: 19px" @click="onMinimize">
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
import HIcon from "@/components/HIcon.vue";
import HSearch from "@/components/HSearch.vue";
import HBackKey from "@/components/HBackKey.vue";
import {computed, ref} from "vue";
import router from "@/router";
import {useRoute, useRouter} from "vue-router";
const onClose = () => {
  console.log('close');
  window.electronAPI.close();
}
const onMinimize = () => {
  window.electronAPI.minimize();
}

const isbackKey = computed(()=>{

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
