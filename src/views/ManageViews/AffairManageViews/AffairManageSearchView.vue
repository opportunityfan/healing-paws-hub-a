<script setup lang="ts">
import HSearchBar from "@/components/HSearchBar.vue";
import PostFlowVertical from "@/components/PostFlowVertical.vue";
import HpageTable from "@/components/HpageTable.vue";
import {tag} from "@/assets/api";
import router from "@/router";
import axios from "@/assets/axios";
import store from "@/store";

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
    <div>
      <HpageTable :request-items="requestAffairs" totalPages="2" @itemClick="goAffairManage"></HpageTable>
    </div>
  </div>
</template>

<style scoped lang="stylus">
.main-panel
  justify-content space-evenly
.affair-bar
  width 100%
</style>
