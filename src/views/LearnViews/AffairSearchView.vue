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
      pageNum: 1,
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
</script>

<template>

    <div class="main-panel full">
      <HSearchBar style="width: 85%" searchUrl="/affair/fuzzy" @onEnter="goAffair"></HSearchBar>
      <div class="affair-bar" style="height: 100%">
        <PostFlowVertical :request-new-post="requestNewAffair" style="flex-grow: 1" width="300"></PostFlowVertical>
      </div>
    </div>
</template>

<style scoped lang="stylus">
.main-panel
  justify-content space-evenly
.affair-bar
  width 100%
</style>
