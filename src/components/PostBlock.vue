<template>
  <div class="post-main full border-radius-regular" @click="onPostClick">
    <transition
        name="animate__animated animate__fade"
        enter-active-class="animate__fadeIn"
        leave-active-class="animate__fadeOut"
        mode="out-in"
    >
      <div class="loading-block" v-if="!loaded">
        <div class="center">
          <div class="spinner1"></div>
        </div>
      </div>
    </transition>
    <div class="post-background full">
      <img class="center" v-lazyLoad="props.post.backgroundImage.src" @load="onLoad" style="height: 100%; width: 100%; object-fit: cover" alt src>
    </div>
    <div class="post-info flex-column full">
      <div class="flex-row" style="justify-content: space-between; width: 90%" :style="{justifyContent: props.showDescription? 'space-between' : 'center'}">
        <div class="post-title subtitle-inverse">{{ props.post.title }}</div>
        <div class="post-state hint-inverse" :class="{complete: props.post.isfavor, incomplete: !props.post.isfavor}" v-if="props.showDescription">{{props.post.isfavor?'已':'未'}}学习</div>
      </div>
      <div class="post-state hint-inverse" :class="{complete: props.post.isfavor, incomplete: !props.post.isfavor}" v-if="!props.showDescription">{{props.post.isfavor?'已':'未'}}学习</div>
      <div class="post-description border-radius-regular text-inverse" style="height: 40%;width: 100%" v-if="props.showDescription">
        {{ props.post.description }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Post} from "@/assets/api";
import {defineEmits,ref} from 'vue'
// eslint-disable-next-line no-undef
const props = withDefaults(defineProps<{
  post : Post
  showDescription?: boolean
}>(), {
  showDescription: true
})
const loaded = ref<boolean>(false)
const emit = defineEmits(['onPostClick'])
const onPostClick = () =>{
  emit('onPostClick',props.post.id)
}
const onLoad = () => {
  console.log('ok')
  loaded.value = true
}
</script>

<style scoped lang="stylus">
.post-main
  overflow hidden
  position relative
  box-shadow 0 0 2px 2px #AAA
  z-index 0
  .post-background
    top 0
    left 0
    position absolute
    background-position center
    background-size cover
    background-repeat no-repeat
    transition all 0.2s
    z-index -1
    overflow hidden
  &:hover
    cursor pointer
    .post-background
      content ''
      width 100%
      height 100%
      position absolute
      filter: blur(5px)

.post-info
  padding 20px
  justify-content space-between
  box-sizing border-box

.post-description
  backdrop-filter blur(10px)
  padding 10px
  box-sizing border-box
  overflow hidden
  background-color rgba(0 ,0 ,0, 0.1)

.post-state
  border-radius 999px
  padding 2px 10px

.post-title
  border-radius 999px
  padding 5px 15px
  backdrop-filter blur(10px)
  background-color rgba(0 ,0 ,0, 0.1)

.complete
  background-color var(--accent-color)

.incomplete
  background-color var(--error-color)

.loading-block
  background-color var(--theme-color-dark)
  position absolute
  width 100%
  height 100%
  z-index 10
</style>
