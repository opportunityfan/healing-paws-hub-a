<script setup lang="ts">
import {useRoute} from "vue-router";
import FlowDia from "@/components/FlowDia.vue";
import {affairNode, getAffairNodes} from "@/assets/api";

const route = useRoute()
const affairId = route.params.affairId as string

const nodes = Array<affairNode>()

const goAffairNodeManage = () => {
  console.log('goaffairnodemanage')
}
</script>

<template>

  <div class="full">
    <div >事务{{affairId}}详情</div>
    <div class="full">
      <FlowDia :affair-id="affairId" @nodeClicked="goAffairNodeManage"></FlowDia>
    </div>
  </div>
</template>

<style scoped lang="stylus">

</style>