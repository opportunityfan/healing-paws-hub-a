<script setup lang="ts">
import {defineEmits} from "vue"
import {goBack} from "@/assets/api";

function back(){

  goBack()
}
</script>

<template>
  <div>
    <i class='bx bx-arrow-back H-back' @click="back"></i>
  </div>
</template>

<style scoped lang="stylus">
.H-back
  transform scale(1.3)
  cursor pointer
  margin-top 5px
.H-back:hover
  transition: color 0.1s;
  color: var(--grey-color-dark)
</style>