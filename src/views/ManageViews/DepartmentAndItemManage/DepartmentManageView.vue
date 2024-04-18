<script setup lang="ts">

import HButton from "@/components/HButton.vue";
import HSearchBar from "@/components/HSearchBar.vue";
import HpageTable from "@/components/HpageTable.vue";
import {showMessage, tag} from "@/assets/api";
import axios from "@/assets/axios";
import store from "@/store";
import router from "@/router";
import HLoading from "@/components/HLoading.vue";
import {ref} from "vue";

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
    if(res.data.code==200) {
      for (let item of res.data.data.listData) {
        currentItems.push(new tag(item.id, item.departmentName))
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
const totalPages = ref(0)
const onLoad = async () => {
  await axios.get('/department/page',{
    params:{
      pageNum : 1,
      pageSize : 10
    },
    headers:{
      'token':store.state.token
    }
  }).then(res=>{
    console.log(res.data)
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
</script>

<template>
  <h-loading :load="onLoad">
  <div class="main-panel full">
    <HSearchBar style="width: 85%" searchUrl="/department/search" @onEnter="goDepartmentEdit"></HSearchBar>
    <div style="width: 85%">
      <div class="subtitle" style="text-align: left;margin-top:10px; margin-left:3px">科室列表</div>
      <HpageTable :request-items="requestDepartments" :totalPages=totalPages @itemClick="goDepartmentEdit"></HpageTable>
      <HButton height="30px" style="margin-top: 5px" @click="goDepartmentEdit('0')">添加科室</HButton>
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