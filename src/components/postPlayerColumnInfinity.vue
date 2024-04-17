<template>
  <div style="width: 100%;height: 100%">
    <HScroller scrollDirection="column">
    <div ref="containerRef" class="waterfall-div">

      <div
          v-for="i in info.columnCount"
          :key="i"
          class="waterfall-column"
          :style="{
            width: info.columnWidth + 'px'
          }"
          ref="columnsRef"
      >
        <PostBlock
            v-for="(item,index) in info.postListColumn[i-1]"
            :key="index"
            :post="item"
            :style="{width: (info.columnWidth-10) + 'px'}"
            style="height: 200px;margin:20px 20px;"
        ></PostBlock>
      </div>

    </div>
    </HScroller>
    <div class="more" ref="moreRef" v-if="!noMore"></div>
    <div class="no-more" v-if="noMore">{{ `共 ${info.postList.length} 张` }}</div>

  </div>
</template>

<script setup lang="ts">
import {reactive, onMounted, ref, onUnmounted} from "vue";
import {Post} from "@/assets/api";
import PostBlock from "@/components/PostBlock.vue";
import HScroller from "@/components/HScroller.vue";

// eslint-disable-next-line no-undef
const props = withDefaults(defineProps<{
  columnMinWidth: number,
  // getImageList: (info : any) => {newInfo : any, newImageList : image[]}
  getPostList: (info : any) => Promise<{newInfo : any, newPostList : Post[]}>,
  currentI: any
}>(), {
  columnMinWidth: 200,
  getPostList: async (info : any) => {
    return {newInfo: info, newPostList: []}
  },
  currentI: {before_id: 0, per_page: 6}
})

const info = reactive<{
  columnCount: number,
  columnWidth: number,
  postList: Post[],
  postListColumn: Array<Post>[],
  updating: boolean,
  currentI: any
}>({
  columnCount: 1,
  columnWidth: 0,
  postList: [],
  postListColumn: [[],[],[],[],[],[]],
  updating: false,
  // 复制一份，防止修改props
  currentI: {...props.currentI}
})

const containerRef = ref<Element>()
const moreRef = ref<Element>()
const columnsRef = ref<Element[]>([])

let intervalHook : number
const noMore = ref<boolean>(false)

onMounted(() => {
  init()
  intervalHook = setInterval(init, 300)
  const observer = new IntersectionObserver(([{ isIntersecting }]) => {
    if (isIntersecting) {
      if (!info.updating) {
        console.log('updating')
        info.updating = true
        more().then(() => {
          info.updating = false
        })
        console.log('async ok')
      }
    }
  }, {
    threshold: 0.5
  })
  observer.observe(moreRef.value!) //观察指令绑定的dom
})

onUnmounted(() => {
  clearInterval(intervalHook)
})

const resize = async () => {
  info.updating = true
  for (let i = 0; i < 6; ++i)
    info.postListColumn[i].length = 0
  for (let i in info.postList) {
    await insert(info.postList[i])
  }
  info.currentI.per_page = info.columnCount - 1
  info.updating = false
}

const init = () => {
  let temp = Math.floor(containerRef.value!.clientWidth / props.columnMinWidth);
  if (temp < 1) temp = 1
  if (temp > 6) temp = 6
  if(temp != info.columnCount) {
    if(!info.updating) {
      info.columnCount = temp
      resize()
    }
  }
  info.columnWidth = containerRef.value!.clientWidth / info.columnCount

  // 检查moreRef是否在可视区域内
  if (moreRef.value!.getBoundingClientRect().top < window.innerHeight) {
    if (!info.updating) {
      console.log('init updating')
      info.updating = true
      more().then(() => {
        info.updating = false
      })
      console.log('init async ok')
    }
  }
}

const insert = async (post : Post) => {
  let minHeight = 999999
  let c
  for (let column in columnsRef.value) {
    if (minHeight > columnsRef.value[column].clientHeight) {
      minHeight = columnsRef.value[column].clientHeight
      c = column
    }
  }
  if (!info.postListColumn[Number(c)]) return;
  info.postListColumn[Number(c)].push(post)
  // sleep(1000)
}

const more = async () => {
  const {newInfo, newPostList} = await props.getPostList(info.currentI)
  if (newPostList.length == 0) {
    noMore.value = true
    clearInterval(intervalHook)
    return
  }
  for (let item in newPostList) {
    if (!info.postList) return;
    info.postList.push(newPostList[item])
    await insert(newPostList[item])
  }
  info.currentI = newInfo
}
</script>

<style scoped>
.waterfall-div {
  display: flex;
  width: 100%;
  height: 100%;
}
.waterfall-column {
  box-sizing: border-box;
  padding: 5px;
  height: fit-content;
}
.more {
  height: 50px;
}

.no-more {
  height: 50px;
  text-align: center;
  line-height: 50px;
  font-size: 20px;
  border-top: 2px solid var(--background-color);
  color: var(--font-text-color);
}
</style>
