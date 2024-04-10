<script setup lang="ts">

import {reactive, ref} from "vue";
import {useRoute} from "vue-router";
import axios from "@/assets/axios";
import store from "@/store";
import HButton from "@/components/HButton.vue";
import {Case, Image} from "@/assets/api";

const route = useRoute()
console.log(route.params.archiveId)

let archiveDetailInfo = reactive({})

// eslint-disable-next-line @typescript-eslint/no-var-requires
const altImage = new Image(require("@/assets/login-background.png"), 1280, 720)

function getArchiveDetailsById() {
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
    Object.assign(archiveDetailInfo, {
      descriptionImg: res.data.data.descriptionImg === null ? altImage : {
        src: res.data.data.descriptionImg,
        width: res.data.data.descImgSize[0],
        height: res.data.data.descImgSize[1]
      },
      checkItemImg: res.data.data.checkItemImg === null ? altImage : {
        src: res.data.data.checkItemImg,
        width: res.data.data.checkImgSize[0],
        height: res.data.data.checkImgSize[1]
      },
      diagnosisImg: res.data.data.diagnosisImg === null ? altImage : {
        src: res.data.data.diagnosisImg,
        width: res.data.data.diagImgSize[0],
        height: res.data.data.diagImgSize[1]
      },
      remedyImg: res.data.data.remedyImg === null ? altImage : {
        src: res.data.data.remedyImg,
        width: res.data.data.remedyImgSize[0],
        height: res.data.data.remedyImgSize[1]
      }
    })
    console.log(archiveDetailInfo)
  })
}

getArchiveDetailsById()

function consoleLogArchiveDetailInfo(){
  console.log(archiveDetailInfo)
}

</script>

<template>
  <div>
    这是病例详细信息页面
    <br>
    <br>
    <div class="flex-column">
      <div>
        <span>id: {{ archiveDetailInfo.id }}</span><br>
        <span>name: {{ archiveDetailInfo.name }}</span><br>
        <span>type: {{ archiveDetailInfo.type }}</span><br>
      </div>
      <HButton @click="consoleLogArchiveDetailInfo">111</HButton>
    </div>
  </div>
</template>

<style scoped>

</style>