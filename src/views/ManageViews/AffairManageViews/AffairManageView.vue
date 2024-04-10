<script setup lang="ts">
import {useRoute} from "vue-router";
import FlowDia from "@/components/FlowDia.vue";
import {affairNode, getAffairNodes} from "@/assets/api";
import {onBeforeUnmount, onMounted, reactive} from "vue";
import HToolTip from "@/components/HToolTip.vue";
const route = useRoute()
const affairId = route.params.affairId as string

const nodes = Array<affairNode>()

const goAffairNodeManage = () => {
  console.log('goaffairnodemanage')
}
const data= reactive<{
  show : boolean
  tooltipX : number
  tooltipY : number
  content : string
}>({
  show : false,
  tooltipX : 0,
  tooltipY : 0,
  content : '测试'
})
const showToolTip = (e) =>{

  data.tooltipX = e.clientX
  data.tooltipY = e.clientY
  data.show = true
  console.log(e.clientX)
  console.log(e.clientY)
}
const hideToolTip = () =>{
  data.show = false
}
onMounted(()=>{
  window.addEventListener('click',hideToolTip)
})
onBeforeUnmount(()=>{
  window.removeEventListener('click',hideToolTip)
})
</script>

<template>

  <div class="full" @contextmenu.prevent="showToolTip">
    <div >事务{{affairId}}详情</div>
    <div class="full">
      <FlowDia :affair-id="affairId" @nodeClicked="goAffairNodeManage"></FlowDia>
    </div>
    <HToolTip v-if="data.show" :x="data.tooltipX" :y="data.tooltipY" :content="data.content" />
  </div>
</template>

<style scoped lang="stylus">

</style>