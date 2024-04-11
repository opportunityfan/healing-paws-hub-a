<script setup lang="ts">

import HFormInput from "@/components/HFormInput.vue";
import HButton from "@/components/HButton.vue";
import HFileUpload from "@/components/HFileUpload.vue";
import HImage from "@/components/HImage.vue";
import HRadio from "@/components/HRadio.vue";
import {reactive, ref} from "vue";
import {useRoute} from "vue-router";
import {goBack, goto, Image as Img, tag} from "@/assets/api";
import HLoading from "@/components/HLoading.vue";
import axios from "@/assets/axios";
import store from "@/store";
import HpageTable from "@/components/HpageTable.vue";
const route = useRoute()
const department = reactive<{
  id : string,
  name : string,
  introduction : string,
  connect : Array<string>,
  staff : Array<{id:string,name:string,position:string,phone:string}>,
  pic : string
  image : Img
}>({
  id : route.params.id as string,
  name : '科室',
  introduction : '这是一个科室',
  connect : [],
  staff : [],
  pic : '',
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  image : new Img(require('@/assets/avatar.jpg'),1,1)
})
const data = reactive<{
  isNew : boolean

}>({
  isNew : false,

})
const staffData = reactive<{
  editOrAdd : boolean
  isStaffPanel : boolean
  id : string,
  name : string,
  position : string,
  phone : string,
  nowIndex : number
}>({
  editOrAdd : false,   //默认false表示add
  isStaffPanel : false,
  id : 'id',
  name : '名字',
  position : '职位',
  phone : '电话',
  nowIndex : 0
})
const itemData = reactive<{
  isEditPanel : boolean
  name : string
  introduction : string
  usage : string
  price : string
  departmentId : string
  type : string
}>({
  isEditPanel : false,
  name : '物品',
  introduction : '介绍',
  usage : '用处',
  price : '10',
  departmentId : department.id,
  type : 'normal'
})
const staffTable = ref()
const picFile = ref()

