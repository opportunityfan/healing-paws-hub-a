<script setup lang="ts">
import {useRoute} from "vue-router";
import FlowDia from "@/components/FlowDia.vue";
import {goAffairNodeManage, goBack, Image} from "@/assets/api";
import {onBeforeUnmount, onMounted, reactive, ref} from "vue";

import HFormInput from "@/components/HFormInput.vue";
import HFileUpload from "@/components/HFileUpload.vue";
import HAvatar from "@/components/HAvatar.vue";
import axios from "@/assets/axios";
import store from "@/store";
import HLoading from "@/components/HLoading.vue";
import HRadio from "@/components/HRadio.vue";
import HImage from "@/components/HImage.vue";
import HButton from "@/components/HButton.vue";
const route = useRoute()

const roles = ref([{
  label: '前台',
  value: 'receptionist'
},{
  label: '医助',
  value: 'assistantDoctor'
},{
  label: '医师',
  value: 'doctor'
}])

const isMouseOverAvatar = ref(false)
const data= reactive<{
  show : boolean
  tooltipX : number
  tooltipY : number
  content : string
  isNewAffair : boolean
}>({
  show : false,
  tooltipX : 0,
  tooltipY : 0,
  content : '测试',
  isNewAffair : false
})

const affair = reactive<{
  id : string
  name : string
  description : string
  pic : string
  picSize : Array<number>
  role : string
  image : Image
}>({
  id : route.params.affairId as string,
  name : '事务',
  description:'这是一个事务',
  role:'doctor',
  pic:'',
  picSize:[],
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  image: new Image(require('@/assets/avatar.jpg'),1,1)
})
const picFile = ref()

const onMouseEnterAvatar = () =>{
  isMouseOverAvatar.value = true
}
const onMouseLeaveAvatar = () => {
  isMouseOverAvatar.value = false
}
const getAffairById = async () => {
  axios.get('/affair/'+affair.id,{
    headers:{
      token : store.state.token
    }
  }).then(res=>{
    console.log('拿affair返回',res.data)
    affair.name = res.data.data.name
    affair.description = res.data.data.description
    affair.pic = res.data.data.pic
    affair.picSize = res.data.data.picSize
    affair.role = res.data.data.role
    affair.image = new Image(affair.pic,1,1)
  })
}

const onLoad = async () =>{
  console.log('事务id',affair.id)
  if(affair.id === '0'){
    data.isNewAffair = true
  }else{
    await getAffairById()
  }
  return
}
const handleImage = (image : File) =>{
  console.log('图片文件信息',image)
  affair.pic= image.path
  console.log('新图片路径',affair.pic)
  affair.image = new Image(affair.pic,1,1)
  picFile.value = image
}
const onUpdate = async (formdata : FormData) => {
  formdata.append('name',affair.name)
  formdata.append('description',affair.description)
  formdata.append('role',affair.role)
  if(data.isNewAffair){//创建
    formdata.append('pic',picFile.value)
    axios.post('/affair',formdata,{
      headers:{
        token:store.state.token
      }
    }).then(res=>{
      console.log(res.data)
    })
  }
  else {
    if(picFile.value){
      formdata.append('pic',picFile.value)
    }
    axios.put('/affair', formdata, {
      headers: {
        token: store.state.token
      }
    }).then(res => {
      console.log('保存、更新的返回结果', res.data)
    })
  }
}
const deleteAffair = () => {
  axios.delete('/affair',{
    headers:{
      token : store.state.token
    },
    params:{
      id : affair.id
    }
  }).then(res=>{
    console.log(res.data)
    if(res.data.code===200){
      console.log('删除成功！')
      goBack()
    }
  })
}
</script>

<template>
  <h-loading :load="onLoad">
    <div class="full" >
      <div class="main-panel">
        <div class="subtitle" v-if="data.isNewAffair">创建事务</div>
        <div class="left-panel">
          <div class="flex-row" style="width: 100%; gap: 20px; margin: 6px 0">
            <div class="text-bold" style="flex-shrink: 0">事务名称</div>
            <HFormInput v-model="affair.name" name="事务名称" style="width: 200px"></HFormInput>
          </div>
          <div class="flex-row" style="width: 100%; gap: 20px; margin: 6px 0">
            <div class="text-bold" style="flex-shrink: 0">事务描述</div>
            <HFormInput v-model="affair.description" name="事务描述" style="width: 200px"></HFormInput>
          </div>
          <div class="flex-row" style="width: 100%; gap: 20px; margin: 6px 0">
            <div class="text-bold" style="flex-shrink: 0">相关角色</div>
            <HRadio :options="roles" v-model:value="affair.role"  style="flex-shrink: 0"></HRadio>
          </div>
        </div>
        <div class="right-panel">
          <div class="flex-row" style="width: 100%; gap: 20px; margin: 6px 0">
            <div class="text-bold" style="flex-shrink: 0">封面编辑</div>
            <div style="position: relative; width: fit-content" class="avatar-box"
                 @mouseenter="onMouseEnterAvatar"
                 @mouseleave="onMouseLeaveAvatar">
              <HImage :image="affair.image" :size="100" ></HImage>
              <div :style="{opacity : isMouseOverAvatar ? '1' : '0'}"
                   class="center add-icon" >
                <HFileUpload @handleFile="handleImage"></HFileUpload>
              </div>
            </div>
            <HButton @click="deleteAffair" type="danger">删除事务</HButton>
          </div>

        </div>
      </div>
      <div class="flow-dia">
        <FlowDia :affair-id="affair.id" @nodeDoubleClicked="goAffairNodeManage" @onSave="onUpdate"></FlowDia>
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

.flow-dia
  width 100%
  height 50%
</style>