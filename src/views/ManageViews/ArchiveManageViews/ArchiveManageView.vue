<script setup lang="ts">

import HScroller from "@/components/HScroller.vue";
import {ref, reactive} from "vue";
import HButton from "@/components/HButton.vue";
import DiseaseNameButton from "@/views/ArchiveViews/DiseaseNameButton.vue";
import {goto, gotoArchiveSearchResultsWithNames} from "@/assets/api";
import axios from "@/assets/axios";
import store from "@/store";

let diseaseTypes = reactive(["传染病","寄生虫病","内科","外产科疾病","常用手术","免疫"])
let diseaseNamesOrderedByType: Record<string, any> = reactive({})

function getDiseaseNamesByType(diseaseType: string){
  axios.get('/disease/belong', {
    params:{
      pageNum: 1,
      pageSize: 50,
      type: diseaseType
    },
    headers:{
      'token':store.state.token
    }
  }).then((res)=>{
    diseaseNamesOrderedByType[diseaseType] = res.data.data
  })
}

diseaseTypes.forEach((diseaseType)=>{
  getDiseaseNamesByType(diseaseType)
})

console.log(diseaseNamesOrderedByType)

let chosenDiseases: string[] = reactive([])

function chooseDisease(name:string){
  if (!chosenDiseases.includes(name)){
    chosenDiseases.push(name)
  }
  else {
    chosenDiseases.splice(chosenDiseases.indexOf(name), 1)
  }
  console.log("已选中"+name)
  console.log(chosenDiseases)
  console.log(chosenDiseases.join(' '))
}


function searchArchives(){
  if (chosenDiseases.length > 0){
    let chosenDiseasesString = chosenDiseases.join(' ')
    gotoArchiveSearchResultsWithNames('archiveSearchResultsManage', chosenDiseasesString)
  }
  else {
    console.log("提交失败")
  }
  console.log("多选提交")
}

function consoleLogToken(){
  console.log(store.state.token)
}

</script>

<template>
  <div class="full">
    <HScroller scroll-direction="column" class="scroller-view" style="width:100%;height:60%">
      <div class="flex-column" style="border:1px solid var(--theme-color)">
        <div class="diseaseType" v-for="(diseaseType,index) in diseaseTypes" :key="index">
          {{diseaseType}}
          <br>
          <br>
          <div class="flex-row flex-wrap">
            <div v-for="diseaseName in diseaseNamesOrderedByType[diseaseType]" :key="diseaseName.id">
              <div class="diseaseNameButton" @click="chooseDisease(diseaseName.name)">
                <DiseaseNameButton :isChosen="chosenDiseases.includes(diseaseName.name)" height="50px">{{diseaseName.name}}</DiseaseNameButton>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br>
      <br>
      <br>
    </HScroller>
    <HButton @click="searchArchives">确认选择</HButton>
    <HButton @click="goto('/archiveDetailManage')">新建病例</HButton>
  </div>
</template>

<style scoped lang="stylus">

.diseaseNameButton
  width 100px
  margin 10px

.diseaseType
  font-size 20px
  color var(--font-title-color)
  font-weight 550
  text-align left
  padding 20px
  margin 0

.option-box
  border 1px solid var(--theme-color)

</style>