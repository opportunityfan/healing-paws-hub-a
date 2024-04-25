<script setup lang="ts">

import HFormInput from "@/components/HFormInput.vue";
import HButton from "@/components/HButton.vue";
import {computed, reactive, ref} from "vue";
import {useRoute} from "vue-router";
import {goBack, goto, Image as Img, showMessage, tag} from "@/assets/api";
import HLoading from "@/components/HLoading.vue";
import axios from "@/assets/axios";
import store from "@/store";

import HImageUpload from "@/components/HImageUpload.vue";
import HATable from "@/components/HATable.vue";
import HPagination from "@/components/HPagination.vue";
import HAlert from "@/components/HAlert.vue";
import HDivider from "@/components/HDivider.vue";
import PositionEditor from "@/components/PositionEditor.vue";
const route = useRoute()
const imageUpload = ref()
const staffPage = ref()
const itemPage = ref()
const department = reactive<{
  id : string,
  name : string,
  introduction : string,
  connect : Array<string>,
  staff : Array<{id:string,name:string,position:string,phone:string}>,
  pic : string
  image : Img
  position : {
    x : number,
    y : number,
    z : number
  }
}>({
  id : route.params.id as string,
  name : '科室',
  introduction : '这是一个科室',
  connect : [],
  staff : [],
  pic : '',
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  image : new Img(require('@/assets/avatar.jpg'),1,1),
  position : {
    x : 0,
    y : 0,
    z : 0
  }
})
const data = reactive<{
  isNew : boolean
  staffDeleteAlert : boolean
  staffEditAlert : boolean
  itemDeleteAlert : boolean
  itemAddAlert : boolean
  positionEditAlert : boolean
  curStaffIndex : number
  curItemId : string
}>({
  isNew : false,
  staffDeleteAlert : false,
  staffEditAlert : false,
  itemDeleteAlert : false,
  positionEditAlert : false,
  curStaffIndex : -1,
  curItemId : '',
  itemAddAlert : false,
})
const staffData = reactive<{
  editOrAdd : boolean

  id : string,
  name : string,
  position : string,
  phone : string,
  nowIndex : number
}>({
  editOrAdd : false,   //默认false表示edit,true表示add

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
const getDepartmentById = async () => {

  if(department.id !== '0') {
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
        department.image = new Img(temp.pic, 1, 1)

        const startIndex = 0
        staffList.value = department.staff.slice(startIndex, startIndex + 5)

        console.log('科室人员检查1',department.staff)
        console.log('科室人员检查2',department.staff.values())
      }else{
        showMessage(`${res.data.msg}`,'error')
      }
    }).catch(()=>{
      showMessage('网络错误','error')
    })
  }else{
    data.isNew = true
  }
}
const onLoad = async () =>{

  await getDepartmentById()
  await requestItems(1,5)
  return
}
const requestStaffs = async (pageNum : number, pageSize : number) => {
  const startIndex = (pageNum-1)*pageSize
  staffList.value = department.staff.slice(startIndex, startIndex + pageSize)
}
//有问题
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
      itemTotalPages.value = res.data.data.totalPages
      itemList.value = res.data.data.listData
    }
  }).catch(()=>{
    showMessage('网络错误','error')
  })

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
  formdata.append('pic',imageUpload.value.getPicFile())
  formdata.append('department',new Blob([JSON.stringify(jsondata)],{type:"application/json"}))
  axios.post('/department',formdata,{
    headers:{
      token : store.state.token,
    }
  }).then(res=>{
    console.log(res.data)
    if(res.data.code==200){
      showMessage('创建成功!','success')
    }else{
      showMessage(`${res.data.msg}`,'error')
    }
  }).catch(()=>{
    showMessage('网络错误','error')
  })
}
const updateDepartment = () => {
  console.log('检查更新前的staffList',department.staff)
  const jsondata = {
    id : department.id,
    departmentName : department.name,
    introduction : department.introduction,
    connectID : department.connect,
    staffList : department.staff,
  }
  const formdata = new FormData()
  console.log('检查图片文件',imageUpload.value.getPicFile())
  console.log('检查Image',department.image)

    formdata.append('pic', imageUpload.value.getPicFile())

  formdata.append('department',new Blob([JSON.stringify(jsondata)],{type:"application/json"}))
  axios.put('/department',formdata,{
    headers:{
      token : store.state.token,
    }
  }).then(res=>{
    console.log(res.data)
    if(res.data.code==200){
      showMessage('更新成功!','success')
    }else{
      showMessage(`${res.data.msg}`,'error')
    }
  }).catch(()=>{
    showMessage('网络错误','error')
  })
}
const addPanel = () => {
    staffData.editOrAdd = true
    staffData.id = generateRandomString(8)
    staffData.name = '名称'
    staffData.position = '职位'
    staffData.phone = '电话'
    data.staffEditAlert = true
}

