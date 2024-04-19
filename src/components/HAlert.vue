<template>
  <transition
      name="animate__animated animate__fade"
      enter-active-class="animate__fadeIn"
      leave-active-class="animate__fadeOut"
      mode="out-in"
  >
    <div class="alert-main" v-if="props.modelValue">
      <div class="full border-radius-regular" style="overflow: hidden;background-color: rgba(0, 0, 0, 0.2);position: relative"></div>
      <div class="alert-content center border-radius-regular" v-click-outside="onClickOutside">
        <slot name="default"></slot>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">

// eslint-disable-next-line no-undef
const props = withDefaults(defineProps<{
  modelValue: boolean
  clickToClose?: boolean
}>(), {
  clickToClose: true
})

// eslint-disable-next-line no-undef
const emits = defineEmits(['update:modelValue'])

const onClickOutside = () => {
  if (props.clickToClose)
    emits('update:modelValue', false)
}


</script>

<style scoped lang="stylus">
.alert-main
  position fixed
  width 100%
  height 100%
  top 0
  left 0
  z-index 11

.alert-content
  min-height 100px;
  min-width 180px
  padding 20px
  background-color var(--background-color)
  box-shadow 0 0 3px 3px rgba(0, 0, 0, 0.2)
</style>
