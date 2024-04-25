//展示某个事务详情的页面

<script setup lang="ts">

import {reactive} from "vue";
import {useRoute} from 'vue-router'
import FlowDia from "@/components/FlowDia.vue";

import {
  affairNode,
  getAffairNodes,
  goAffairNode,
  goto,
  isFavor,
  markFavor,
  showMessage,
  unMarkFavor
} from "@/assets/api";
import HStatistic from "@/components/HStatistic.vue";
import HDivider from "@/components/HDivider.vue";
import axios from "@/assets/axios";
import store from "@/store";
import HLoading from "@/components/HLoading.vue";
import HIconButton from "@/components/HIconButton.vue";

const route = useRoute()

const affair = reactive<{
  id : string
  name? : string
  description?: string
  pic?:string
  picSize?:Array<number>
  role?:string
}>({
  id : route.params.affairId as string,
  name : '事务',
  description:'这是一个事务',
  role:'医师'
})
const data = reactive<{
  complete : boolean
}>({
  complete : false
})
const getAffairById = async () => {
  axios.get('/affair/'+affair.id,{
    headers:{
      token : store.state.token
    }
  }).then(res=>{
    console.log('拿affair返回',res.data)
    if(res.data.code==200) {
      affair.name = res.data.data.name
    }else{
      showMessage(`${res.data.msg}`,'error')
    }
  }).catch(()=>{
    showMessage('网络错误','error')
  })

}


const onLoad = async () =>{
  await getAffairById()
  if(await isFavor(affair.id,'affair')){
    data.complete = true
  }
  return
}
const onComplete = () => {
  if(!data.complete){
    markFavor(affair.id,'affair')
    data.complete = true
  }else{
    unMarkFavor(affair.id)
    data.complete = false
  }
}
</script>

<template>
  <h-loading :load="onLoad">
    <div class="full flex-column">
      <div class="subtitle" style="padding: 15px 0;position: relative">
        <span>{{ affair.name }}</span>
        <div class="box-icon button-hover" style="position: absolute; top: 15px;height: 26px;right: -40px;display: inline-block" @click="goto('/affairManage/' + affair.id)">
          <i class='bx bxs-edit center'></i>
        </div>
      </div>
      <HStatistic></HStatistic>
      <div class="full" style="height: 400px">
        <FlowDia :affairId="affair.id" @nodeClicked="goAffairNode" :isEditable="false"></FlowDia>
      </div>
    </div>
    <div class="tool-bar">
      <HIconButton
          name="完成学习"
          :icon-class="data.complete? 'bxs-trophy' : 'bx-check'"
          :color="data.complete? 'var(--accent-color)' : 'var(--grey-color)'"
          :hover-color="data.complete? 'var(--accent-color-dark)' : 'var(--grey-color-dark)'"
          @click="onComplete"
          :icon-size="18"
      ></HIconButton>
    </div>
  </h-loading>
</template>

<style scoped lang="stylus">

</style>