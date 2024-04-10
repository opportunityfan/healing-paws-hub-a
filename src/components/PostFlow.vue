<template>
  <div class="post-flow-main">
    <HScroller>
      <div class="post-flow-bar flex-row" :style="{height: props.height === 0 ? '100%' : props.height + 'px'}">
        <div v-for="(post, index) in data.postList" :key="index" :style="{width: props.width + 'px'}" class="post-bar">
          <PostBlock :post = "post" :show-description="props.showDescription" @click="goto(props.urlPrefix+post.id)"></PostBlock>
        </div>
        <div class="more" ref="moreRef"></div>
      </div>
    </HScroller>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref, VueElement} from "vue";
import {goto, Post} from "@/assets/api"
import PostBlock from "@/components/PostBlock.vue";
import HScroller from "@/components/HScroller.vue";
// eslint-disable-next-line no-undef
const props = withDefaults(defineProps<{
  width?: number
  height?: number
  requestNewPost : (count: number) => Promise<Post[]>
  updatePostCount?: number
  showDescription?: boolean
  urlPrefix : string
}>(), {
  width: 250,
  height: 0,
  updatePostCount: 3,
  showDescription: true
})

const data = reactive<{
  postList: Post[]
  updating: boolean
}>({
  postList: [],
  updating: false
})

const moreRef = ref<VueElement>()

onMounted(() => {
  const observer = new IntersectionObserver(([{ isIntersecting }]) => {
    if (isIntersecting) {
      if (!data.updating) {
        data.updating = true
        props.requestNewPost(props.updatePostCount).then((res) => {
          res.forEach((post) => {
            data.postList.push(post)
          })
        }).finally(() => {
          data.updating = false
        })
      }
    }
  }, {
    threshold: 0.5
  })
  if (moreRef.value) observer.observe(moreRef.value)
})
</script>

<style scoped lang="stylus">
.post-flow-main
  width 100%
  max-width 100%
.post-flow-bar
  width fit-content
  justify-content space-between
  padding 5px 5px
  box-sizing border-box
  overflow hidden
  gap 20px
.post-bar
  height 100%
.more
  width 50px
  height 100%
</style>