const onItemAdd = () => {
  data.itemAddAlert = true
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
    if(res.data.code==200){
      showMessage('更新成功!','success')
      requestItems(itemPage.value.data.currentPage,5)
    }else{
      showMessage(`${res.data.msg}`,'error')
    }

  }).catch(()=>{
    showMessage('网络错误','error')
  })
  data.itemAddAlert = false
}
const goItemEdit = (id : string) => {
  goto('/instrument-edit/'+id)
}

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
const staffTotalPages = computed(()=>{
  return Math.ceil(department.staff.length/5)
})
const itemTotalPages = ref()
const onDeleteStaff = (index : number) => {
  console.log('删除staff',index)
  data.curStaffIndex = index
  data.staffDeleteAlert = true
}
const onStaffEdit = (index : number) => {
  console.log('Edit Staff',index)
  data.curStaffIndex = index
  staffData.editOrAdd = false
  staffData.id = department.staff[index].id
  staffData.name = department.staff[index].name
  staffData.position = department.staff[index].position
  staffData.phone = department.staff[index].phone
  data.staffEditAlert = true
}
const staffDelete = (index : number) => {

  console.log('删除staff',index)
  department.staff.splice(index,1)
  if(staffPage.value.data.currentPage>staffTotalPages.value){
    staffPage.value.data.currentPage--
  }
  requestStaffs(staffPage.value.data.currentPage,5)
  console.log(department.staff)
  showMessage('人员信息删除成功！', 'info')
  data.staffDeleteAlert = false
}
const staffEdit = (index : number) =>{

  if(staffData.editOrAdd == false) {
    console.log('修改人员', index)
    department.staff[index].name = staffData.name
    department.staff[index].position = staffData.position
    department.staff[index].phone = staffData.phone
    requestStaffs(staffPage.value.data.currentPage,5)
    showMessage('人员信息修改成功', 'info')
  }else{
    console.log('添加人员')
    department.staff.push({id:staffData.id,name:staffData.name,position:staffData.position,phone:staffData.phone})

    console.log('检查staffPage',staffPage.value)
    console.log('检查当前页码',staffPage.value.data.currentPage)
    requestStaffs(staffPage.value.data.currentPage,5)
    showMessage('添加人员成功', 'info')
  }
  data.staffEditAlert = false
  return
}

const onDeleteItem = (id : string) => {
  data.curItemId = id
  data.itemDeleteAlert = true

}
const itemDelete = (id : string)=>{
  axios.delete('/item/'+id,{
    headers:{
      token:store.state.token
    }
  }).then(res=>{
    if(res.data.code ==200){
      showMessage('删除成功！','info')

      if(itemList.value.length==1&&itemPage.value.data.currentPage>1) {
        itemPage.value.data.currentPage--
      }
      requestItems(itemPage.value.data.currentPage,5)


    }
  })
  data.itemDeleteAlert = false
}
</script>

