<script setup lang="ts">

import HImage from "@/components/HImage.vue";
import HButton from "@/components/HButton.vue";
import {Image} from "@/assets/api";
import {reactive, ref} from "vue";
import {goto, gotoArchiveDetailPageWithId} from "@/assets/api";
import {useRoute} from "vue-router";
import axios from "@/assets/axios";
import store from "@/store";

const route = useRoute()
console.log(route.params.diseaseNames)

let Archives = reactive([])

function getArchivesByDiseaseNames(){
  axios.get("/case/group", {
    params:{
      pageNum: 1,
      pageSize: 10,
      diseases: route.params.diseaseNames
    },
    headers:{
      'token':store.state.token
    }
  }).then((res)=>{
    Object.assign(Archives, res.data.data)
    console.log(Archives)
  })
}

getArchivesByDiseaseNames()

// eslint-disable-next-line @typescript-eslint/no-var-requires
let image = new Image(require("@/assets/login-background.png"), 1, 1)


function goArchiveDetails(archiveId: string){
  gotoArchiveDetailPageWithId('archiveDetailPage', archiveId)
  console.log("进入病例详情界面")
  console.log(archiveId)
}

</script>

<template>
  <div>
    这是病例查询结果页面
    <div class="flex-column">
      <div class="flex-row flex-wrap">
        <div v-for="(archive, index) in Archives" :key="index">
          <HImage :image="image" @click="goArchiveDetails(archive.id.toString())"></HImage>
          <div>{{archive.name}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>