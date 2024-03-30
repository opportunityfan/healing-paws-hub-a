<script setup lang="ts">
import type {Elements} from '@vue-flow/core'
import type {Node} from '@vue-flow/core'
import {VueFlow, useVueFlow} from "@vue-flow/core";
import {ref} from "vue";
import HButton from "@/components/HButton.vue";

const nodes = ref<Node[]>([
  {
    id:'1',
    label:'node1',
    position:{x: 100,y:150},
    class:'custom-node'
  },
  {
    id: '2',
    label: 'node 2',
    position: {x: 200, y: 200}
  },
  {
    id: '4',
    label: 'node4',
    position: {x: 700, y: 700}
  }

])
const {addNodes, onPaneReady} = useVueFlow()
const edges = ref([
  {
    id: 'e1-2',
    target: '2',
    source: '1',
  },
])
onPaneReady((instance) => instance.fitView())

function onAddNode(){
  addNodes({
    id:'3',
    label:'node3',
    position:{x: 250,y:300},
    class:'custom-node'
  })
}
</script>

<template>

  <VueFlow :nodes="nodes" :edges="edges"/>


</template>

<style lang="stylus">
@import '@vue-flow/core/dist/style.css'
@import '@vue-flow/core/dist/theme-default.css'

.custom-node
  background var(--theme-color)
  color white
  border 1px solid var(--theme-color)
  border-radius 18px
  width 100px

.custom-node:hover
  background var(--theme-color-dark)


</style>