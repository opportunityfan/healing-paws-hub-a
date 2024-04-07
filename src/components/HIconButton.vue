<template>
  <div
      class="icon-button flex-row"
      :style="{height: props.size + 'px', width: props.size + 'px', backgroundColor: data.hover? props.hoverColor : props.color, color: props.iconColor, fontSize: props.iconSize + 'px'}"
      :class="{'hover' : data.hover }"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
      @click="onClick"
  >
    <div>
      <i class="bx icon-class" :class="props.iconClass"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import {reactive} from "vue";
// eslint-disable-next-line no-undef
const props = withDefaults(defineProps<{
  size?: number
  color?: string
  hoverColor?: string
  iconColor?: string
  iconSize?: number
  iconClass: string
}>(), {
  size: 40,
  color: 'var(--theme-color)',
  hoverColor: 'var(--theme-color-dark)',
  iconColor: 'var(--white-color)',
  iconSize: 16
})

// eslint-disable-next-line no-undef
const emits = defineEmits(['click'])

const data = reactive<{
  hover : boolean
}>({
  hover : false
})

const onMouseEnter = () => {
  data.hover = true
}

const onMouseLeave = () => {
  data.hover = false
}

const onClick = () => {

  emits('click')
}
</script>

<style scoped lang="stylus">
.icon-button
  background-color var(--theme-color)
  border-radius 999px
  justify-content center
  transition all 0.2s
  &:hover
    background-color var(--theme-color-dark)

.icon-class
  display block
</style>
