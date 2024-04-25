<template>
  <div class="full">
    <HLoading :load="onLoad">
      <div class="full">
        <HScroller scroll-direction="column" ref="scrollRef">
          <div class="flex-column">
            <div>
              <div class="subtitle" style="padding: 15px 0;position: relative">
                <span>{{ data.affairNode ? '事务节点:' + data.affairNode?.name : '' }}</span>
                <div class="box-icon button-hover" style="position: absolute; top: 15px;height: 26px;right: -40px;display: inline-block" @click="goto('/affair-node-edit/' + data.affairNode?.id)">
                  <i class='bx bxs-edit center'></i>
                </div>
              </div>
            </div>
            <HStatistic></HStatistic>
            <markdown-renderer :markdown="data.affairNode?.content ? data.affairNode?.content : ''"  style="user-select: text"></markdown-renderer>
          </div>
        </HScroller>
        <div class="tool-bar flex-column" style="gap: 10px">
          <HIconButton
              name="返回顶部"
              color="var(--grey-color)"
              hover-color="var(--grey-color-dark)"
              icon-class="bxs-to-top"
              :icon-size="18"
              @click="scrollRef.toTop()"
          ></HIconButton>

          <HIconButton
              name="完成学习"
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
import {affairNode, getAffairNode, goto, isFavor, markFavor, unMarkFavor} from "@/assets/api";
import MarkdownRenderer from "@/components/MarkdownRenderer.vue";
import store from "@/store";
import HScroller from "@/components/HScroller.vue";
import HIconButton from "@/components/HIconButton.vue";
import HLoading from "@/components/HLoading.vue";
import HDivider from "@/components/HDivider.vue";
import HStatistic from "@/components/HStatistic.vue";
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
  if(!data.complete){
    markFavor(props.nodeId,'affairNode')
    data.complete = true
  }else{
    unMarkFavor(props.nodeId)
    data.complete = false
  }
}

const onLoad = async () => {
  await getAffairNode(props.nodeId).then((res) => {
    //data.affairNode = new affairNode('1', '检查仪器', '在检查仪器之前，需要对仪器进行检查。\n\n如果没有对仪器进行检查就没法检查仪器。\n\n具体步骤如下:\n\n1. 检查仪器\n\n2. 检查仪器\n\n3. 检查仪器\n\n4. 检查仪器\n\n', '', '')
    data.affairNode = res
    // store.state.back_title = '返回事务'
  })
  if(await isFavor(props.nodeId,'affairNode')){
    data.complete = true
  }
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
  bottom 20px
  right 20px

.loading
  position absolute

</style>
