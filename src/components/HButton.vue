<template>
  <div
      class="h-button border-radius-thin"
      :class="props.type==='danger'?'h-button-danger':'h-button'"
      :style="{
        height: props.height === '' ? '40px' : props.height,
      }"
  >
    <div class="center">
      <slot name="default"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import{defineProps, withDefaults} from 'vue'
const props = withDefaults(defineProps<{
  type?: string
  size?: string
  height?: string
}>(),{
  type: "primary",
});
</script>

<style scoped lang="stylus">
.h-button
  width 100%
  height 40px
  position relative
  margin: 20px 0
  background-color var(--theme-color)
  color var(--font-inverse-color)
  font-size 14px
  transition background-color 0.1s
  cursor pointer

.h-button:hover
  background-color var(--theme-color-dark)

.h-button-danger
  background-color var(--accent-color)
.h-button-danger:hover
  background-color var(--accent-color-dark)
</style>
