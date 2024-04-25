<script setup lang="ts">
import HSearchBar from "@/components/HSearchBar.vue";

import {goAffair, goBack, showMessage, tag} from "@/assets/api";
import router from "@/router";
import axios from "@/assets/axios";
import store from "@/store";
import HButton from "@/components/HButton.vue";
import {computed, onMounted, onUnmounted, reactive, ref, VueElement, watch} from "vue";
import HLoading from "@/components/HLoading.vue";
import HATable from "@/components/HATable.vue";
import HPagination from "@/components/HPagination.vue";
import HAlert from "@/components/HAlert.vue";


const dataList = ref([])
const totalPages=ref(0)
const pageSize = ref(8)
const totalItems = ref(0)

const pageNation = ref()

const topDiv = ref()
const data = reactive<{
  curAffairId : string
  alert : boolean
}>({
  alert : false,
  curAffairId :''
})
let pageSizeCalc : any = null
onMounted(()=>{
  //const rect = bottomDiv.value.getBoundingClientRect()
  calcPageSize()
  pageSizeCalc = setInterval(()=>{
    calcPageSize()
  },1000)
  //console.log(rect)
})
onUnmounted(()=>{
  clearInterval(pageSizeCalc)
  pageSizeCalc = null
})
const calcPageSize = () => {
  const rect = topDiv.value.getBoundingClientRect()
  console.log('检查rect',rect)

  const bottomGap = rect.bottom

  const gap = document.documentElement.clientHeight - bottomGap
  console.log('检查距离',gap)
  pageSize.value = Math.ceil((gap-100)/45)

  console.log('检查pageSize',pageSize.value)
}
watch(
    ()=>pageSize.value,
    (val,preval)=>{
      requestAffairs(pageNation.value.data.currentPage,pageSize.value)
    }
)
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
      totalPages.value = res.data.data.totalPages
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
const affairDelete = () => {

  axios.delete('/affair',{
    headers:{
      token : store.state.token
    },
    params:{
      id : data.curAffairId
    }
  }).then(res=>{
    console.log(res.data)
    if (res.data.code === 200) {
      showMessage('删除成功!','success')
      requestAffairs(pageNation.value.data.currentPage,pageSize.value)
    }else{
      showMessage(`${res.data.msg}`,'error')
    }
  }).catch(()=>{
    showMessage('网络错误','error')
  })
  data.alert = false

}
const onDelete = async (affairId : string) =>{
  console.log(affairId)
  data.curAffairId = affairId;
  data.alert = true
}
const cancel = () => {
  data.alert = false
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
const text = ref('')

</script>
<template>
  <h-loading :load="onLoad">
    <div class="main-panel full flex-column" >
      <HSearchBar style="width: 80%" searchUrl="/affair/fuzzy" @onEnter="goAffairManage"></HSearchBar>
      <div class="page-table" >
        <div class="subtitle" style=" text-align: left;margin-top:10px; margin-left:3px" ref="topDiv">职能学习列表</div>
        <div style="min-height: 0">
          <HATable :dataList="dataList" :cols="tableCols" >
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
              <div class="flex-row" style="width: 100%;justify-content: center;align-items: center">
              <HButton style="width: 25px;margin: auto 5px" height="20px" @click="goAffairManage(row['id'])"><i class='bx bx-edit-alt'></i></HButton>
              <HButton style="width: 25px;margin: auto 5px" height="20px" type="danger" @click="onDelete(row['id'])"><i class='bx bx-trash'></i></HButton>
              </div>
            </template>
            <template #empty>
              <i class='bx bx-file-blank' style="font-size: 36px;padding:20px" ></i>
              <div class="text-bold" style="padding-bottom: 20px">
                暂时没有事务哦
              </div>
            </template>
          </HATable>
          <HPagination @onPageChange="requestAffairs" :itemsPerPage="pageSize" :total-pages="totalPages" ref="pageNation">
          </HPagination>
        </div>
        <div style="display: flex;align-items: center;justify-content: center" >
          <HButton height="30px" style="margin-top: 5px;width: 50%" @click="goAffairManage('0')">添加事务</HButton>
        </div>
      </div>

    </div>

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
          <h-button type="danger" height="30px" style="margin: 0; width: 60px; font-size: 12px" @click="affairDelete" id="confirm">删除</h-button>
        </div>
      </div>
    </HAlert>
  </h-loading>


</template>

<style scoped lang="stylus">
.main-panel
  justify-content space-evenly
.affair-bar
  width 100%
.page-table
  flex-grow 1
  width 80%
</style>
