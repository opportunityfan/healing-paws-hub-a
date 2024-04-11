<script setup lang="ts">

import HButton from "@/components/HButton.vue";
import HSearchBar from "@/components/HSearchBar.vue";
import HpageTable from "@/components/HpageTable.vue";
import {tag} from "@/assets/api";
import axios from "@/assets/axios";
import store from "@/store";
import router from "@/router";

const goDepartmentEdit = async (id:string) =>{
  await router.push({name:'departmentEditPage',params:{id:id}})
}
const requestDepartments = async (pageNum : number, pageSize : number) =>{
  const currentItems = new Array<tag>()
  await axios.get('/department/page',{
    params:{
      pageNum : pageNum,
      pageSize : pageSize
    },
    headers:{
      'token':store.state.token
    }
  }).then(res=>{
    console.log(res.data)
    for(let item of res.data.content){
      currentItems.push(new tag(item.id,item.departmentName))
    }
  }).catch(e=>{
    console.log(e)
  })
  console.log(currentItems)
  return currentItems
}
</script>

<template>
  <div class="main-panel full">
    <HSearchBar style="width: 85%" searchUrl="/department/search" @onEnter="goDepartmentEdit"></HSearchBar>
    <div style="width: 85%">
      <div class="subtitle" style="text-align: left;margin-top:10px; margin-left:3px">事务列表</div>
      <HpageTable :request-items="requestDepartments" totalPages="2" @itemClick="goDepartmentEdit"></HpageTable>
      <HButton height="30px" style="margin-top: 5px" @click="goDepartmentEdit('0')">添加事务</HButton>
    </div>
  </div>
</template>

<style scoped lang="stylus">
.main-panel
  justify-content space-evenly
.affair-bar
  width 100%
</style>