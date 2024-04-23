<script setup lang="ts">

import HButton from "@/components/HButton.vue";
import HSearchBar from "@/components/HSearchBar.vue";
import HpageTable from "@/components/HpageTable.vue";
import {goBack, showMessage, tag} from "@/assets/api";
import axios from "@/assets/axios";
import store from "@/store";
import router from "@/router";
import HLoading from "@/components/HLoading.vue";
import {reactive, ref} from "vue";
import HATable from "@/components/HATable.vue";
import HPagination from "@/components/HPagination.vue";
import HAlert from "@/components/HAlert.vue";

const pageSize = ref(7)
const dataList = ref()
const totalPages=ref(0)
const pageNation = ref()
const data = reactive<{
  curDepartmentId : string
  alert : boolean
}>({
  alert : false,
  curDepartmentId :''
})
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
const cancel = () => {
  data.alert = false
}
const onDelete = async (departmentId : string) =>{

  data.curDepartmentId = departmentId;
  data.alert = true
}
const departmentDelete = async () =>{
  axios.delete('/department/'+data.curDepartmentId,{
    headers:{
      token : store.state.token
    }
  }).then(res=>{
    console.log(res.data)
    if(res.data.code===200){
      console.log('删除成功！')
      showMessage('删除成功!','success')
      requestDepartments(pageNation.value.data.currentPage,pageSize.value)
    }else{
      showMessage(`${res.data.msg}`,'error')
    }
  }).catch(()=>{
    showMessage('网络错误','error')
  })
  data.alert = false
}
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
          <div class="flex-row" style="width: 100%;justify-content: center">
            <HButton style="width: 25px;margin: auto 5px" height="20px" @click="goDepartmentEdit(row['id'])"><i class='bx bx-edit-alt'></i></HButton>
            <HButton style="width: 25px;margin: auto 5px" height="20px" type="danger" @click="onDelete(row['id'])"><i class='bx bx-trash'></i></HButton>
          </div>
        </template>
      </HATable>
      <HPagination @onPageChange="requestDepartments" :itemsPerPage="pageSize" :total-pages="totalPages" ref="pageNation">
      </HPagination>
      <div style="display: flex;align-items: center;justify-content: center">
        <HButton height="30px" style="margin-top: 5px;width: 50%" @click="goDepartmentEdit('0')">添加科室</HButton>
      </div>
    </div>
  </div>
  </h-loading>

  <HAlert v-model="data.alert">
    <div class="flex-column" style="gap: 10px; text-align: left">
      <div class="flex-row" style="width: 100%">
        <div class="box-icon">
          <i class='bx bx-trash'></i>
        </div>
        <div class="text-bold">删除</div>
      </div>
      <div class="text" style="padding-bottom: 20px; width: 100%">你确定删除该事务吗？</div>
      <div class="flex-row" style=" width: 100%;gap: 10px; justify-content: flex-end">
        <h-button type="secondary" height="30px" style="margin: 0; width: 60px; font-size: 12px" id="cancel" @click="cancel">取消</h-button>
        <h-button type="danger" height="30px" style="margin: 0; width: 60px; font-size: 12px" @click="departmentDelete" id="confirm">确认</h-button>
      </div>
    </div>
  </HAlert>
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