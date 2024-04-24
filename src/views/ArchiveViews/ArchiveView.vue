<script setup lang="ts">

import HScroller from "@/components/HScroller.vue";
import {ref, reactive} from "vue";
import HButton from "@/components/HButton.vue";
import DiseaseNameButton from "@/views/ArchiveViews/DiseaseNameButton.vue";
import {goto, gotoArchiveSearchResultsWithNames} from "@/assets/api";
import axios from "@/assets/axios";
import store from "@/store";
import HLoading from "@/components/HLoading.vue";
import {showMessage, tag} from "@/assets/api";


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
    console.log(res.data)
    if(res.data.code===200){
      diseaseNamesOrderedByType[diseaseType] = res.data.data.listData
    }else{
      showMessage(`${res.data.msg}`,'error')
    }
  }).catch(()=>{
    showMessage('网络错误','error')
  })
}

const onLoad = async () => {
  await diseaseTypes.forEach((diseaseType)=>{
    getDiseaseNamesByType(diseaseType)
  })
  return
}

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
    gotoArchiveSearchResultsWithNames('archiveSearchResults', chosenDiseasesString)
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
    <HLoading :load="onLoad">
      <div class="diseaseChooseBox">
        <HScroller scroll-direction="column">
          <div class="flex-column">
            <div class="diseaseType" v-for="(diseaseType,index) in diseaseTypes" :key="index">
              <div class="diseaseTypeTitle">
                {{diseaseType}}
              </div>
              <div class="flex-row flex-wrap">
                <div v-for="diseaseName in diseaseNamesOrderedByType[diseaseType]" :key="diseaseName.id">
                  <DiseaseNameButton
                      class="diseaseNameButton"
                      @click="chooseDisease(diseaseName.name)"
                      :isChosen="chosenDiseases.includes(diseaseName.name)"
                      height="50px"
                  >{{diseaseName.name}}</DiseaseNameButton>
                </div>
              </div>
            </div>
          </div>
          <br>
          <br>
          <br>
        </HScroller>
      </div>
      <HButton @click="searchArchives">确认选择</HButton>
    </HLoading>
  </div>
</template>

<style scoped lang="stylus">

.diseaseChooseBox
  height 85%
  border 3px solid var(--theme-color)

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

.diseaseTypeTitle
  margin 10px

.option-box
  border 1px solid var(--theme-color)

</style>