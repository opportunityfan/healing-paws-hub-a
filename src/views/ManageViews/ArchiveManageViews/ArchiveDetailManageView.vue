<script setup lang="ts">

import {reactive, ref} from "vue";
import {useRoute} from "vue-router";
import axios from "@/assets/axios";
import store from "@/store";
import HScroller from "@/components/HScroller.vue";
import HImage from "@/components/HImage.vue";
import HInput from "@/components/HInput.vue";
import HButton from "@/components/HButton.vue";
import HFileUpload from "@/components/HFileUpload.vue";
import {goBack, Image as Img} from "@/assets/api";

let archiveDetailInfo = reactive({
  id: "",
  name: "",
  description: "",
  checkItem: "",
  diagnosis: "",
  remedy: "",
  typesString: "",
})

const route = useRoute()
console.log('archiveId' in route.params)

function getArchiveDetailsById() {
  if ('archiveId' in route.params) {
    axios.get("/case", {
      params: {
        id: route.params.archiveId
      },
      headers:{
        'token':store.state.token
      }
    }).then((res)=>{
      console.log(res.data.data)
      Object.assign(archiveDetailInfo, res.data.data)
      console.log(archiveDetailInfo)
    })
  }
  else {
    console.log("新建病例模式")
    console.log(archiveDetailInfo)
  }
}

getArchiveDetailsById()

let images = reactive({})

function upLoadImages(image: File, type: string) {
  Object.assign(images, {
    [type]: image
  })
  let imageFile = new Image()
  imageFile.src = window.URL.createObjectURL(image)
  imageFile.onload = () => {
    archiveDetailInfo[type] = imageFile.src
  }
  console.log(images)
}

function postArchiveDetailInfo(){
  const formdata = new FormData
  formdata.append("name", archiveDetailInfo.name)
  formdata.append("description", archiveDetailInfo.description)
  formdata.append("descriptionImg", images.descriptionImg)
  formdata.append("checkItem", archiveDetailInfo.checkItem)
  formdata.append("diagnosis", archiveDetailInfo.diagnosis)
  formdata.append("remedy", archiveDetailInfo.remedy)
  if (archiveDetailInfo.id !== ''){
    formdata.append("id", archiveDetailInfo.id)
    axios.put("/case", formdata, {
      headers:{
        'token':store.state.token
      }
    }).then((res)=>{
      if (res.data.code === 200) {
        console.log("修改成功")
        goBack()
      }
      else{
        console.log("修改失败")
        console.log(res.data)
      }
    })
  }
  else {
    formdata.append("type", archiveDetailInfo.typesString)
    axios.post("/case", formdata, {
      headers: {
        'token': store.state.token
      }
    }).then((res)=>{
      if (res.data.code === 200) {
        console.log("新建成功")
        goBack()
      }
      else{
        console.log("新建失败")
        console.log(res.data.msg)
      }
    })
  }
}

</script>

<template>
  <div class="full">
    <HScroller scroll-direction="column" class="full scroller-view">
      <div class="flex-column">
        <div v-if="archiveDetailInfo.id === ''" class="title">新建病例</div>
        <div v-if="archiveDetailInfo.id !== ''" class="title">修改病例</div>
        <div class="archive-content">
          <div v-if="archiveDetailInfo.id !== ''">
            <div>病例编号： {{ archiveDetailInfo.id }}</div>
            <div class="flex-row" v-for="(diseaseType, index) in archiveDetailInfo.type" :key="index">
              <span>所患疾病种类：</span>
              <span class="clickable-text">{{diseaseType + ''}}</span>
            </div>
          </div>
          <HInput
              name="病例名称"
              v-model="archiveDetailInfo.name"
          ></HInput>
          <HInput
              name="所患疾病种类（空格分隔）"
              v-model="archiveDetailInfo.typesString"
              v-if="archiveDetailInfo.id === ''"
          ></HInput>
          <HInput
              name="接诊（基本情况、临床症状）"
              v-model="archiveDetailInfo.description"
          ></HInput>
          <div class="upload-box">
            <HFileUpload
                @handleFile="upLoadImages($event, 'descriptionImg')"
                style="position:absolute; top: 25px; left: 25px"
            ></HFileUpload>
            <img :src="archiveDetailInfo.descriptionImg" class="upload-image">
          </div>
          <HInput
              name="检查"
              v-model="archiveDetailInfo.checkItem"
          ></HInput>
          <div class="upload-box">
            <HFileUpload
                @handleFile="upLoadImages($event, 'checkItemImg')"
                style="position:absolute; top: 25px; left: 25px"
            ></HFileUpload>
          </div>
          <HInput
              name="诊断结果"
              v-model="archiveDetailInfo.diagnosis"
          ></HInput>
          <div class="upload-box">
            <HFileUpload
                @handleFile="upLoadImages($event, 'diagnosisImg')"
                style="position:absolute; top: 25px; left: 25px"
            ></HFileUpload>
          </div>
          <HInput
              name="治疗方案"
              v-model="archiveDetailInfo.remedy"
          ></HInput>
          <div class="upload-box">
            <HFileUpload
                @handleFile="upLoadImages($event, 'remedyImg')"
                style="position:absolute; top: 25px; left: 25px"
            ></HFileUpload>
          </div>
          <HButton @click="postArchiveDetailInfo">确认</HButton>
        </div>
      </div>
    </HScroller>
  </div>
</template>

<style scoped lang="stylus">

.archive-title
  font-size 18px
  color var(--font-title-color)
  font-weight 550
  text-align left
  padding 20px
  padding-bottom 0px
  margin 0

.archive-content
  font-size 14px
  color: var(--black-color)
  text-align left
  padding 20px
  margin 0

.upload-image
  width 100%
  padding-top 20px
  padding-bottom 10px

.upload-box
  border 3px solid var(--theme-color)
  height 150px
  width 150px
  position relative

</style>