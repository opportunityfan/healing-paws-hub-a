<script setup lang="ts">

import HScroller from "@/components/HScroller.vue";
import HImage from "@/components/HImage.vue";
import {ref, reactive, computed} from "vue";
import HButton from "@/components/HButton.vue";
import {goto} from "@/assets/api";
import axios from "@/assets/axios";
import store from "@/store";

let testDiseaseNames = reactive([])

function getDiseaseNamesByType(typeName:string){
  axios.get('/disease/belong', {
    params:{
      pageNum: 1,
      pageSize: 4,
      type: "内科"
    },
    headers:{
      'token':store.state.token
    }
  }).then((res)=>{
    testDiseaseNames = res.data.data
    console.log(testDiseaseNames)
  })
}

getDiseaseNamesByType("内科")

let diseaseNames = reactive([{
  id:0,
  class:0,
  name:'病名1',
  backgroundImage: {
    src: require("@/assets/login-background.png"),
    width: 3035,
    height: 4299
  },
  ifChosen: false
},
{
  id:1,
  class:1,
  name:'病名2',
  backgroundImage: {
    src: require("@/assets/login-background.png"),
    width: 3035,
    height: 4299
  },
  ifChosen: false
},
{
  id:2,
  class: 1,
  name:'病名3',
  backgroundImage: {
    src: require("@/assets/login-background.png"),
    width: 3035,
    height: 4299
  },
  ifChosen: false
},
{
  id:3,
  class: 2,
  name:'病名4',
  backgroundImage: {
    src: require("@/assets/login-background.png"),
    width: 3035,
    height: 4299
  },
  ifChosen: false
}])

let diseaseTypes = ref([{
  id: 0,
  name:'病种1'
},{id:1, name:'病种2'},{id:2, name:'病种3'},{id:3, name:'病种4'}])

let chosenDiseases: number[] = []

function chooseDisease(index:number){
  console.log("已选中"+index)
  console.log(chosenDiseases)
  if (!chosenDiseases.includes(index)){
    chosenDiseases.push(index)
    diseaseNames[index].ifChosen = true
  }
  else {
    chosenDiseases.splice(chosenDiseases.indexOf(index), 1)
    diseaseNames[index].ifChosen = false
  }
}

function searchArchives(){
  goto('/archiveSearchResults');
  console.log("多选提交")
}

let Archives = reactive([])

function getArchivesByDiseaseNames(){
  axios.get("/case/group", {
    params:{
      pageNum: 1,
      pageSize: 4,
      diseases: "口炎 肠炎"
    },
    headers:{
      'token':store.state.token
    }
  }).then((res)=>{
    Archives = res.data.data
    console.log(Archives)
  })
}

</script>

<template>
  <div class="full">
    <HScroller scroll-direction="column" class="full scroller-view">
      <HButton @click="getDiseaseNamesByType">111</HButton>
      <HButton @click="getArchivesByDiseaseNames">222</HButton>
      <div class="flex-column">
        <div class="diseaseClass" v-for="diseaseType in diseaseTypes" :key="diseaseType.id">
          {{diseaseType.name}}
          <br>
          <br>
          <div class="flex-row">
            <div v-for="diseaseName in diseaseNames" :key="diseaseName.id">
              <div class="diseaseNameButton" @click="chooseDisease(diseaseName.id)" :class="{'chosen': diseaseName.ifChosen}">
                <HButton>{{diseaseName.name}}</HButton>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <HButton @click="searchArchives">确认选择</HButton>
      </div>
    </HScroller>
  </div>
</template>

<style scoped>

.diseaseNameButton {
  width: 100px;
  margin: 10px
}

.chosen {
  border: 1px solid red
}

.diseaseClass {
  font-size: 20px;
  color: var(--font-title-color);
  font-weight: 550;
  text-align: left;
  padding: 20px;
  margin: 0
}

</style>