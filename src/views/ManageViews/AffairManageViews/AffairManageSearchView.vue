<script setup lang="ts">
import HSearchBar from "@/components/HSearchBar.vue";
import PostFlowVertical from "@/components/PostFlowVertical.vue";
import HpageTable from "@/components/HpageTable.vue";
import {goAffair, showMessage, tag} from "@/assets/api";
import router from "@/router";
import axios from "@/assets/axios";
import store from "@/store";
import HButton from "@/components/HButton.vue";
import {computed, onMounted, onUnmounted, ref, VueElement, watch} from "vue";
import HLoading from "@/components/HLoading.vue";
import HATable from "@/components/HATable.vue";
import HPagination from "@/components/HPagination.vue";
import HIconButton from "@/components/HIconButton.vue";

const dataList = ref()
const totalPages=ref(0)
const pageSize = ref(7)
const totalItems = ref(0)




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
      pageSize : pageSize.value
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
      totalItems.value = pageSize.value*totalPages.value
      console.log('总数：',totalItems.value)
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
const tableCols = [
  {
    title:'名称',
    key:'name',
    scopedSlots:'Name'
  },
  {
    title:'角色',
    key:'role',
    scopedSlots:'Role'
  },
  {
    title:'操作',
    key:'',
    scopedSlots: 'Operation'
  }
]
const roleToChinese = (role : string) => {
  if(role === 'doctor'){
    return '医师'
  }else if(role === 'assistantDoctor'){
    return '医助'
  }else if(role === 'receptionist'){
    return '前台'
  }
}
</script>
<template>
  <h-loading :load="onLoad">
    <div class="main-panel full flex-column" >
      <HSearchBar style="width: 85%" searchUrl="/affair/fuzzy" @onEnter="goAffairManage"></HSearchBar>
      <div class="page-table" >
        <div class="subtitle" style="text-align: left;margin-top:10px; margin-left:3px">事务列表</div>
          <HATable :dataList="dataList" :cols="tableCols">
            <template #Name="{data}">
              <span style="white-space: nowrap" class="text">
                {{data}}
              </span>
            </template>
            <template #Role="{data}">
              <span style="white-space: nowrap" class="text">
                {{roleToChinese(data)}}
              </span>
            </template>
            <template #Operation="{row}">
              <div class="flex-row">
              <HButton style="width: 25px;margin: auto 5px" height="20px" @click="goAffairManage(row['id'])"><i class='bx bx-edit-alt'></i></HButton>
              <HButton style="width: 25px;margin: auto 5px" height="20px" type="danger"><i class='bx bx-trash'></i></HButton>
              </div>
            </template>
          </HATable>
          <HPagination @onPageChange="requestAffairs" :itemsPerPage="pageSize" :total-pages="totalPages">
          </HPagination>
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
.page-table
  flex-grow 1
  width 85%
</style>
