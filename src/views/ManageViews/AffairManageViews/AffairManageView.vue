<script setup lang="ts">
import {useRoute} from "vue-router";
import FlowDia from "@/components/FlowDia.vue";
import {affairNode, getAffairNodes} from "@/assets/api";
import {reactive} from "vue";

const route = useRoute()
const affairId = route.params.affairId

const nodes = Array<affairNode>()
getAffairNodes(affairId as string).then(res=>{
  console.log(res)
  res.forEach(node=>{
    nodes.push(new affairNode(node.id,node.name,node.content,node.contentImg,node.contentVideo))
  })

})
const goAffairNodeManage = () => {
  console.log('goaffairnodemanage')
}
</script>

<template>

  <div class="full">
    <div>
      <FlowDia :nodes="nodes" @nodeClicked="goAffairNodeManage"></FlowDia>
    </div>
  </div>
</template>

<style scoped lang="stylus">

</style>