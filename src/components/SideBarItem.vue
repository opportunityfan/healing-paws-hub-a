<template>
  <div class="sidebar-item-main flex-row">
    <div class="sidebar"></div>
    <div style="margin: auto;width: 70%">
      <slot name="default"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";

const selected = ref<boolean>(false)
</script>

<style scoped lang="stylus">
.sidebar-item-main
  width 100%
  height 50px
  &:hover
    background-color var(--theme-color-dark)
</style>
