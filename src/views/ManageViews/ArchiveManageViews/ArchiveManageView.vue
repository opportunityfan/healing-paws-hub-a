<script setup lang="ts">

import HScroller from "@/components/HScroller.vue";
import {ref, reactive} from "vue";
import HButton from "@/components/HButton.vue";
import HInput from "@/components/HInput.vue";
import DiseaseNameButton from "@/views/ArchiveViews/DiseaseNameButton.vue";
import {goto, gotoArchiveSearchResultsWithNames} from "@/assets/api";
import axios from "@/assets/axios";
import store from "@/store";

let diseaseTypes = reactive(["传染病", "寄生虫病", "内科", "外产科疾病", "常用手术", "免疫"])
let diseaseNamesOrderedByType: Record<string, any> = reactive({})

function getDiseaseNamesByType(diseaseType: string) {
  axios.get('/disease/belong', {
    params: {
      pageNum: 1,
      pageSize: 50,
      type: diseaseType
    },
    headers: {
      'token': store.state.token
    }
  }).then((res) => {
    diseaseNamesOrderedByType[diseaseType] = res.data.data
  })
}

diseaseTypes.forEach((diseaseType) => {
  getDiseaseNamesByType(diseaseType)
})

console.log(diseaseNamesOrderedByType)

let chosenDiseases = reactive([])
let chosenDiseasesId = reactive([])

function chooseDisease(diseaseName) {
  if (!chosenDiseases.includes(diseaseName.name)) {
    chosenDiseases.push(diseaseName.name)
    chosenDiseasesId.push(diseaseName.id)
  } else {
    chosenDiseases.splice(chosenDiseases.indexOf(diseaseName.name), 1)
    chosenDiseasesId.splice(chosenDiseasesId.indexOf(diseaseName.id), 1)
  }
  console.log("已选中" + diseaseName.name + diseaseName.id)
  console.log(chosenDiseasesId)
  console.log(chosenDiseases.join(' '))
}


function searchArchives() {
  if (chosenDiseases.length > 0) {
    let chosenDiseasesString = chosenDiseases.join(' ')
    gotoArchiveSearchResultsWithNames('archiveSearchResultsManage', chosenDiseasesString)
  } else {
    console.log("提交失败")
  }
  console.log("多选提交")
}

let isClicked = ref("")
let diseaseNameToAdd = ref("")

function addDisease(diseaseType: string) {
  if (diseaseNameToAdd.value !== '') {
    let jsondata = {
      name: diseaseNameToAdd.value,
      type: diseaseType
    }
    axios.post('/disease', jsondata, {
      headers: {
        'token': store.state.token
      }
    }).then((res)=>{
      if(res.data.code === 200) {
        console.log("添加成功")
        diseaseNameToAdd.value = ''
        isClicked.value = ''
        getDiseaseNamesByType(diseaseType)
      }
      else {
        console.log("添加失败")
        console.log(res.data.msg)
      }
    })
  }
  else {
    console.log("请输入病种名称")
  }
}

function deleteDiseases() {
  for (let diseaseId of chosenDiseasesId) {
    axios.delete('/disease', {
      params: {
        'id': diseaseId
      },
      headers: {
        'token': store.state.token
      }
    }).then((res)=>{
      if(res.data.code === 200) {
        console.log("删除成功")
        diseaseTypes.forEach((diseaseType) => {
          getDiseaseNamesByType(diseaseType)
        })
      }
      else {
        console.log("删除失败")
        console.log(res.data.msg)
      }
    })
  }
  chosenDiseasesId.length = 0
}

</script>

<template>
  <div class="full">
    <div class="diseaseChooseBox">
      <HScroller scroll-direction="column" class="scroller-view">
        <div class="flex-column">
          <div class="diseaseType" v-for="(diseaseType,index) in diseaseTypes" :key="index">
            <div class="diseaseTypeTitle">
              {{diseaseType}}
            </div>
            <div class="flex-row flex-wrap">
              <div v-for="diseaseName in diseaseNamesOrderedByType[diseaseType]" :key="diseaseName.id">
                <DiseaseNameButton
                    :isChosen="chosenDiseases.includes(diseaseName.name)"
                    height="50px"
                    class="diseaseNameButton"
                    @click="chooseDisease(diseaseName)"
                >{{diseaseName.name}}</DiseaseNameButton>
              </div>
              <DiseaseNameButton @click="()=>{isClicked=diseaseType}" height="50px" class="diseaseNameButton">
                <div v-show="isClicked!==diseaseType" style="font-size: 30px">+</div>
                <HInput
                    name=""
                    v-show="isClicked===diseaseType"
                    style="display: inline-block"
                    v-model="diseaseNameToAdd"
                ></HInput>
              </DiseaseNameButton>
              <div v-show="isClicked===diseaseType">
                <DiseaseNameButton
                    height="20px"
                    style="width: 20px"
                    @click="addDisease(diseaseType)"
                >√</DiseaseNameButton>
                <DiseaseNameButton
                    height="20px"
                    style="width: 20px"
                    @click="()=>{isClicked=''}"
                >x</DiseaseNameButton>
              </div>
            </div>
          </div>
        </div>
        <br>
        <br>
        <br>
      </HScroller>
    </div>
    <div class="flex-row">
      <HButton @click="searchArchives" style="margin-right: 10px">搜索符合的病例</HButton>
      <HButton @click="deleteDiseases" style="margin-right: 10px">删除选中的病种</HButton>
      <HButton @click="goto('/archiveDetailManage')">新建病例</HButton>
    </div>
  </div>
</template>

<style scoped lang="stylus">

.diseaseChooseBox
  height 70%
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