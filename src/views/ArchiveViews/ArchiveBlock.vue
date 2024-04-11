<template>
  <div class="post-main full border-radius-regular">
    <div class="post-background full" v-lazyLoad="props.archiveInfo.backgroundImage.src"></div>
    <div class="post-info flex-column full">
      <div class="flex-row" style="justify-content: space-between; width: 90%" :style="{justifyContent: props.showDescription? 'space-between' : 'center'}">
        <div class="subtitle-inverse">{{ props.archiveInfo.title }}</div>
      </div>
      <div class="post-description border-radius-regular text-inverse" style="height: 40%;width: 100%" v-if="props.showDescription">
        {{ "病种：" + props.archiveInfo.description }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Post} from "@/assets/api";

// eslint-disable-next-line no-undef
const props = withDefaults(defineProps<{
  archiveInfo : Post
  showDescription?: boolean
}>(), {
  showDescription: true
})
</script>

<style scoped lang="stylus">
.post-main
  overflow hidden
  position: relative
  z-index 0
  border 2px solid var(--theme-color)
  background-color var(--theme-color)
  .post-background
    top 0
    left 0
    position absolute
    background-position center
    background-size cover
    background-repeat no-repeat
    transition all 0.2s
    z-index -1
  &:hover
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

.post-state
  border-radius 999px
  padding 2px 10px

.complete
  background-color var(--theme-color)

.incomplete
  background-color var(--error-color)
</style>
