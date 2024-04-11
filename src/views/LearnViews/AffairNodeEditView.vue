<template>
  <div class="full">
    <h-loading :load="onLoad">
      <HScroller :scroll-direction="'column'">
        <div class="flex-column">
          <div class="flex-row" style="width: 100%; gap: 20px; margin: 20px 0">
            <div class="text-bold">节点名称</div>
            <HFormInput v-model="data.affairNode.name" name="节点名称" style="width: 200px"></HFormInput>
          </div>
          <div class="text-bold" style="width: 100%;margin-bottom: 20px;text-align: left">节点内容(请使用markdown编写)</div>
          <MarkdownEditor v-model="data.affairNode.content" height="600px"></MarkdownEditor>
          <div class="flex-row" style="justify-content: flex-end; width: 100%; gap: 20px">
            <HButton style="width: 80px" height="40px">取消</HButton>
            <HButton style="width: 80px" height="40px" @click="onSave">保存</HButton>
          </div>
        </div>
      </HScroller>
    </h-loading>
  </div>
</template>

<script setup lang="ts">
import MarkdownEditor from "@/components/MarkdownEditor.vue"
import {getAffairNode, affairNode, setAffairNode} from "@/assets/api";
import store from "@/store";
import {reactive} from "vue";
import HLoading from "@/components/HLoading.vue";
import HScroller from "@/components/HScroller.vue";
import HButton from "@/components/HButton.vue";
import HFormInput from "@/components/HFormInput.vue";

// eslint-disable-next-line no-undef
const props = defineProps<{nodeId: string}>()

const data = reactive<{
  affairNode: affairNode
  star : boolean
  complete: boolean
}>({
  affairNode : new affairNode('', '', '', '', ''),
  star : false,
  complete : false,
})

const onLoad = async () => {
  await getAffairNode(props.nodeId).then((res) => {
    //data.affairNode = new affairNode('1', '检查仪器', '在检查仪器之前，需要对仪器进行检查。\n\n如果没有对仪器进行检查就没法检查仪器。\n\n具体步骤如下:\n\n1. 检查仪器\n\n2. 检查仪器\n\n3. 检查仪器\n\n4. 检查仪器\n\n', '', '')
    if(res !== undefined) data.affairNode = res
    if(data.affairNode.content == undefined) data.affairNode.content = ''
  })
  return
}

const onSave = async () => {
  setAffairNode(data.affairNode).then()
}
</script>

<style lang="stylus">
</style>
