<template>
  <div class="icon" :style="{width: size+'px', height: size+'px'}">
    <img src="../assets/icon.png" alt="icon">
  </div>
</template>

<script setup lang="ts">
// eslint-disable-next-line no-undef
const props = withDefaults(defineProps<{
  size?: number
}>(), {
  size: 30
})
</script>

<style scoped lang="stylus">
.icon
  display flex
  img
    max-width 100%
    max-height 100%
    margin auto
</style>
