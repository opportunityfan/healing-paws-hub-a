<template>
  <div class="sidebar-item-main" :class="{'select': selected, 'unselect' : !selected}" @click="onClick">
    <div class="border pattern1" style="transform: translate(0, calc(-100%)); right: 0"></div>
    <div class="flex-row full" style="overflow: hidden; position: relative">
      <div class="sidebar-background"></div>
      <div style="width: 70%; margin: auto;z-index: 1">
        <slot name="default"></slot>
      </div>
    </div>
    <div class="border pattern1" style="right: 0; transform: rotate(-90deg)"></div>
  </div>
</template>

<script setup lang="ts">
import {ComponentInternalInstance, getCurrentInstance, onMounted, ref} from "vue";

// eslint-disable-next-line no-undef,@typescript-eslint/no-unused-vars
const props = defineProps<{
  name: string
}>()

// eslint-disable-next-line no-undef
const emits = defineEmits(['click'])

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const selected = ref<boolean>(false)

let parent : ComponentInternalInstance | null | undefined

const onClick = () => {
  parent?.exposed?.changeSelect(props.name)
  emits("click")
}

const setSelect = (b : boolean) => {
  selected.value = b
}

// eslint-disable-next-line no-undef
defineExpose({
  setSelect
})

onMounted(() => {
  parent = getCurrentInstance()?.parent
})
</script>

<style scoped lang="stylus">
.sidebar-item-main
  position relative
  width 100%
  height 50px
  transition color 0.2s
  cursor pointer
  //z-index 0
  .sidebar-background
    transition left 0.1s
    position absolute
    border-radius 999px 0 0 999px
    height 100%
    width 100%
    left 100%
  .border
    position absolute
    z-index 10



.unselect
  color var(--white-color)
  .sidebar-background
    background-color var(--theme-color-dark)
  .border
    background-color var(--theme-color)
    --r 0
  &:hover
    color var(--grey-color-bright)
    .sidebar-background
      left 15px

.select
  color var(--accent-color)
  .sidebar-background
    background-color var(--background-color)
    left 15px
  .border
    background-color var(--background-color)
    --r 40px

</style>
