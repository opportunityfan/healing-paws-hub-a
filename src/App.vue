<template>
  <div style="position: absolute;width: 100%; height: 100%;">
    <FrameBar></FrameBar>
    <div style="width: 100%; height: 100%">
      <router-view/>
    </div>
  </div>
</template>

<style lang="stylus">
@import "assets/themes/mixin.styl"
@import "assets/styles"
@import "assets/font"

#app
  font-family Readex Pro
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  theme_color()

body
  margin: 0
  user-select none

</style>

<script setup lang="ts">
import FrameBar from "@/components/FrameBar";
import {onMounted} from "vue";
import {changeTheme} from "@/assets/api";

onMounted(() => {
  changeTheme("bright");
})
</script>
