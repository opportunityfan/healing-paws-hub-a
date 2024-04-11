<template>
  <div class="talk-bar-anchor">
    <transition
        name="animate__animated animate__fade"
        enter-active-class="animate__fadeIn"
        leave-active-class="animate__fadeOut"
        mode="out-in"
    >
      <div class="talk-bar-shadow" v-if="store.state.talkBarAppend"></div>
    </transition>
    <div class="talk-bar-main" v-click-outside="closeTalkBar" :style="{width: store.state.talkBarAppend? '60%' : '0'}">
      <div class="full" style="background-color: var(--background-color)"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import store from "@/store";
import { closeTalkBar } from "@/assets/api";
</script>

<style scoped lang="stylus">
.talk-bar-anchor
  position absolute
  width 0
  height 100%
  top 0
  left 0

.talk-bar-main
  position absolute
  height 100%
  top 0
  right 0
  transition width 0.5s
  border-radius 10px
  overflow hidden

.talk-bar-shadow
  --animate-duration 0.5s
  position fixed
  height 100%
  width 100%
  background-color rgba(0, 0, 0, 0.2)
  top 0
  right 0
  transition opacity 0.5s
</style>
