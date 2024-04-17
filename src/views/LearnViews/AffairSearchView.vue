//搜索事务的界面

<script setup lang="ts">
import HSearchBar from "@/components/HSearchBar.vue";
import {goAffair, goAffairSearchView, Image, Post, showMessage, testaxios} from "@/assets/api";
import axios from "@/assets/axios";
import store from "@/store";
import PostPlayerColumnInfinity from "@/components/postPlayerColumnInfinity.vue";

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
    if(res.data.code==200) {
      for (let item of res.data.data.listData) {
        let tempImage
        if (item.pic === null) {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const image = new Image(require("@/assets/login-background.png"), 3035, 4299)
          tempImage = image
        } else {
          const image = new Image(item.pic, item.picSize[0], item.picSize[1])
          tempImage = image
        }

        newPostList.push(new Post(item.id, item.name, item.description, tempImage))
      }
    }else{
      showMessage(`${res.data.msg}`,'error')
    }
  }).catch(e=>{
    showMessage('网络错误','error')
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
