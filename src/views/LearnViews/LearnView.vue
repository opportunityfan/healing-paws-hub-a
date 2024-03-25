<script setup lang="ts">

import HInput from "@/components/HInput.vue";
import HDivider from "@/components/HDivider.vue";
import HSearch from "@/components/HSearch.vue";
import HScroller from "@/components/HScroller.vue";
import HImage from "@/components/HImage.vue";
import {ref} from "vue";
let affairs = ref([{
  name:'手术1',
  src: 'login-background.png'
},{name:'手术2',src:'login-background.png'},{name:'手术3',src:'login-background.png'}])
let instruments = ref([{
  name:'手术刀1',
  src: 'login-background.png'
},{name:'手术刀2',src:'login-background.png'},{name:'手术刀3',src:'login-background.png'}])
function goAffair(){
  console.log("进入事务详情")
}
function goInstrument(){
  console.log("进入qixie详情")
}
</script>

<template>
  <div class="full">
    <HScroller scroll-direction="column" class="full scroller-view">
      <div class="main-panel">
        <div class = "sub-title" >
          事务学习
        </div>
        <div class="image-string flex-row">
            <div v-for="affair in affairs" :key="affair.name" >
              <HImage :src="require('../../assets/'+affair.src)" :name="affair.name" @click="goAffair"></HImage>
            </div>
        </div>
        <div class = "sub-title" >
          器械学习
        </div>
        <div class="image-string flex-row">
          <div v-for="instrument in instruments" :key="instrument.name">
            <HImage :src="require('../../assets/'+instrument.src)" :name="instrument.name" @click="goInstrument"></HImage>
          </div>
        </div>
      </div>
    </HScroller>
  </div>
</template>

<style scoped lang="stylus">
.scroller-view
  padding-top 0px

.main-panel
  width 100%


.sub-title
  font-size: 26px;
  color: var(--font-title-color);
  font-weight: 550;
  text-align left
  padding 10px

.image-string
  div
    margin 5px 4px

</style>