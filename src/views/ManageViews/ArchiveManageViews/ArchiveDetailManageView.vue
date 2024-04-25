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
  typesString: ""
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

let videos = reactive({})

function upLoadVideos(video: File, type: string) {
  Object.assign(videos, {
    [type]: video
  })
  archiveDetailInfo[type] = window.URL.createObjectURL(video)
  console.log(videos)
}

function postArchiveDetailInfo(){
  const formdata = new FormData
  formdata.append("name", archiveDetailInfo.name)
  formdata.append("description", archiveDetailInfo.description)
  // formdata.append("descriptionVideo", videos.descriptionVideo)
  formdata.append("checkItem", archiveDetailInfo.checkItem)
  formdata.append("diagnosis", archiveDetailInfo.diagnosis)
  formdata.append("remedy", archiveDetailInfo.remedy)
  for (let key in images) {
    formdata.append(key, images[key])
  }
  for (let key in videos) {
    formdata.append(key, videos[key])
  }
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

function clickElement(elementId: string) {
  document.getElementById(elementId).querySelector('input').click()
}


</script>

<template>
  <div class="full">
    <HScroller scroll-direction="column" class="full scroller-view">
      <div class="flex-column">
        <div class="title">
          <span v-if="archiveDetailInfo.id === ''">新建病例</span>
          <span v-else>修改病例</span>
        </div>
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
          <select>

          </select>
          <div class="archive-title">接诊（基本情况、临床症状）</div>
          <textarea
              class="text-input"
              v-model="archiveDetailInfo.description">
          </textarea>
          <div class="flex-row">
            <div>
              <div class="archive-title">上传图片</div>
              <div v-show="archiveDetailInfo.descriptionImg==null" class="upload-box">
                <HFileUpload
                    id="descriptionImg"
                    @handleFile="upLoadImages($event, 'descriptionImg')"
                ></HFileUpload>
              </div>
              <div v-show="archiveDetailInfo.descriptionImg!=null" style="display: inline-flex">
                <img :src="archiveDetailInfo.descriptionImg" class="upload-file">
                <div>
                  <HButton
                      style="width: 20px;margin: 10px 10px 10px 0px"
                      height="20px"
                      type="secondary"
                      @click="clickElement('descriptionImg')"
                  ><i class='bx bx-edit-alt'></i>
                  </HButton>
                  <HButton
                      style="width: 20px;margin: 10px 10px 10px 0px"
                      height="20px"
                      type="danger"
                      @click="archiveDetailInfo.descriptionImg=null;delete images.descriptionImg"
                  ><i class='bx bx-trash'></i>
                  </HButton>
                </div>
              </div>
            </div>
            <div>
              <div class="archive-title">上传视频</div>
              <div v-show="archiveDetailInfo.descriptionVideo==null" class="upload-box">
                <HFileUpload
                    id="descriptionVideo"
                    @handleFile="upLoadVideos($event, 'descriptionVideo')"
                    file-type="video/mp4"
                ></HFileUpload>
              </div>
              <div v-show="archiveDetailInfo.descriptionVideo!=null" style="display: inline-flex">
                <video :src="archiveDetailInfo.descriptionVideo" class="upload-file" controls></video>
                <div>
                  <HButton
                      style="width: 20px;margin: 10px 10px 10px 0px"
                      height="20px"
                      type="secondary"
                      @click="clickElement('descriptionVideo')"
                  ><i class='bx bx-edit-alt'></i>
                  </HButton>
                  <HButton
                      style="width: 20px;margin: 10px 10px 10px 0px"
                      height="20px"
                      type="danger"
                      @click="archiveDetailInfo.descriptionVideo=null;delete videos.descriptionVideo"
                  ><i class='bx bx-trash'></i>
                  </HButton>
                </div>
              </div>
            </div>
          </div>
          <br><br>
          <HInput
              name="检查"
              v-model="archiveDetailInfo.checkItem"
          ></HInput>
          <div class="flex-row">
            <div>
              <div class="archive-title">上传图片</div>
              <div v-show="archiveDetailInfo.checkItemImg==null" class="upload-box">
                <HFileUpload
                    id="checkItemImg"
                    @handleFile="upLoadImages($event, 'checkItemImg')"
                ></HFileUpload>
              </div>
              <div v-show="archiveDetailInfo.checkItemImg!=null" style="display: inline-flex">
                <img :src="archiveDetailInfo.checkItemImg" class="upload-file">
                <div>
                  <HButton
                      style="width: 20px;margin: 10px 10px 10px 0px"
                      height="20px"
                      type="secondary"
                      @click="clickElement('checkItemImg')"
                  ><i class='bx bx-edit-alt'></i>
                  </HButton>
                  <HButton
                      style="width: 20px;margin: 10px 10px 10px 0px"
                      height="20px"
                      type="danger"
                      @click="archiveDetailInfo.checkItemImg=null;delete images.checkItemImg"
                  ><i class='bx bx-trash'></i>
                  </HButton>
                </div>
              </div>
            </div>
            <div>
              <div class="archive-title">上传视频</div>
              <div v-show="archiveDetailInfo.checkItemVideo==null" class="upload-box">
                <HFileUpload
                    id="checkItemVideo"
                    @handleFile="upLoadVideos($event, 'checkItemVideo')"
                    file-type="video/mp4"
                ></HFileUpload>
              </div>
              <div v-show="archiveDetailInfo.checkItemVideo!=null" style="display: inline-flex">
                <video :src="archiveDetailInfo.checkItemVideo" class="upload-file" controls></video>
                <div>
                  <HButton
                      style="width: 20px;margin: 10px 10px 10px 0px"
                      height="20px"
                      type="secondary"
                      @click="clickElement('checkItemVideo')"
                  ><i class='bx bx-edit-alt'></i>
                  </HButton>
                  <HButton
                      style="width: 20px;margin: 10px 10px 10px 0px"
                      height="20px"
                      type="danger"
                      @click="archiveDetailInfo.checkItemVideo=null;delete videos.checkItemVideo"
                  ><i class='bx bx-trash'></i>
                  </HButton>
                </div>
              </div>
            </div>
          </div>
          <br><br>
          <HInput
              name="诊断结果"
              v-model="archiveDetailInfo.diagnosis"
          ></HInput><br>
          <div class="flex-row">
            <div>
              <div class="subtitle">上传图片</div>
              <div class="upload-box">
                <HFileUpload
                    @handleFile="upLoadImages($event, 'diagnosisImg')"
                    style="position:absolute; top: 25px; left: 25px"
                ></HFileUpload>
                <img :src="archiveDetailInfo.diagnosisImg" class="upload-image">
              </div>
            </div>
            <div>
              <div class="subtitle">上传视频</div>
              <div class="upload-box">
                <HFileUpload
                    @handleFile="upLoadVideos($event, 'diagnosisVideo')"
                    style="position:absolute; top: 25px; left: 25px"
                    file-type="video/mp4"
                ></HFileUpload>
              </div>
            </div>
          </div>
          <br><br>
          <HInput
              name="治疗方案"
              v-model="archiveDetailInfo.remedy"
          ></HInput><br>
          <div class="flex-row">
            <div>
              <div class="archive-title">上传图片</div>
              <div class="upload-box">
                <HFileUpload
                    @handleFile="upLoadImages($event, 'remedyImg')"
                    style="position:absolute; top: 25px; left: 25px"
                ></HFileUpload>
                <img :src="archiveDetailInfo.remedyImg" class="upload-image">
              </div>
            </div>
            <div>
              <div class="subtitle">上传视频</div>
              <div class="upload-box">
                <HFileUpload
                    @handleFile="upLoadVideos($event, 'remedyVideo')"
                    style="position:absolute; top: 25px; left: 25px"
                    file-type="video/mp4"
                ></HFileUpload>
              </div>
            </div>
          </div>
          <br><br>
          <HButton @click="postArchiveDetailInfo">
            <span v-if="archiveDetailInfo.id!==''">确认修改</span>
            <span v-else>新建病例</span>
          </HButton>
        </div>
      </div>
    </HScroller>
  </div>
</template>

<style scoped lang="stylus">

.text-input
  border var(--object-unfocus-color) 1.5px solid
  border-radius 5px
  height 100px
  font-color black
  font-size 14px

.archive-title
  font-size 18px
  color var(--font-title-color)
  font-weight 550
  text-align left
  margin 20px 20px 10px 0px

.archive-content
  font-size 14px
  color: var(--black-color)
  text-align left
  padding 20px
  margin 0

.upload-file
  height 100px
  margin 10px 10px 20px 0
  border 3px solid var(--theme-color)

.upload-box
  border 3px solid var(--theme-color)
  height 100px
  width 100px
  position relative
  margin 20px 20px 20px 0
</style>