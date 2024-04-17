//搜索事务的界面

<script setup lang="ts">

import HSearch from "@/components/HSearch.vue";
import HSearchBar from "@/components/HSearchBar.vue";
import {goAffair, goAffairSearchView, Image, Post, testaxios} from "@/assets/api";
import HpageTable from "@/components/HpageTable.vue";
import axios from "@/assets/axios";
import store from "@/store";
import {reactive} from "vue";
import PostFlowVertical from "@/components/PostFlowVertical.vue";
import PostFlow from "@/components/PostFlow.vue";
import PostPlayerColumnInfinity from "@/components/postPlayerColumnInfinity.vue";
import HScroller from "@/components/HScroller.vue";

let affairs = reactive<{id:string,name:string}[]>([])
function getAffairs(pageNum : number, pageSize: number){
  axios.get('/affair',{
    params:{
      pageNum: 1,
      pageSize: 5
    },
    headers:{
      'token':store.state.token
    }
  }).then((res) =>{
    for(let item of res.data.data){
      affairs.push({id:item.id as string,name:item.description as string})
    }
  })
}
getAffairs(1,5)
const requestNewAffair = async (count : number) => {
  const newPostList = new Array<Post>()
  await axios.get('/affair',{
    params:{
      pageNum: count,
      pageSize: 5
    },
    headers:{
      'token':store.state.token
    }
  }).then(res=>{
    console.log(res.data.data)
    for(let item of res.data.data){
      let tempImage
      if(item.pic === null){
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const image = new Image(require("@/assets/login-background.png"),3035,4299)
        tempImage = image
      }else{
        const image = new Image(item.pic,item.picSize[0],item.picSize[1])
        tempImage = image
      }

      newPostList.push(new Post(item.id,item.name,item.description,tempImage))
    }
  }).catch(e=>{
    console.log(e)
  })
  return newPostList
}
const getAffairList = async (info :any) => {
  const newPostList = new Array<Post>()
  await axios.get('/affair',{
    params:{
      pageNum: info.before_id+1,
      pageSize: info.per_page
    },
    headers:{
      'token':store.state.token
    }
  }).then(res=>{
    console.log(res.data.data)
    for(let item of res.data.data){
      let tempImage
      if(item.pic === null){
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const image = new Image(require("@/assets/login-background.png"),3035,4299)
        tempImage = image
      }else{
        const image = new Image(item.pic,item.picSize[0],item.picSize[1])
        tempImage = image
      }

      newPostList.push(new Post(item.id,item.name,item.description,tempImage))
    }
  }).catch(e=>{
    console.log(e)
  })
  info.before_id++
  return {newInfo : info,newPostList:newPostList}
}
</script>

<template>

    <div class="full flex-column">
      <HSearchBar style="width: 85%" searchUrl="/affair/fuzzy" @onEnter="goAffair"></HSearchBar>
      <div style="flex-grow: 1;width: 100%; min-height: 0">
        <post-player-column-infinity :get-post-list="getAffairList" >
        </post-player-column-infinity>

      </div>

    </div>
</template>

<style scoped lang="stylus">

.affair-bar
  width 100%
.main-panel
  margin 30px 20px
  width 80%
.left-panel
  flex 1
  padding 0

.right-panel
  flex 1
  margin 0 10px

</style>
