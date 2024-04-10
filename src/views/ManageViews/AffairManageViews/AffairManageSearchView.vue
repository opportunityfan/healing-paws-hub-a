<script setup lang="ts">
import HSearchBar from "@/components/HSearchBar.vue";
import PostFlowVertical from "@/components/PostFlowVertical.vue";
import HpageTable from "@/components/HpageTable.vue";
import {tag} from "@/assets/api";
import router from "@/router";
import axios from "@/assets/axios";
import store from "@/store";
import HButton from "@/components/HButton.vue";

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
    for(let item of res.data.data){
      currentItems.push(new tag(item.id,item.name))
    }
  }).catch(e=>{
    console.log(e)
  })
  console.log(currentItems)
  return currentItems
}

const goAffairManage = async (affairId : string) => {
  await router.push({name:'affairManagePage',params:{affairId:affairId}})
}
</script>
<template>

  <div class="main-panel full">
    <HSearchBar style="width: 85%" searchUrl="/affair/fuzzy" @onEnter="goAffairManage"></HSearchBar>
    <div style="width: 85%">
      <div class="subtitle" style="text-align: left;margin-top:10px; margin-left:3px">事务列表</div>
      <HpageTable :request-items="requestAffairs" totalPages="2" @itemClick="goAffairManage"></HpageTable>
      <HButton height="30px" style="margin-top: 5px" @click="goAffairManage('0')">添加事务</HButton>
    </div>
  </div>
</template>

<style scoped lang="stylus">
.main-panel
  justify-content space-evenly
.affair-bar
  width 100%
</style>
