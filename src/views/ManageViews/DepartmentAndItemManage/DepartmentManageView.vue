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
import HATable from "@/components/HATable.vue";
import HPagination from "@/components/HPagination.vue";

const pageSize = ref(7)
const dataList = ref()
const totalPages=ref(0)
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
      dataList.value = res.data.data.listData
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

const onLoad = async () => {
  await axios.get('/department/page',{
    params:{
      pageNum : 1,
      pageSize : pageSize.value
    },
    headers:{
      'token':store.state.token
    }
  }).then(res=>{
    console.log('科室data',res.data)
    if(res.data.code==200) {
      dataList.value = res.data.data.listData
      totalPages.value = res.data.data.totalPages
    }else{
      showMessage(`${res.data.msg}`,'error')
    }
  }).catch(()=>{
    showMessage('网络错误','error')
  })
  return
}
const tableCols = [
  {
    title:'科室名称',
    key:'departmentName',
    scopedSlots:'Name'
  },
  {
    title:'科室简介',
    key:'introduction',
    scopedSlots: ''
  },
  {
    title:'操作',
    key:'',
    scopedSlots: 'Operation'
  }
]
</script>

<template>
  <h-loading :load="onLoad">
  <div class="main-panel full flex-column">
    <HSearchBar style="width: 85%" searchUrl="/department/search" @onEnter="goDepartmentEdit"></HSearchBar>

    <div class="page-table" >
      <div class="subtitle" style="text-align: left;margin-top:10px; margin-left:3px">事务列表</div>
      <HATable :dataList="dataList" :cols="tableCols">
        <template #Name="{data}">
              <span style="white-space: nowrap" class="text">
                {{data}}
              </span>
        </template>

        <template #Operation="{row}">
          <div class="flex-row">
            <HButton style="width: 25px;margin: auto 5px" height="20px" @click="goDepartmentEdit(row['id'])"><i class='bx bx-edit-alt'></i></HButton>
            <HButton style="width: 25px;margin: auto 5px" height="20px" type="danger"><i class='bx bx-trash'></i></HButton>
          </div>
        </template>
      </HATable>
      <HPagination @onPageChange="requestDepartments" :itemsPerPage="pageSize" :total-pages="totalPages">
      </HPagination>
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
.page-table
  flex-grow 1
  width 85%
</style>