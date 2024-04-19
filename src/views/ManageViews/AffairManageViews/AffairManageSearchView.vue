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
import HATable from "@/components/HATable.vue";
import HPagination from "@/components/HPagination.vue";
import HIconButton from "@/components/HIconButton.vue";

const dataList = ref()
const totalPages=ref(0)
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
      dataList.value = res.data.data.listData
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
    console.log(res.data.data)
    console.log('数据表内容',res.data.data.listData)
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
onLoad()
const goAffairManage = async (affairId : string) => {
  await router.push({name:'affairManagePage',params:{affairId:affairId}})
}
const tableCols = [
  {
    title:'名称',
    key:'name',
    scopedSlots:'Name'
  },
  {
    title:'年龄',
    key:'role',
    scopedSlots:''
  },
  {
    title:'操作',
    key:'',
    scopedSlots: 'Operation'
  }
]

</script>
<template>
<!--  <h-loading :load="onLoad">-->
<!--  <div class="main-panel full">-->
<!--    <HSearchBar style="width: 85%" searchUrl="/affair/fuzzy" @onEnter="goAffairManage"></HSearchBar>-->
<!--    <div style="width: 85%">-->
<!--      <div class="subtitle" style="text-align: left;margin-top:10px; margin-left:3px">事务列表</div>-->
<!--      <HpageTable :request-items="requestAffairs" :totalPages=totalPages @itemClick="goAffairManage"></HpageTable>-->
<!--      <HButton height="30px" style="margin-top: 5px" @click="goAffairManage('0')">添加事务</HButton>-->
<!--    </div>-->
<!--  </div>-->
<!--  </h-loading>-->
<div class="page-table">
  <HATable :dataList="dataList" :cols="tableCols">
    <template #Name="{data}">
      <span style="color: #9FB66B;display: inline-block;width: 50%;white-space: nowrap">
        {{data}}
      </span>
    </template>
    <template #Operation="{row}">
      <div class="flex-row">
      <HButton style="width: 25px;margin: auto 5px" height="20px" @click="goAffairManage(row['id'])"><i class='bx bx-edit-alt'></i></HButton>
      <HButton style="width: 25px;margin: auto 5px" height="20px"></HButton>
      </div>
    </template>
  </HATable>
  <HPagination @onPageChange="requestAffairs">
  </HPagination>
</div>
</template>

<style scoped lang="stylus">
.main-panel
  justify-content space-evenly
.affair-bar
  width 100%
.page-table
  width fit-content
</style>
