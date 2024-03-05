<template>
  <div class="frame-background">
    <div class="icon-title-bar flex-row">
      <div class="icon">
        <img src="../assets/icon.png" alt="icon">
      </div>
      <div>{{ store.state.frame_title }}</div>
    </div>
    <div class="button-bar flex-row">

    </div>
  </div>
</template>

<script setup lang="ts">
import store from "@/store";
</script>

<style scoped lang="stylus">
.frame-background
  background-color var(--frame-color)
  color var(--font-color-bright)
  width 100%
  height 35px
  display flex
  justify-content space-between

.icon-title-bar
  height 100%
  flex-grow 1
  justify-content left
  -webkit-app-region drag

.icon
  height 100%
  width 50px
  display flex
  img
    width 27px
    height 27px
    margin auto

.button-bar
  width 150px
  height 100%
</style>
