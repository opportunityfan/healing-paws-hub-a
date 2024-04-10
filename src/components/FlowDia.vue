<script setup lang="ts">
import type {Edge, Node} from '@vue-flow/core'
import {VueFlow, useVueFlow} from "@vue-flow/core";
import {ref, defineProps, withDefaults, defineEmits, reactive, onMounted} from "vue";
import HButton from "@/components/HButton.vue";
import {affairNode, getAffairNodes} from "@/assets/api";
import HInput from "@/components/HInput.vue";
const props = withDefaults(defineProps<{
  affairId: string
  isEditable: boolean
}>(),{
  affairId: '',
  isEditable: true
})
const data = reactive<{
  nodes : Array<affairNode>,
  nodeEditPanel : boolean
  nodeIndex : number
}>({
  nodes : [],
  nodeEditPanel : false,
  nodeIndex : 0
})

const tempNode = reactive({name:'name'})

const emit = defineEmits(['nodeClicked'])
const nodes = ref<Node[]>([])
const {addNodes, onPaneReady, addEdges, onNodeClick, onNodeDoubleClick, onNodeContextMenu} = useVueFlow()
const edges = ref<Edge[]>([])

const initGraph = async ()=>{
  getAffairNodes(props.affairId as string).then(res=>{
    res.forEach(node=>{
      data.nodes.push(new affairNode(node.id,node.name,node.content,node.contentImg,node.contentVideo))
    })

    for(let [index,node] of res.entries()){
      data.nodeIndex = index+1
      if(index!=0) {
        if(index!=data.nodes.length-1) {
          nodes.value.push({
            id: (index+1).toString(),
            label: node.name,
            position: {x: ((index+1) * 50) + 100, y: ((index+1) * 100) + 100},
            class: 'mid-node',
            data:{
              nodeId: node.id
            }
          })
        }else{
          nodes.value.push({
            id: (index+1).toString(),
            label: node.name,
            position: {x: ((index+1) * 50) + 100, y: ((index+1) * 100) + 100},
            class: 'end-node',
            data:{
              nodeId: node.id
            }
          })
        }
        edges.value.push({
          id:'e'+index.toString() + '-' + (index+1).toString(),
          source: index.toString(),
          target: (index+1).toString()
        })
      }else{
        nodes.value.push({
          id: (index+1).toString(),
          label: node.name,
          position: {x: ((index+1) * 50) + 100, y: ((index+1) * 100) + 100},
          class: 'start-node',
          data:{
            nodeId: node.id
          }
        })
      }
    }
  })

  // for(let [index, node] of data.nodes.entries()){
  //
  // }
}//使用传入节点数据初始化flow图
initGraph()
onPaneReady((instance) => instance.fitView())//适应所有节点位置，保证pane的缩放能展示所有节点
onNodeClick((event)=>{
  console.log(event)
  console.log(event.node.id)
  emit('nodeClicked',event.node.data.nodeId)
})

const showPanel = () => {
  data.nodeEditPanel = true
}

const onNodeAdd = () => {
  data.nodeIndex++
  const nodeIndex = data.nodeIndex
  addNodes({
    id : nodeIndex.toString(),
    position : {x: ((nodeIndex) * 50) + 100, y: ((nodeIndex+1) * 100) + 100},
    label : tempNode.name
  })
}

</script>

<template>
<div class="full">
  <div class="flow-panel">
    <VueFlow :nodes="nodes" :edges="edges"/>
  </div>
  <div class="edit-panel" v-if="isEditable">
    <HButton height="35px" class="button-block" @click="showPanel">添加节点</HButton>
    <HButton height="35px" class="button-block">保存</HButton>
  </div>
  <div class="edit-panel"  v-if="data.nodeEditPanel">
    <HInput name="nodeName" v-model="tempNode.name" height="35px" class="button-block"></HInput>
    <HButton height="35px" class="button-block" @click="onNodeAdd">确认添加</HButton>
  </div>

</div>
</template>

<style lang="stylus">
@import '@vue-flow/core/dist/style.css'
@import '@vue-flow/core/dist/theme-default.css'

.mid-node
  background var(--theme-color)
  color white
  border 1px solid var(--theme-color)
  border-radius 18px
  width 100px

.mid-node:hover
  background var(--theme-color-dark)
  transition background-color 0.2s

.start-node
  background var(--accent-color)
  color white
  border 1px solid var(--accent-color)
  border-radius 18px
  width 100px
.start-node:hover
  background var(--accent-color-dark)
  transition background-color 0.2s

.end-node
  background var(--accent-color)
  color white
  border 1px solid var(--accent-color)
  border-radius 18px
  width 100px
.end-node:hover
  background var(--accent-color-dark)
  transition background-color 0.2s

.flow-panel
  height 70%

.edit-panel
  display flex
  flex-direction row
  .button-block
    width 200px
    margin 10px 20px
</style>