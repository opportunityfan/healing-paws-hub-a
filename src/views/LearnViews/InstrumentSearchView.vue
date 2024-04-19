<script setup lang="ts">
import PostPlayerColumnInfinity from "@/components/postPlayerColumnInfinity.vue"
import HSearchBar from "@/components/HSearchBar.vue";
import {goItem, Image, Post} from "@/assets/api";
import axios from "@/assets/axios";
import store from "@/store";

const getInstrumentList = async (info :any) => {
  const newPostList = new Array<Post>()
  await axios.get('/item/page',{
    params:{
      pageNum: info.before_id+1,
      pageSize: info.per_page,
    },
    headers:{
      'token':store.state.token
    }
  }).then(res=>{
    console.log(res.data.data)
    for(let item of res.data.data.listData){
      let tempImage
      if(item.pic === null){
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const image = new Image(require("@/assets/login-background.png"),3035,4299)
        tempImage = image
      }else{
        const image = new Image(item.pic,1,1)
        tempImage = image
      }
      newPostList.push(new Post(item.id,item.name,item.introduction,tempImage))
    }
  }).catch(e=>{
    console.log(e)
  })
  info.before_id++
  return {newInfo : info,newPostList:newPostList}
}
</script>

<template>
  <div class="full flex-column" style="gap: 20px">
    <HSearchBar style="width: 85%" search-url="/item/search" @onEnter="goItem"></HSearchBar>
    <div style="flex-grow: 1;width: 100%; min-height: 0">
      <post-player-column-infinity :get-post-list="getInstrumentList" url-prefix="/item">
      </post-player-column-infinity>
    </div>
  </div>
</template>

<style scoped lang="stylus">

</style>
