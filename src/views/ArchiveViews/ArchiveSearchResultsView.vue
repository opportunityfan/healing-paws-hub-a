<script setup lang="ts">

import HButton from "@/components/HButton.vue";
import HScroller from "@/components/HScroller.vue";
import {Post} from "@/assets/api";
import {reactive, ref} from "vue";
import {gotoArchiveDetailPageWithId} from "@/assets/api";
import {useRoute} from "vue-router";
import axios from "@/assets/axios";
import store from "@/store";
import ArchiveBlock from "@/views/ArchiveViews/ArchiveBlock.vue";

const route = useRoute()
console.log(route.params.diseaseNames)

let archiveInfos: Post[] = reactive([])

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
    console.log(res.data.data)
    res.data.data.listData.forEach((archive)=>{
      archiveInfos.push({
        id: archive.id,
        title: archive.name,
        backgroundImage: {
          src: archive.descriptionImg === null ? require("@/assets/login-background.png") : archive.descriptionImg,
          width: 100,
          height: 100
        },
        description: archive.type.join("/")
      })
    })
    console.log(archiveInfos)
  })
}

getArchivesByDiseaseNames()

function goArchiveDetails(archiveId: string){
  gotoArchiveDetailPageWithId('archiveDetailPage', archiveId)
  console.log("进入病例详情界面")
  console.log(archiveId)
}

</script>

<template>
  <div class="full">
    这是病例查询结果页面
    <HScroller scroll-direction="column" class="full scroller-view">
      <div class="flex-column">
        <div class="flex-row flex-wrap">
          <div class="archiveBlocks" v-for="(archiveInfo, index) in archiveInfos" :key="index">
            <ArchiveBlock :archiveInfo = "archiveInfo" @click="goArchiveDetails(archiveInfo.id.toString())"></ArchiveBlock>
          </div>
        </div>
      </div>
    </HScroller>
  </div>
</template>

<style scoped lang="stylus">

.archiveBlocks
  width 200px
  height 200px
  margin 20px

</style>