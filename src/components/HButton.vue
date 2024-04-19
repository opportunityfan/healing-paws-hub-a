<template>
  <div
      class="h-button border-radius-thin"
      :class="props.type"
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
  type?: 'primary'|'danger'|'secondary'
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
  font-size 14px
  transition background-color 0.1s
  cursor pointer

.primary
  background-color var(--theme-color)
  color var(--font-inverse-color)
  &:hover
    background-color var(--theme-color-dark)

.danger
  background-color var(--accent-color)
  color var(--font-inverse-color)
  &:hover
    background-color var(--accent-color-dark)

.secondary
  background-color var(--grey-color-bright)
  color var(--black-color)
  &:hover
    background-color var(--grey-color)
</style>
