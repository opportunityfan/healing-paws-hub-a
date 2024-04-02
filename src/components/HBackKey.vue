<script setup lang="ts">
import {goBack} from "@/assets/api";
import store from "@/store";
function back(){

  goBack()
}
</script>

<template>
  <div class="flex-row back-div" style="gap: 10px" @click="back">
    <i class='bx bx-arrow-back H-back'></i>
    <div class="text-bold">{{ store.state.back_title }}</div>
  </div>
</template>

<style scoped lang="stylus">
.back-div
  .H-back
    transform scale(1.3)
    cursor pointer
    margin auto
    display block
  &:hover
    .text-bold
      color: var(--grey-color-dark)
    .H-back
      transition: color 0.1s;
      color: var(--grey-color-dark)
</style>
