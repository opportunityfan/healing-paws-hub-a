<script setup lang="ts">
import type {Edge, Node} from '@vue-flow/core'
import {useVueFlow, VueFlow} from "@vue-flow/core";
import {Background, Panel, PanelPosition} from '@vue-flow/additional-components'

import {defineEmits, defineProps, reactive, ref, withDefaults} from "vue";
import HButton from "@/components/HButton.vue";
import {affair, affairNode, getAffairNodes, showMessage} from "@/assets/api";
import HInput from "@/components/HInput.vue";
import axios from "@/assets/axios";
import store from "@/store";
import HFormInput from "@/components/HFormInput.vue";

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
  isFitView : boolean
}>({
  nodes : [],
  nodeEditPanel : false,
  nodeIndex : 0,
  isFitView : false
})

const tempNode = reactive({name:'默认节点名称'})

const emit = defineEmits(['nodeClicked','nodeDoubleClicked','onSave'])
const nodes = ref<Node[]>([])
const {getSelectedNodes, getSelectedEdges, removeNodes, removeEdges,toObject,onPaneReady, addEdges,addNodes,onNodeClick,fitView, onNodeDoubleClick, onNodeContextMenu, onEdgeContextMenu ,onConnect, onEdgesChange,onNodesChange} = useVueFlow()
const edges = ref<Edge[]>([])

const initGraph = async ()=>{
  getAffairNodes(props.affairId as string).then(res=>{
    res.nodes.forEach(node=>{
      data.nodes.push(new affairNode(node.id,node.name,node.content,node.contentImg,node.contentVideo,node.positionX,node.positionY))
    })

    for(let [index,node] of res.nodes.entries()){
      data.nodeIndex = index+1
      if(index!=0) {
        if(index!=data.nodes.length-1) {
          nodes.value.push({
            id: node.id,
            label: node.name,
            position: {x: node.positionX, y: node.positionY},
            class: 'mid-node',
            data:{
              nodeId: node.id
            }
          })
        }else{
          nodes.value.push({
            id: node.id,
            label: node.name,
            position: {x: node.positionX, y: node.positionY},
            class: 'end-node',
            data:{
              nodeId: node.id
            }
          })
        }
        // edges.value.push({
        //   id:'e'+index.toString() + '-' + (index+1).toString(),
        //   source: index.toString(),
        //   target: (index+1).toString()
        // })
      }else{
        nodes.value.push({
          id: node.id,
          label: node.name,
          position: {x: node.positionX, y: node.positionY},
          class: 'start-node',
          data:{
            nodeId: node.id
          }
        })
      }
    }
    if(res.edges){
      res.edges.forEach((edge,index)=>{
        edges.value.push({
          id:'e'+edge[0]+'-'+edge[1],
          source: edge[0],
          target: edge[1]
        })
      })
    }
  })

  // for(let [index, node] of data.nodes.entries()){
  //
  // }
}//使用传入节点数据初始化flow图
if(props.affairId !== '0') {
  initGraph()

}
onPaneReady((instance) => instance.fitView())//适应所有节点位置，保证pane的缩放能展示所有节点
onNodeClick((event)=>{
  console.log(event)
  console.log(event.node.id)
  emit('nodeClicked',event.node.data.nodeId)
})
onNodeDoubleClick((event) =>{
  emit('nodeDoubleClicked',event.node.data.nodeId)
})

onConnect((params)=>{
  edges.value.push({
    id:'e'+params.source + '-' + params.target,
    source: params.source,
    target: params.target
  })
  console.log('edges情况',edges.value)
})
const showPanel = () => {
  data.nodeEditPanel = !data.nodeEditPanel
}

const onNodeAdd =  () => {
  data.nodeIndex++

  const formData = new FormData()
  formData.append('name',tempNode.name)
  formData.append('content','节点内容')
  formData.append('positionX','200')
  formData.append('positionY','250')

  axios.post('/affairnode',formData,{
    headers:{
      token:store.state.token
    }
  }).then(res=>{
    console.log('添加一个节点的结果',res.data)
    if(res.data.code==200) {
      addNodes({
        id: res.data.data.id,
        position: {x: 200, y: 250},
        label: tempNode.name,
        class: 'mid-node',
        data: {
          nodeId: res.data.data.id
        }
      })

      data.isFitView = true
      showMessage('添加节点成功!','success')
    }else{
      showMessage(`${res.data.msg}`,'error')
    }
  }).catch(()=>{
    showMessage('网络错误','error')
  })

}

onNodesChange(()=>{
  console.log('nodes情况',nodes.value)
  if(data.isFitView){
    fitView()
    data.isFitView = false
  }
  const flowData = toObject()
  console.log('流程图数据结构',toObject())
})
const updateAffairNode = (nodeId : string, positionX : number, positionY : number) => {
  const formdata = new FormData()
  console.log('检查id',nodeId)
  console.log('检查x',Math.ceil(positionX).toString())
  console.log('检查y',Math.ceil(positionY).toString())
  formdata.append('id',nodeId)
  formdata.append('positionX',Math.ceil(positionX).toString())
  formdata.append('positionY',Math.ceil(positionY).toString())
  axios.put('/affairnode',formdata,{
    headers:{
      token:store.state.token
    }
  }).then(res=>{
    console.log('检查更新节点',res.data)

  }).catch(()=>{
    showMessage('网络错误','error')
  })
}

const onSave = () => {
  const flowData = toObject()
  console.log('保存的flowData',flowData)
  console.log('flowData中的nodes',flowData.nodes)
  console.log('flowData中的edges',flowData.edges)
  const affairNodes = Array<string>()
  const formdata = new FormData()
  formdata.append('id',props.affairId)
  flowData.nodes.forEach((node,index)=>{
    updateAffairNode(node.id,node.position.x,node.position.y)
    affairNodes.push(node.id)
    formdata.append(`affairs[${index}]`,node.id)
  })

  const updateEdges = new Array<Array<string>>()
  flowData.edges.forEach((edge,index)=>{
    updateEdges.push([edge.source,edge.target])

  })
  updateEdges.forEach((edge,index)=>{
    console.log('检查更新时的每个edge',JSON.stringify(edge))
    formdata.append('edges',edge[0]+','+edge[1])
  })

  //formdata.append('edges',JSON.stringify(updateEdges))

  emit('onSave',formdata)

}

onEdgesChange(()=>{
  console.log('edges情况',edges.value)
  console.log('见擦汗edge更新后的情况',toObject())
})
const removeSelected = () => {
  let tnodes = getSelectedNodes.value
  tnodes.forEach(node=>{
    removeNodes(node.id)
  })
  let tedges = getSelectedEdges.value
  tedges.forEach(edge=>{
    removeEdges(edge.id)
  })
  console.log('选中的nodes',tnodes)
}
</script>

<template>
<div class="full">
  <div class="flow-panel">
    <VueFlow :nodes="nodes" :edges="edges" fit-view-on-init>
      <Background/>
    </VueFlow>
  </div>
  <div class="edit-panel" v-if="isEditable">
    <HButton height="35px" class="button-block" @click="showPanel">添加节点</HButton>
    <HButton height="35px" class="button-block" @click="removeSelected">删除所选</HButton>
    <HButton height="35px" class="button-block" @click="onSave">保存/创建</HButton>

  </div>
  <div class="edit-panel"  v-if="data.nodeEditPanel">

    <HFormInput name="节点名称" v-model="tempNode.name" class="button-block" width="190px" height="35px"></HFormInput>
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
  height 100%
  margin 10px

.edit-panel
  display flex
  flex-direction row
  .button-block
    width 180px
    margin 10px 20px
    height 35px
</style>