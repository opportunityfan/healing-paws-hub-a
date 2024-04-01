<script setup lang="ts">

import HScroller from "@/components/HScroller.vue";
import HImage from "@/components/HImage.vue";
import {ref} from "vue";
import HButton from "@/components/HButton.vue";
import {goto} from "@/assets/api";

let diseaseNames = ref([{
  id:0,
  class:0,
  name:'病名1',
  backgroundImage: {
    src: require("@/assets/login-background.png"),
    width: 3035,
    height: 4299
  }
},
{
  id:1,
  class:1,
  name:'病名2',
  backgroundImage: {
    src: require("@/assets/login-background.png"),
    width: 3035,
    height: 4299
  }
},
{
  id:2,
  class: 1,
  name:'病名3',
  backgroundImage: {
    src: require("@/assets/login-background.png"),
    width: 3035,
    height: 4299
  }
},
{
  id:3,
  class: 2,
  name:'病名4',
  backgroundImage: {
    src: require("@/assets/login-background.png"),
    width: 3035,
    height: 4299
  }}])

let diseaseClasses = ref([{
  id: 0,
  name:'病种1'
},{id:1, name:'病种2'},{id:2, name:'病种3'},{id:3, name:'病种4'}])

let chosenDiseases: number[] = []

function chooseDisease(index:number){
  if (!chosenDiseases.includes(index)){
    chosenDiseases.push(index)
  }
  else{
    chosenDiseases.splice(chosenDiseases.indexOf(index),1)
  }
  console.log("已选中"+index)
  console.log(chosenDiseases)
  console.log(chosenDiseases.includes(index))
}

function searchDisease(){
  goto('/archiveSearchResults');
  console.log("多选提交")
}

</script>

<template>
  <div class="full">
    <HScroller scroll-direction="column" class="full scroller-view">
      <div class="flex-column">
        <div class="diseaseClass" v-for="diseaseClass in diseaseClasses" :key="diseaseClass.id">
          {{diseaseClass.name}}
          <br>
          <br>
          <div class="flex-row">
            <div v-for="diseaseName in diseaseNames" :key="diseaseName.id">
              <div class="diseaseNameButton" @click="chooseDisease(diseaseName.id)" :class="{'chosen': chosenDiseases.includes(diseaseName.id)}">
                <HButton>{{diseaseName.name}}</HButton>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <HButton @click="searchDisease">确认选择</HButton>
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