<template>
  <div class="frame-background">
    <div class="icon-title-bar flex-row">
      <div class="icon">
        <img src="../assets/icon.png" alt="icon">
      </div>
      <div style="font-size: 14px">{{ store.state.frame_title }}</div>
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
const onClose = () => {
  console.log('close');
  window.electronAPI.close();
}
const onMinimize = () => {
  window.electronAPI.minimize();
}
</script>

<style scoped lang="stylus">
.frame-background
  color var(--font-color-dark)
  width 100%
  height 35px
  display flex
  justify-content space-between

.icon-title-bar
  height 100%
  flex-grow 1
  justify-content flex-start
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
  height 100%
  justify-content flex-end
  gap 3px
</style>
