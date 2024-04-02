<script setup lang="ts">
import type {Edge, Node, Elements} from '@vue-flow/core'
import {VueFlow, useVueFlow} from "@vue-flow/core";
import {ref,defineProps, withDefaults, defineEmits} from "vue";
import HButton from "@/components/HButton.vue";
import {affairNode} from "@/assets/api";

const props = withDefaults(defineProps<{
  nodes : Array<affairNode>
}>(),{
  nodes : ()=>[]
})

const emit = defineEmits(['nodeClicked'])
const nodes = ref<Node[]>([])
const {addNodes, onPaneReady, addEdges, onNodeClick, onNodeDoubleClick} = useVueFlow()
const edges = ref<Edge[]>([])

const initGraph = ()=>{
  for(let [index, node] of props.nodes.entries()){


    if(index!=0) {
      if(index!=props.nodes.length-1) {
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
}//使用传入节点数据初始化flow图
initGraph()
onPaneReady((instance) => instance.fitView())//适应所有节点位置，保证pane的缩放能展示所有节点
onNodeClick((event)=>{
  console.log(event)
  console.log(event.node.id)
  emit('nodeClicked',event.node.data.nodeId)
})
</script>

<template>

  <VueFlow :nodes="nodes" :edges="edges"/>

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
</style>