const isMouseOverAvatar = ref(false)
const onMouseEnterAvatar = () =>{
  isMouseOverAvatar.value = true
}
const onMouseLeaveAvatar = () => {
  isMouseOverAvatar.value = false
}
const handleImage = (image : File) =>{
  console.log('图片文件信息',image)
  let imageFile = new Image()
  imageFile.src = window.URL.createObjectURL(image)
  imageFile.onload = () => {
    department.image = new Img(imageFile.src, imageFile.width, imageFile.height)
  }
  department.pic= image.path
  picFile.value = image
}
const deleteDepartment = async () => {
  axios.delete('/department/'+department.id,{
    headers:{
      token : store.state.token
    }
  }).then(res=>{
    console.log(res.data)
    if(res.data.code===200){
      console.log('删除成功！')
      goBack()
    }
  })
}
const getDepartmentById = async () => {

  if(department.id !== '0') {
    axios.get('/department/' + department.id, {
      headers: {
        token: store.state.token
      }
    }).then(res => {
      console.log('拿department返回', res.data)
      const temp = res.data.data
      department.name = temp.departmentName
      department.introduction = temp.introduction
      department.connect = temp.connectID
      department.staff = temp.staffList
      department.pic = temp.pic
      department.image = new Img(temp.pic,1,1)
    })
  }else{
    data.isNew = true
  }
}
const onLoad = async () =>{

  await getDepartmentById()
  return
}
const requestStaffs = async (pageNum : number, pageSize : number) => {
  const currentItems = new Array<tag>()
  if(department.staff){
    department.staff.forEach(s=>{
      currentItems.push(new tag(s.id,s.name))
    })
  }
  return currentItems
}
const requestItems = async (pageNum : number, pageSize : number) =>{
  const currentItems = new Array<tag>()
  await axios.get('/item/search',{
    params: {
      pageNum: pageNum,
      pageSize: pageSize,
      name: department.name
    },
    headers:{
      'token':store.state.token
    }
  }).then(res=>{
    console.log('科室的物品',res)
    if(res.data.data) {
      for (let item of res.data.data) {
        currentItems.push(new tag(item.id, item.name))
      }
    }
  })
  return currentItems
}
function generateRandomString(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
const createDepartment = () => {
  const jsondata = {
    id : generateRandomString(8),
    departmentName : department.name,
    introduction : department.introduction,
    connectID : department.connect,
    staffList : department.staff,
  }
  const formdata = new FormData()
  formdata.append('pic',picFile.value)
  formdata.append('department',new Blob([JSON.stringify(jsondata)],{type:"application/json"}))
  axios.post('/department',formdata,{
    headers:{
      token : store.state.token,
    }
  }).then(res=>{
    console.log(res.data)
  })
}
const updateDepartment = () => {
  const jsondata = {
    id : department.id,
    departmentName : department.name,
    introduction : department.introduction,
    connectID : department.connect,
    staffList : department.staff,
  }
  const formdata = new FormData()
  formdata.append('pic',picFile.value)
  formdata.append('department',new Blob([JSON.stringify(jsondata)],{type:"application/json"}))
  axios.put('/department',formdata,{
    headers:{
      token : store.state.token,
    }
  }).then(res=>{
    console.log(res.data)
  })
}
const addPanel = () => {
  if(staffData.isStaffPanel){
    staffData.isStaffPanel = !staffData.isStaffPanel
  }else{
    staffData.editOrAdd = false
    staffData.id = 'id'
    staffData.name = '名称'
    staffData.position = '职位'
    staffData.phone = '电话'
    staffData.isStaffPanel = !staffData.isStaffPanel
  }
  return;
}
const editPanel = (index:number) => {
  staffData.nowIndex = index
  staffData.editOrAdd = true
  staffData.id = department.staff[index].id
  staffData.name = department.staff[index].name
  staffData.position = department.staff[index].position
  staffData.phone = department.staff[index].phone
  if(staffData.isStaffPanel === false){
    staffData.isStaffPanel = true
  }
}
const addStaff = () =>{
  department.staff.push({id:staffData.id,name:staffData.name,position:staffData.position,phone:staffData.phone})
  staffTable.value.update()
  staffData.isStaffPanel = false
}
const editStaff = () =>{
  console.log('修改成功')
  department.staff[staffData.nowIndex].id = staffData.id
  department.staff[staffData.nowIndex].name = staffData.name
  department.staff[staffData.nowIndex].position = staffData.position
  department.staff[staffData.nowIndex].phone = staffData.phone
  console.log('修改成功')
  staffTable.value.update()
  staffData.isStaffPanel = false
}
const itemPanel = () => {
  itemData.isEditPanel = !itemData.isEditPanel
}
const addItem = () => {
  const formdata = new FormData()
  formdata.append('item',new Blob([JSON.stringify(itemData)],{type:"application/json"}))
  axios.post('/item',formdata,{
    headers:{
      token : store.state.token
    }
  }).then(res=>{
    console.log(res.data)
  })
}
const goItemEdit = (id : string) => {
  goto('/instrument-edit/'+id)
}
</script>

<template>
  <h-loading :load="onLoad">
    <div  class="full">
      <div class="subtitle" >{{ data.isNew? '创建科室':'编辑科室' }}</div>
        <div class="main-panel">

          <div class="left-panel">
            <div class="flex-row" style="width: 100%; gap: 20px; margin: 6px 0">
              <div class="text-bold" style="flex-shrink: 0">科室名称</div>
              <HFormInput v-model="department.name" name="科室名称" style="width: 200px"></HFormInput>
            </div>
            <div class="flex-row" style="width: 100%; gap: 20px; margin: 6px 0">
              <div class="text-bold" style="flex-shrink: 0">科室说明</div>
              <HFormInput v-model="department.introduction" name="科室说明" style="width: 200px"></HFormInput>
            </div>

          </div>
          <div class="right-panel">
            <div class="flex-row" style="width: 100%; gap: 20px; margin: 6px 0">
              <div>
                <div class="text-bold" style="flex-shrink: 0">图片编辑</div>
                <div style="position: relative; width: fit-content" class="avatar-box"
                     @mouseenter="onMouseEnterAvatar"
                     @mouseleave="onMouseLeaveAvatar">
                  <HImage :image="department.image" :size="100" ></HImage>
                  <div :style="{opacity : isMouseOverAvatar ? '1' : '0'}"
                       class="center add-icon" >
                    <HFileUpload @handleFile="handleImage"></HFileUpload>
                  </div>
                </div>
              </div>
              <div style="width: 100%" >
                <HButton @click="createDepartment"  v-if="data.isNew" height="30px">创建科室</HButton>
                <HButton @click="updateDepartment"  v-if="!data.isNew" height="30px">更新科室</HButton>
                <HButton @click="deleteDepartment" type="danger" height="30px">删除科室</HButton>
              </div>
            </div>
        </div>
      </div>

      <div class="main-panel">
        <div class="left-panel">
          <div class="text-bold">科室人员</div>
          <HpageTable :request-items="requestStaffs" totalPages="1" @itemClickIndex="editPanel" ref="staffTable"></HpageTable>
          <HButton height="30px" style="margin-top: 5px" @click="addPanel">添加人员</HButton>
          <div class="staff-add-panel" v-if="staffData.isStaffPanel">
            <div class="flex-row" style="width: 100%; gap: 10px; margin: 4px 0">
              <div class="text-bold" style="flex-shrink: 0; margin-left: 6px">人员id</div>
              <HFormInput v-model="staffData.id" name="人员id" style="width: 160px"></HFormInput>
            </div>

            <div class="flex-row" style="width: 100%; gap: 10px; margin: 4px 0">
              <div class="text-bold" style="flex-shrink: 0; margin-left: 6px">名称</div>
              <HFormInput v-model="staffData.name" name="名称" style="width: 160px"></HFormInput>
            </div>
            <div class="flex-row" style="width: 100%; gap: 10px; margin: 4px 0">
              <div class="text-bold" style="flex-shrink: 0; margin-left: 6px">职位</div>
              <HFormInput v-model="staffData.position" name="职位" style="width: 160px"></HFormInput>
            </div>
            <div class="flex-row" style="width: 100%; gap: 10px; margin: 4px 0">
              <div class="text-bold" style="flex-shrink: 0; margin-left: 6px">手机号</div>
              <HFormInput v-model="staffData.phone" name="手机号" style="width: 160px"></HFormInput>
            </div>
            <div class="staff-button-block">
              <HButton v-if="!staffData.editOrAdd" height="20px" @click="addStaff" class="staff-button">确认添加</HButton>
              <HButton v-if="staffData.editOrAdd" height="20px" @click="editStaff"  class="staff-button">确认修改</HButton>
            </div>
          </div>
        </div>
        <div  class="right-panel">
          <div class="text-bold">科室物品</div>
          <HpageTable :request-items="requestItems" totalPages="1" @itemClick="goItemEdit" ></HpageTable>
          <HButton height="30px" style="margin-top: 5px" @click="itemPanel">添加物品</HButton>

          <div class="item-add-panel" v-if="itemData.isEditPanel">
            <div class="flex-row" style="width: 100%; gap: 10px; margin: 4px 0">
              <div class="text-bold" style="flex-shrink: 0; margin-left: 6px">名称</div>
              <HFormInput v-model="itemData.name" name="名称" style="width: 160px"></HFormInput>
            </div>
            <div class="flex-row" style="width: 100%; gap: 10px; margin: 4px 0">
              <div class="text-bold" style="flex-shrink: 0; margin-left: 6px">说明</div>
              <HFormInput v-model="itemData.introduction" name="说明" style="width: 160px"></HFormInput>
            </div>
            <HButton height="30px" @click="addItem" class="staff-button">确认添加</HButton>
          </div>

        </div>
      </div>

    </div>
  </h-loading>
</template>

<style scoped lang="stylus">

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
.staff-add-panel
  border 1px solid var(--theme-color)
  border-radius 16px

.staff-button-block
  display: flex;
  justify-content: center;
.staff-button
  width 50%
  margin 6px

.item-add-panel
  border 1px solid var(--theme-color)
  border-radius 16px
</style>