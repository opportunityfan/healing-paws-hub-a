<template>
  <div class="main-div flex-row border-radius-regular">
    <div class="full" style="position:absolute; z-index: -1; margin-left: 20px;background-color: var(--background-color)"></div>
    <SideBar></SideBar>
    <div class="flex-column" style="height: 100%;flex-grow: 1">
      <FrameBar></FrameBar>
      <div style="width: 100%; flex-grow: 1; overflow: hidden">
        <router-view/>
      </div>
    </div>
  </div>
</template>

<style lang="stylus">
@import "assets/themes/mixin.styl"
@import "assets/styles"
@import "assets/font"
@import "https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"

#app
  font-family Readex Pro
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  theme_color()

body
  margin: 0
  user-select none

.main-div
  position absolute
  width 100%
  height 100%
  overflow hidden
</style>

<script setup lang="ts">
import FrameBar from "@/components/FrameBar";
import {onMounted} from "vue";
import {changeTheme} from "@/assets/api";
import SideBar from "@/components/SideBar.vue";

onMounted(() => {
  changeTheme("bright");
})
</script>
