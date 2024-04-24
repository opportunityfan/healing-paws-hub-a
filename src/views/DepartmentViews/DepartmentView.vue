<script setup lang="ts">

import {useRoute} from "vue-router";
import {computed, reactive, ref} from "vue";
import axios from "@/assets/axios";
import store from "@/store";
import {goItem, Image as Img, showMessage} from "@/assets/api";
import {string} from "three/examples/jsm/nodes/shadernode/ShaderNode";
import HLoading from "@/components/HLoading.vue";
import HImage from "@/components/HImage.vue";
import HATable from "@/components/HATable.vue";
import HButton from "@/components/HButton.vue";
import HPagination from "@/components/HPagination.vue";

const route = useRoute()

const department = reactive<{
  id : string,
  name : string,
  introduction : string,
  connect : Array<string>,
  staff : Array<{id:string,name:string,position:string,phone:string}>,
  pic : string
  image : Img
  position : {x:number,y:number}
}>({
  id : route.params.departmentId as string,
  name : '科室',
  introduction : '这是一个科室',
  connect : [],
  staff : [],
  pic : '',
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  image : new Img(require('@/assets/avatar.jpg'),1,1),
  position : {x:0,y:0}
})
const data = reactive<{
  staffPageSize : number,
  itemPageSize : number
  itemTotalPages : number
}>({
  staffPageSize : 5,
  itemPageSize : 5,
  itemTotalPages : 1
})
const getDepartmentInfo = async () => {
  console.log('检查id',department.id)
  axios.get('/department/' + department.id, {
    headers: {
      token: store.state.token
    }
  }).then(res => {
    console.log('拿department返回', res.data)
    if(res.data.code==200) {
      const temp = res.data.data
      department.name = temp.departmentName
      department.introduction = temp.introduction
      department.connect = temp.connectID
      department.staff = temp.staffList
      department.pic = temp.pic
      department.image = new Img(temp.pic, 1, 0.618)
      department.position = temp.position

      const startIndex = 0
      staffList.value = department.staff.slice(startIndex, startIndex + data.staffPageSize)

      console.log('科室人员检查1',department.staff)
      console.log('科室人员检查2',department.staff.values())
    }else{
      showMessage(`${res.data.msg}`,'error')
    }
  }).catch(()=>{
    showMessage('网络错误','error')
  })
}

const onLoad = async () => {
  console.log('是否进入department')
  await getDepartmentInfo()
  return
}
const staffTotalPages = computed(()=>{
  return Math.ceil(department.staff.length/data.staffPageSize)
})
const staffList = ref([])
const staffCols = [
  {
    title:'名称',
    key:'name',
    scopedSlots:''
  },
  {
    title:'职位',
    key:'position',
    scopedSlots: ''
  },
  {
    title:'电话',
    key:'phone',
    scopedSlots: ''
  },
  {
    title:'操作',
    key:'',
    scopedSlots: 'Operation'
  }
]
const requestStaffs = async (pageNum : number, pageSize : number) => {
  const startIndex = (pageNum-1)*pageSize
  staffList.value = department.staff.slice(startIndex, startIndex + pageSize)
}

const itemList = ref([])
const itemCols = [
  {
    title:'名称',
    key:'name',
    scopedSlots:''
  },
  {
    title:'用途',
    key:'usage',
    scopedSlots:''
  },
  {
    title:'操作',
    key:'',
    scopedSlots: 'Operation'
  }
]
const requestItems = async (pageNum : number, pageSize : number) =>{
  await axios.get('/department/getItem/'+department.id,{
    headers:{
      'token':store.state.token
    },
    params:{
      pageNum:pageNum,
      pageSize:pageSize
    }
  }).then(res=>{
    console.log('科室的物品',res.data)
    if(res.data.code==200) {
      data.itemTotalPages = res.data.data.totalPages
      itemList.value = res.data.data.listData
    }
  }).catch(()=>{
    showMessage('网络错误','error')
  })

}
</script>

<template>

  <h-loading :load="onLoad">
    <div class="full" >
      <div class="subtitle">{{department.name}}</div>
      <div class="intro-panel subtitle" >
          <div class="flex-row">
            <div style="text-align: left">
              科室介绍：
            </div>
            <div class="text-bold">
              {{department.introduction}}
            </div>
          </div>
          <div>
            <HImage :image="department.image" size="300"></HImage>
          </div>

      </div>

      <div class="main-panel">

        <div class="left-panel">
          <div class="text-bold">科室人员</div>
          <HATable :data-list="staffList" :cols="staffCols">
          </HATable>
          <HPagination @onPageChange="requestStaffs" ref="staffPage" items-per-page="5" :total-pages="staffTotalPages"></HPagination>
        </div>
        <div class="right-panel">
          <div class="text-bold">科室物品</div>
          <HATable :data-list="itemList" :cols="itemCols">
            <template #Operation="{row}">
              <div class="flex-row" style="width: 80px">
                <HButton style="width: 25px;margin: auto 5px" height="20px" @click="goItem(row['id'])"><i class='bx bx-edit-alt'></i></HButton>
              </div>
            </template>
          </HATable>
          <HPagination @onPageChange="requestItems" ref="itemPage" items-per-page="5" :total-pages="data.itemTotalPages"></HPagination>
        </div>
      </div>
    </div>
  </h-loading>
</template>

<style scoped lang="stylus">

.intro-panel
  margin 5px 20px

.main-panel
  display flex
  align-items stretch

.left-panel
  flex 1
  padding 0
  margin-left 20px
.right-panel
  flex 1
  margin 0 50px
</style>