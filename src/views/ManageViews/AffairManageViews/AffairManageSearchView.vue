<script setup lang="ts">
import HSearchBar from "@/components/HSearchBar.vue";
import PostFlowVertical from "@/components/PostFlowVertical.vue";
import HpageTable from "@/components/HpageTable.vue";
import {showMessage, tag} from "@/assets/api";
import router from "@/router";
import axios from "@/assets/axios";
import store from "@/store";
import HButton from "@/components/HButton.vue";
import {ref} from "vue";
import HLoading from "@/components/HLoading.vue";

const requestAffairs = async (pageNum : number, pageSize : number) => {
  const currentItems = new Array<tag>()
  await axios.get('/affair',{
    params:{
      pageNum : pageNum,
      pageSize : pageSize
    },
    headers:{
      'token':store.state.token
    }
  }).then(res=>{
    if(res.data.code==200) {
      for (let item of res.data.data.listData) {
        currentItems.push(new tag(item.id, item.name))
      }
    }else{
      showMessage(`${res.data.msg}`,'error')
    }
  }).catch(()=>{
    showMessage('网络错误','error')
  })
  console.log(currentItems)
  return currentItems
}
const totalPages=ref(0)
const onLoad = async () => {
  await axios.get('/affair',{
    params:{
      pageNum : 1,
      pageSize : 10
    },
    headers:{
      'token':store.state.token
    }
  }).then(res=>{
    if(res.data.code==200) {
      totalPages.value = res.data.data.totalPages
    }else{
      showMessage(`${res.data.msg}`,'error')
    }
  }).catch(()=>{
    showMessage('网络错误','error')
  })
  return
}

const goAffairManage = async (affairId : string) => {
  await router.push({name:'affairManagePage',params:{affairId:affairId}})
}
</script>
<template>
  <h-loading :load="onLoad">
  <div class="main-panel full">
    <HSearchBar style="width: 85%" searchUrl="/affair/fuzzy" @onEnter="goAffairManage"></HSearchBar>
    <div style="width: 85%">
      <div class="subtitle" style="text-align: left;margin-top:10px; margin-left:3px">事务列表</div>
      <HpageTable :request-items="requestAffairs" :totalPages=totalPages @itemClick="goAffairManage"></HpageTable>
      <HButton height="30px" style="margin-top: 5px" @click="goAffairManage('0')">添加事务</HButton>
    </div>
  </div>
  </h-loading>
</template>

<style scoped lang="stylus">
.main-panel
  justify-content space-evenly
.affair-bar
  width 100%
</style>
