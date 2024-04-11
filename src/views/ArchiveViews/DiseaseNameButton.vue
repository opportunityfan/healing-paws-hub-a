<template>
  <div class="diseaseNameButton border-radius-thin" :class="{isChosen: isChosen}" :style="{height: props.height === '' ? '40px' : props.height}">
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
  isChosen?: boolean
}>(),{
  type: "primary",
  isChosen: false
});
</script>

<style scoped lang="stylus">
.diseaseNameButton
  width 100%
  height 40px
  position relative
  margin: 20px 0
  background-color var(--theme-color)
  color var(--font-inverse-color)
  font-size 12px
  transition background-color 0.1s
  cursor pointer

.diseaseNameButton:hover
  background-color var(--theme-color-dark)

.isChosen
  background-color var(--theme-color-dark)

</style>
