<template>
  <div
      class="image-main"
      :style="{
          width: props.fix === 'width' ? size + 'px' : size / image.height * image.width + 'px',
          height: props.fix === 'height' ? size + 'px' : size / image.width * image.height + 'px'
        }"
      :class="{'loaded' : data.loaded}"
  >
    <transition
        name="animate__animated animate__fade"
        enter-active-class="animate__fadeIn"
        leave-active-class="animate__fadeOut"
        mode="out-in"
    >
      <div class="loading-block" v-if="!data.loaded">
        <div class="center">
          <div class="spinner1"></div>
        </div>
      </div>
    </transition>

    <div class="image-block">
      <img @load="onLoad" v-lazyLoad="props.image.src" alt="" src="">
    </div>
  </div>


</template>

<script setup lang="ts">
import {defineProps, defineEmits, reactive} from 'vue'
import {Image} from "@/assets/api";
// eslint-disable-next-line no-undef
const props = withDefaults(defineProps<{
  image: Image
  fix?: 'width'|'height'
  size?: number
}>(),{
  fix: 'width',
  size: 100
})

const data = reactive<{
  loaded: boolean
}>({
  loaded: false
})

const emits = defineEmits(['load','error'])

const onLoad = () => {
  data.loaded = true
}

</script>

<style scoped lang="stylus">
.image-main
  position relative
  scale 1.2

.image-block
  width 100%
  height 100%
  cursor pointer
  transition all 0.3s ease
  img
    width 100%
    height 100%
  img[src=''],
  img:not([src])
    opacity 0

.loaded
  animation fade 0.5s, shrink 0.5s

.loading-block
  position absolute
  width 100%
  height 100%

.image-block:hover
  transform scale(1.15)
  transition all 0.3s ease
.flex-container
  display flex
  flex-direction column
  justify-content flex-end
</style>
