<script setup lang="ts">

import {reactive, ref} from "vue";
import {useRoute} from "vue-router";
import axios from "@/assets/axios";
import store from "@/store";
import HScroller from "@/components/HScroller.vue";
import {Image} from "@/assets/api";

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
    console.log(archiveDetailInfo)
  })
}

getArchiveDetailsById()

function consoleLogArchiveDetailInfo(){
  console.log(archiveDetailInfo)
}

</script>

<template>
  <div class="full">
    <HScroller scroll-direction="column" class="full scroller-view">
      <div class="flex-column">
        <div class="archive-title">基本信息</div>
        <div class="archive-content">
          <div>病例编号： {{ archiveDetailInfo.id }}</div>
          <div>病例名称： {{ archiveDetailInfo.name }}</div>
          <div class="flex-row" v-for="(diseaseType, index) in archiveDetailInfo.type" :key="index">
            <span>所患疾病种类：</span>
            <span class="clickable-text">{{diseaseType + ''}}</span>
          </div>
        </div>
        <div class="archive-title">接诊（基本情况、临床症状）</div>
        <div class="archive-content">
          <div v-html="archiveDetailInfo.description"></div><br>
          <img :src="archiveDetailInfo.descriptionImg" class="archive-image">
        </div>
        <div class="archive-title">检查</div>
        <div class="archive-content">
          <div v-html="archiveDetailInfo.checkItem"></div><br>
          <img :src="archiveDetailInfo.checkItemImg" class="archive-image">
        </div>
        <div class="archive-title">诊断结果</div>
        <div class="archive-content">
          <div v-html="archiveDetailInfo.diagnosis"></div><br>
          <img :src="archiveDetailInfo.diagnosisImg" class="archive-image">
        </div>
        <div class="archive-title">治疗方案</div>
        <div class="archive-content">
          <div v-html="archiveDetailInfo.remedy"></div><br>
          <img :src="archiveDetailInfo.remedyImg" class="archive-image">
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