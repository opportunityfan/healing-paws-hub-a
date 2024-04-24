<template>
  <div class="main-panel flex-column full">
    <div class="affair-bar flex-column" style="height: 50%">
      <div class="flex-row">
        <div class = "sub-title">
          职能学习
        </div>
        <div class="box-icon button-hover" @click="goAffairSearchView()">
          <i class='bx bx-dots-horizontal-rounded'></i>
        </div>
      </div>

      <PostFlow :request-new-post="requestNewAffair" urlPrefix="/affair/" style="flex-grow: 1"></PostFlow>
    </div>
    <div class="instrument-bar flex-column" style="height: 40%">
      <div class="flex-row">
        <div class = "sub-title">
          器械学习
        </div>
        <div class="box-icon button-hover" @click="goInstrumentSearchView">
          <i class='bx bx-dots-horizontal-rounded'></i>
        </div>
      </div>
      <PostFlow :request-new-post="requestNewInstrument" urlPrefix="/instrument/" style="flex-grow: 1" :width="120" :show-description="false" :update-post-count="7"></PostFlow>
    </div>
  </div>
</template>

<script setup lang="ts">

import PostFlow from "@/components/PostFlow.vue";
import {goAffairSearchView, goInstrumentSearchView, Post, Image, showMessage} from "@/assets/api";


import axios from "@/assets/axios";
import store from "@/store";
import {temp} from "three/examples/jsm/nodes/core/VarNode";
import HLoading from "@/components/HLoading.vue";



const requestNewAffair = async (count : number) => {
  const newPostList = new Array<Post>()
  const jsondata = {count:'10'}
  await axios.post('/affair/recommend',jsondata,{
    headers:{
      'token':store.state.token
    }
  }).then(res=>{
    console.log(res.data.data)
    if(res.data.code==200) {
      console.log('检查item',res.data)
      for (let item of res.data.data) {

        let tempImage
        if (item.pic === null) {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const image = new Image(require("@/assets/login-background.png"), 3035, 4299)
          tempImage = image
        } else {
          const image = new Image(item.pic, 1, 1)
          tempImage = image
        }
        newPostList.push(new Post(item.id, item.name, item.description, tempImage))
      }
    }else{
      showMessage(`${res.data.msg}`,'error')
    }
  }).catch((e)=>{
    console.log(e)
    showMessage('网络错误Affair','error')
  })
  return newPostList
}
let instrumentNum = 1
const requestNewInstrument = async (count : number) => {
  const newPostList = new Array<Post>()

  await axios.get('/item/page',{
    headers:{
      token : store.state.token
    },
    params:{
      pageNum : count,
      pageSize : 7

    }
  }).then(res=>{
    console.log(res.data)
    if(res.data.code==200) {
      for (let item of res.data.data.listData) {
        let tempImage
        if (item.pic === null) {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const image = new Image(require("@/assets/login-background.png"), 3035, 4299)
          tempImage = image
        } else {
          const image = new Image(item.pic, 1, 1)
          tempImage = image
        }
        newPostList.push(new Post(item.id, item.name, item.introduction, tempImage))
      }
    }else{
      showMessage(`${res.data.msg}`,'error')
    }
  }).catch(()=>{
    showMessage('网络错误Inst','error')
  })
  return newPostList
}
</script>

<style scoped lang="stylus">
.main-panel
  justify-content space-evenly

.affair-bar,.instrument-bar
  width 100%
  .flex-row
    justify-content space-between
    width 100%
  .box-icon
    padding 10px
    font-size 30px
    color var(--grey-color)
    transition color 0.2s
  .box-icon:hover
    color var(--black-color)

.sub-title
  font-size: 26px;
  color: var(--font-title-color);
  font-weight: 550;
  text-align left
  padding 20px
  margin: 0

.image-string
  div
    margin 5px 4px

</style>

