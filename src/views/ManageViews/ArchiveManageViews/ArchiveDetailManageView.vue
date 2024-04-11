<script setup lang="ts">

import {reactive, ref} from "vue";
import {useRoute} from "vue-router";
import axios from "@/assets/axios";
import store from "@/store";
import HScroller from "@/components/HScroller.vue";
import HInput from "@/components/HInput.vue";
import HButton from "@/components/HButton.vue";
import HFileUpload from "@/components/HFileUpload.vue";
import {Image, goBack} from "@/assets/api";

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

// eslint-disable-next-line @typescript-eslint/no-var-requires
const altImage = new Image(require("@/assets/login-background.png"), 1280, 720)

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

function consoleLogArchiveDetailInfo(){
  console.log(archiveDetailInfo)
}

function postArchiveDetailInfo(){
  const formdata = new FormData
  formdata.append("name", archiveDetailInfo.name)
  formdata.append("description", archiveDetailInfo.description)
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

// let images = reactive({})
//
// function upLoadImages(image: File) {
//   Object.assign(images, {
//   })
// }

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
<!--          <div style="position: relative; width: fit-content" class="avatar-box">-->
<!--            <HImage :image="affair.image" :size="100" :lazy-load="false"></HImage>-->
<!--            <div class="center add-icon" >-->
<!--              <HFileUpload @handleFile="upLoadImages"></HFileUpload>-->
<!--            </div>-->
<!--          </div>-->
          <HInput
              name="检查"
              v-model="archiveDetailInfo.checkItem"
          ></HInput>
          <HInput
              name="诊断结果"
              v-model="archiveDetailInfo.diagnosis"
          ></HInput>
          <HInput
              name="治疗方案"
              v-model="archiveDetailInfo.remedy"
          ></HInput>
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

.archive-image
  width 100%
  padding-top 20px
  padding-bottom 10px

</style>