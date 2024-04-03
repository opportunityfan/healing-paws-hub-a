<template>
  <HScroller scroll-direction="column">
    <div class="flex-column">
      <markdown-renderer :markdown="data.affairNode ? data.affairNode?.content : ''"></markdown-renderer>
      <div class="flex-row">
        <HButton style="width: 200px">完成学习</HButton>
        <HButton>
          <div class="box-icon">
            <i class='bx bx-star'></i>
          </div>
        </HButton>
      </div>
    </div>
  </HScroller>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, reactive} from "vue";
import {affairNode, getAffairNode, goto} from "@/assets/api";
import MarkdownRenderer from "@/components/MarkdownRenderer.vue";
import HButton from "@/components/HButton.vue";
import store from "@/store";
import HScroller from "@/components/HScroller.vue";
// eslint-disable-next-line no-undef
const props = defineProps<{nodeId: string}>()

const data = reactive<{
  affairNode? : affairNode

}>({
  affairNode : undefined,
})

onMounted(() => {
  getAffairNode(props.nodeId).then((res) => {
    data.affairNode = new affairNode('1', '检查仪器', '### 这是标题\n\n这是检查仪器的介绍\n\n123123 $\\sum_{i}^i$\n\n123123\n\n123123\n\n123123\n\n123123\n\n123123\n\n123123\n\n123123\n\n123123\n\n123123\n\n123123\n\n123123\n\n123123\n\n123123\n\n123123\n\n123123\n\n123123\n\n123123\n\n123123\n\n123123\n\n123123\n\n123123\n\n123123', '', '')
    store.state.back_title = '返回事务'
  })
})

onUnmounted(() => {
  store.state.back_title = ''
})

</script>

<style scoped lang="stylus">

</style>
