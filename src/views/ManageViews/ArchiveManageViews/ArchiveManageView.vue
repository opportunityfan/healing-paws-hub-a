<script setup lang="ts">

import HScroller from "@/components/HScroller.vue"
import {ref, reactive} from "vue"
import HButton from "@/components/HButton.vue"
import HAlert from "@/components/HAlert.vue"
import DiseaseNameButton from "@/views/ArchiveViews/DiseaseNameButton.vue"
import {goto, gotoArchiveSearchResultsWithNames} from "@/assets/api"
import axios from "@/assets/axios"
import store from "@/store"

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
    diseaseNamesOrderedByType[diseaseType] = res.data.data.listData
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

let isHover = ref("")

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

let deleteAlert = ref(false)

function deleteDisease(diseaseId: string) {
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

let toUpdate = ref("")
let diseaseNameToUpdate = ref("")

function updateDiseaseName(diseaseId: string) {
  axios.put('/disease', {
    id: diseaseId,
    name: diseaseNameToUpdate.value
  }, {
    headers: {
      'token': store.state.token
    }
  }).then((res)=>{
    if(res.data.code === 200) {
      console.log("修改成功")
      diseaseTypes.forEach((diseaseType) => {
        getDiseaseNamesByType(diseaseType)
      })
      toUpdate.value = ""
      diseaseNameToUpdate.value = ""
    }
    else {
      console.log("修改失败")
      console.log(res.data.msg)
    }
  })
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
                <div
                    style="display: inline-flex"
                    @mouseover="isHover=diseaseName.name"
                    @mouseleave="isHover=''">
                  <DiseaseNameButton
                      :isChosen="chosenDiseases.includes(diseaseName.name)"
                      height="50px"
                      class="diseaseNameButton"
                      @click="chooseDisease(diseaseName)">
                    <input
                        v-model="diseaseNameToUpdate"
                        v-show="toUpdate===diseaseName.name"
                        style="height:30px;width:70px;background-color:var(--background-color);font-color:white">
                    <div v-show="toUpdate!==diseaseName.name">
                      {{diseaseName.name}}
                    </div>
                  </DiseaseNameButton>
                  <div v-show="isHover===diseaseName.name&&toUpdate===''">
                    <HButton
                        style="width: 20px;margin: 10px 10px 10px 0px"
                        height="20px"
                        type="secondary"
                        @click="diseaseNameToUpdate=toUpdate=diseaseName.name"
                    ><i class='bx bx-edit-alt'></i>
                    </HButton>
                    <HButton
                        style="width: 20px;margin: 10px 10px 10px 0px"
                        height="20px"
                        type="danger"
                        @click="deleteAlert=true"
                    ><i class='bx bx-trash'></i>
                    </HButton>
                    <HAlert v-model="deleteAlert">
                      <div class="flex-column" style="gap: 10px; text-align: left">
                        <div class="flex-row" style="width: 100%">
                          <div class="box-icon">
                            <i class='bx bx-trash'></i>
                          </div>
                          <div class="text-bold">删除</div>
                        </div>
                        <div class="text" style="padding-bottom: 20px; width: 100%">你确定删除该疾病吗？</div>
                        <div class="flex-row" style=" width: 100%;gap: 10px; justify-content: flex-end">
                          <h-button type="secondary" height="30px" style="margin: 0; width: 60px; font-size: 12px" id="cancel" @click="deleteAlert=false">取消</h-button>
                          <h-button type="danger" height="30px" style="margin: 0; width: 60px; font-size: 12px" @click="deleteDisease(diseaseName.id)" id="confirm">删除</h-button>
                        </div>
                      </div>
                    </HAlert>
                  </div>
                  <div v-show="toUpdate===diseaseName.name">
                    <HButton
                        height="20px"
                        style="width: 20px; margin: 10px 10px 10px 0px"
                        @click="updateDiseaseName(diseaseName.id)"
                        type="secondary"
                    ><i class='bx bx-check'></i></HButton>
                    <HButton
                        height="20px"
                        style="width: 20px; margin: 10px 10px 10px 0px"
                        @click="toUpdate=''"
                        type="secondary"
                    ><i class='bx bx-x'></i></HButton>
                  </div>
                </div>
              </div>
              <div style="display: inline-flex">
                <DiseaseNameButton @click="()=>{isClicked=diseaseType}" height="50px" class="diseaseNameButton">
                  <div v-show="isClicked!==diseaseType">
                    <i class='bx bx-plus' style="font-size: 20px; font-weight: bold"></i>
                  </div>
                  <input
                      placeholder="输入疾病名"
                      v-show="isClicked===diseaseType"
                      style="height:30px;width:70px;background-color:var(--background-color);font-color:white"
                      v-model="diseaseNameToAdd">
                </DiseaseNameButton>
                <div v-show="isClicked===diseaseType">
                  <HButton
                      height="20px"
                      style="width: 20px; margin: 10px 10px 10px 0px"
                      @click="addDisease(diseaseType)"
                      type="secondary"
                  ><i class='bx bx-check'></i></HButton>
                  <HButton
                      height="20px"
                      style="width: 20px; margin: 10px 10px 10px 0px"
                      @click="isClicked=''"
                      type="secondary"
                  ><i class='bx bx-x'></i></HButton>
                </div>
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