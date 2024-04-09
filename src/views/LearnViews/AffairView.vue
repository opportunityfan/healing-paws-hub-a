//展示某个事务详情的页面

<script setup lang="ts">

import {reactive} from "vue";
import {useRoute} from 'vue-router'
import FlowDia from "@/components/FlowDia.vue";
import axios from "@/assets/axios";
import store from "@/store";
import {affairNode, getAffairNodes, goAffairNode} from "@/assets/api";

const route = useRoute()
const affairId = route.params.affairId//事务id

let nodes = reactive([{
  id: '1321',
  name: '检查仪器',
  content: '检查仪器是否状态良好',
  contentVideo: 'null',
  contentImg: 'null',
  },
  {
    id: '3245',
    name: '仪器消毒',
    content: '使用xxx给xx仪器消毒',
    contentVideo: 'null',
    contentImg: 'null',
  },
  {
    id: '2354',
    name: '仪器消毒3',
    content: '使用xxx给xx仪器消毒',
    contentVideo: 'null',
    contentImg: 'null',
  },
  {
    id: '16788',
    name: '仪器消毒4',
    content: '使用xxx给xx仪器消毒',
    contentVideo: 'null',
    contentImg: 'null',
  }
])

</script>

<template>
  <div class="full">
    <div >事务{{affairId}}详情</div>
    <div class="full">
      <FlowDia :nodes="nodes" @nodeClicked="goAffairNode"></FlowDia>
    </div>
  </div>
</template>

<style scoped lang="stylus">

</style>