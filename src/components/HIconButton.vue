<template>
  <div :style="{height: props.size + 'px',width: props.size + 'px'}" style="position: relative">
    <div
        class="icon-button flex-row"
        :style="{
        height: props.size + 'px',
        maxWidth: data.hover? props.hoverSize + 'px' : props.size + 'px',
        backgroundColor: data.hover? props.hoverColor : props.color,
        color: props.iconColor,
        fontSize: props.iconSize + 'px'
      }"
        :class="{'hover' : data.hover }"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
        @click="onClick"
    >
      <div class="flex-row" style="justify-content: flex-end; position: static; right: 0">
        <div style="white-space: nowrap; flex-grow: 1; text-align: center; padding-left: 20px" class="hint-inverse">{{ props.name }}</div>
        <div :style="{height: props.size + 'px',width: props.size + 'px'}" class="flex-row" style="justify-content: center">
          <div>
            <i class="bx icon-class" :class="props.iconClass"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {reactive} from "vue";
// eslint-disable-next-line no-undef
const props = withDefaults(defineProps<{
  name: string
  size?: number
  color?: string
  hoverColor?: string
  hoverSize?: number
  iconColor?: string
  iconSize?: number
  iconClass: string
}>(), {
  size: 40,
  color: 'var(--theme-color)',
  hoverColor: 'var(--theme-color-dark)',
  hoverSize: 120,
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
  justify-content flex-end
  width fit-content
  overflow hidden
  transition all 0.2s
  position absolute
  right 0
  &:hover
    background-color var(--theme-color-dark)

.icon-class
  display block
</style>