<template>
  <h-loading :load="onLoad">
    <div  class="full">
      <div class="flex-row" style="margin: 0px 20px;width: 90%;flex-wrap: nowrap;gap:20px" >
        <div class="title" style="text-align: left">
          {{ data.isNew? '创建科室':'编辑科室' }}
        </div>

      </div>
      <HDivider style="width: 90%;margin: 0 20px"></HDivider>
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
                <HImageUpload :image="department.image" ref="imageUpload"></HImageUpload>
              </div>

            </div>
        </div>
          <div>
            <div @click="data.positionEditAlert = true">编辑位置</div>
          </div>
      </div>

      <div class="main-panel">
        <div class="left-panel">
          <div class="text-bold">科室人员</div>
          <HATable :data-list="staffList" :cols="staffCols">
            <template #Operation="{rowIndex}">
              <div class="flex-row" style="width: 80px">
                <HButton style="width: 25px;margin: auto 5px" height="20px" @click="onStaffEdit(rowIndex)"><i class='bx bx-edit-alt'></i></HButton>
                <HButton style="width: 25px;margin: auto 5px" height="20px" type="danger" @click="onDeleteStaff(rowIndex)"><i class='bx bx-trash'></i></HButton>
              </div>
            </template>
            <template #empty>
              <i class='bx bx-file-blank' style="font-size: 36px;padding:20px" ></i>
              <div class="text-bold" style="padding-bottom: 20px">
                该科室暂无人员哦
              </div>
            </template>
          </HATable>
          <HPagination @onPageChange="requestStaffs" ref="staffPage" items-per-page="5" :total-pages="staffTotalPages" v-if="staffList.length>0"></HPagination>
          <div style="display: flex;align-items: center;justify-content: center" >
            <HButton height="30px" style="margin-top: 5px;width: 35%" @click="addPanel">添加人员</HButton>
          </div>
        </div>
        <div  class="right-panel">
          <div class="text-bold">科室物品</div>
          <HATable :data-list="itemList" :cols="itemCols">
            <template #Operation="{row}">
              <div class="flex-row" style="width: 80px">
                <HButton style="width: 25px;margin: auto 5px" height="20px" @click="goItemEdit(row['id'])"><i class='bx bx-edit-alt'></i></HButton>
                <HButton style="width: 25px;margin: auto 5px" height="20px" type="danger" @click="onDeleteItem(row['id'])"><i class='bx bx-trash'></i></HButton>
              </div>
            </template>
            <template #empty>
              <i class='bx bx-file-blank' style="font-size: 36px;padding:20px" ></i>
              <div class="text-bold" style="padding-bottom: 20px">
                该科室暂无物品哦
              </div>
            </template>
          </HATable>
          <HPagination @onPageChange="requestItems" ref="itemPage" items-per-page="5" :total-pages="itemTotalPages" v-if="itemList.length>0"></HPagination>
          <div style="display: flex;align-items: center;justify-content: center" >
            <HButton height="30px" style="margin-top: 5px;width: 35%" @click="onItemAdd">添加物品</HButton>
          </div>
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

      <div class="bottom-div">
        <HButton @click="createDepartment"  v-if="data.isNew" style="width: 80px" height="40px" >创建</HButton>
        <HButton @click="updateDepartment"  v-if="!data.isNew" style="width: 80px" height="40px">保存</HButton>
      </div>
    </div>
  </h-loading>
<!--  人员删除确认板-->
  <HAlert v-model="data.staffDeleteAlert">
    <div class="flex-column" style="gap: 10px; text-align: left">
      <div class="flex-row" style="width: 100%">
        <div class="box-icon">
          <i class='bx bx-trash'></i>
        </div>
        <div class="text-bold">删除</div>
      </div>
      <div class="text" style="padding-bottom: 20px; width: 100%">你确定删除该事务吗？</div>
      <div class="flex-row" style=" width: 100%;gap: 10px; justify-content: flex-end">
        <h-button type="secondary" height="30px" style="margin: 0; width: 60px; font-size: 12px" id="cancel" @click="data.staffDeleteAlert=false">取消</h-button>
        <h-button type="danger" height="30px" style="margin: 0; width: 60px; font-size: 12px" @click="staffDelete(data.curStaffIndex)" id="confirm">删除</h-button>
      </div>
    </div>
  </HAlert>
