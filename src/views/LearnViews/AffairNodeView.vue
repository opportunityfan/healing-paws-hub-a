<template>
  <div class="full">
    <HLoading :load="onLoad">
      <div class="full">
        <HScroller scroll-direction="column" ref="scrollRef">
          <div class="flex-column" style="user-select: text">
            <!--      <div class="subtitle">{{ data.affairNode ? data.affairNode?.name : '' }}</div>-->
            <markdown-renderer :markdown="data.affairNode ? data.affairNode?.content : ''"></markdown-renderer>
          </div>
        </HScroller>
        <div class="tool-bar flex-column" style="gap: 20px">
          <HIconButton
              color="var(--grey-color)"
              hover-color="var(--grey-color-dark)"
              icon-class="bxs-to-top"
              :icon-size="18"
              @click="scrollRef.toTop()"
          ></HIconButton>
          <HIconButton
              :icon-class="data.star? 'bxs-star' : 'bx-star'"
              :color="data.star? 'var(--accent-color)' : 'var(--grey-color)'"
              :hover-color="data.star? 'var(--accent-color-dark)' : 'var(--grey-color-dark)'"
              @click="onStar"
          ></HIconButton>
          <HIconButton
              :icon-class="data.complete? 'bxs-trophy' : 'bx-check'"
              :color="data.complete? 'var(--accent-color)' : 'var(--grey-color)'"
              :hover-color="data.complete? 'var(--accent-color-dark)' : 'var(--grey-color-dark)'"
              @click="onComplete"
              :icon-size="18"
          ></HIconButton>
        </div>
      </div>
    </HLoading>
  </div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, reactive, VueElement, ref} from "vue";
import {affairNode, getAffairNode, goto} from "@/assets/api";
import MarkdownRenderer from "@/components/MarkdownRenderer.vue";
import store from "@/store";
import HScroller from "@/components/HScroller.vue";
import HIconButton from "@/components/HIconButton.vue";
import HLoading from "@/components/HLoading.vue";
// eslint-disable-next-line no-undef
const props = defineProps<{nodeId: string}>()

const data = reactive<{
  affairNode? : affairNode
  star : boolean
  complete: boolean
}>({
  affairNode : undefined,
  star : false,
  complete : false,
})

const scrollRef = ref<VueElement>()

const onStar = () => {
  data.star = !data.star
}

const onComplete = () => {
  data.complete = true
}

const onLoad = async () => {
  await getAffairNode(props.nodeId).then((res) => {
    data.affairNode = new affairNode('1', '检查仪器', '### 这是标题\n\n这是检查仪器的介绍\n\n123123 $\\sum_{i}^i$\n\n123123\n\n123123\n\n123123\n\n123123\n\n123123\n\n123123\n\n123123\n\n123123\n\n123123\n\n123123\n\n123123\n\n123123\n\n123123\n\n123123\n\n123123\n\n123123\n\n123123\n\n123123\n\n123123\n\n123123\n\n123123\n\n123123', '', '')
    store.state.back_title = '返回事务'
  })
  return
}

onUnmounted(() => {
  store.state.back_title = ''
})

</script>

<style scoped lang="stylus">
.star-button
  border-radius 999px
  width 40px
  height 40px
  background-color var(--grey-color)
  &:hover
    background-color var(--grey-color-dark)

.star
  background-color var(--accent-color)
  &:hover
    background-color var(--accent-color-dark)

.tool-bar
  position absolute
  bottom 50px
  right 50px

.loading
  position absolute

</style>