<!--人员编辑板-->
  <HAlert v-model="data.staffEditAlert">
    <div class="flex-column" style="gap: 10px; text-align: left">
      <div class="flex-row" style="width: 100%">
        <div class="box-icon">
          <i class='bx bx-edit-alt'></i>
        </div>
        <div class="text-bold">人员编辑</div>
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

      <div class="flex-row" style=" width: 100%;gap: 10px; justify-content: flex-end">
        <h-button type="secondary" height="30px" style="margin: 0; width: 60px; font-size: 12px" id="cancel" @click="data.staffEditAlert=false">取消</h-button>
        <h-button  v-if="!staffData.editOrAdd" height="30px" style="margin: 0; width: 60px; font-size: 12px" @click="staffEdit(data.curStaffIndex)" id="confirm">修改</h-button>
        <h-button  v-if="staffData.editOrAdd" height="30px" style="margin: 0; width: 60px; font-size: 12px" @click="staffEdit(data.curStaffIndex)" id="confirm">添加</h-button>
      </div>
    </div>
  </HAlert>
<!--item删除确认板-->
  <HAlert v-model="data.itemDeleteAlert">
    <div class="flex-column" style="gap: 10px; text-align: left">
      <div class="flex-row" style="width: 100%">
        <div class="box-icon">
          <i class='bx bx-trash'></i>
        </div>
        <div class="text-bold">删除</div>
      </div>
      <div class="text" style="padding-bottom: 20px; width: 100%">你确定删除该物品吗？(不可回退)</div>
      <div class="flex-row" style=" width: 100%;gap: 10px; justify-content: flex-end">
        <h-button type="secondary" height="30px" style="margin: 0; width: 60px; font-size: 12px" id="cancel" @click="data.itemDeleteAlert=false">取消</h-button>
        <h-button type="danger" height="30px" style="margin: 0; width: 60px; font-size: 12px" @click="itemDelete(data.curItemId)" id="confirm">删除</h-button>
      </div>
    </div>
  </HAlert>
<!--item添加板-->
  <HAlert v-model="data.itemAddAlert">
    <div class="flex-column" style="gap: 10px; text-align: left">
      <div class="flex-row" style="width: 100%">
        <div class="box-icon">
          <i class='bx bx-edit-alt'></i>
        </div>
        <div class="text-bold">物品添加</div>
      </div>
      <div class="flex-row" style="width: 100%; gap: 10px; margin: 4px 0">
        <div class="text-bold" style="flex-shrink: 0; margin-left: 6px">名称</div>
        <HFormInput v-model="itemData.name" name="名称" style="width: 160px"></HFormInput>
      </div>
      <div class="flex-row" style="width: 100%; gap: 10px; margin: 4px 0">
        <div class="text-bold" style="flex-shrink: 0; margin-left: 6px">说明</div>
        <HFormInput v-model="itemData.introduction" name="说明" style="width: 160px"></HFormInput>
      </div>

      <div class="flex-row" style=" width: 100%;gap: 10px; justify-content: flex-end">
        <h-button type="secondary" height="30px" style="margin: 0; width: 60px; font-size: 12px" id="cancel" @click="data.itemAddAlert=false">取消</h-button>
        <h-button   height="30px" style="margin: 0; width: 60px; font-size: 12px" @click="addItem" id="confirm">添加</h-button>
      </div>
    </div>
  </HAlert>
  <HAlert v-model="data.positionEditAlert">
    <div style="width: 700px; height: 500px">
      <PositionEditor :id="department.id" v-model="department.position"></PositionEditor>
    </div>
  </HAlert>
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

.bottom-div
  position absolute
  bottom 0
  right 0
  margin-right 20px
</style>
