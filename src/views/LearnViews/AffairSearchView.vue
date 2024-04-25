//搜索事务的界面

<script setup lang="ts">
import HSearchBar from "@/components/HSearchBar.vue";
import {goAffair, goAffairSearchView, Image, Post, showMessage, testaxios} from "@/assets/api";
import axios from "@/assets/axios";
import store from "@/store";
import PostPlayerColumnInfinity from "@/components/postPlayerColumnInfinity.vue";
import HRadio from "@/components/HRadio.vue";
import {reactive} from "vue";

const data = reactive<{
  learned : number
}>({
  learned : 2
})

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
        if (item.affair.pic === null) {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const image = new Image(require("@/assets/login-background.png"), 3035, 4299)
          tempImage = image
        } else {
          const image = new Image(item.affair.pic, item.affair.picSize[0], item.affair.picSize[1])
          tempImage = image
        }
        newPostList.push(new Post(item.affair.id, item.affair.name, item.affair.description, tempImage, item.flag))
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

const getAffairList0 = async (info :any) => {
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
        if (item.affair.pic === null) {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const image = new Image(require("@/assets/login-background.png"), 3035, 4299)
          tempImage = image
        } else {
          const image = new Image(item.affair.pic, item.affair.picSize[0], item.affair.picSize[1])
          tempImage = image
        }
        if (item.flag == false) {
          newPostList.push(new Post(item.affair.id, item.affair.name, item.affair.description, tempImage, item.flag))
        }
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

const getAffairList1 = async (info :any) => {
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
        if (item.affair.pic === null) {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const image = new Image(require("@/assets/login-background.png"), 3035, 4299)
          tempImage = image
        } else {
          const image = new Image(item.affair.pic, item.affair.picSize[0], item.affair.picSize[1])
          tempImage = image
        }
        if (item.flag == true) {
          newPostList.push(new Post(item.affair.id, item.affair.name, item.affair.description, tempImage, item.flag))
        }
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

const options = [{
  label: '已学习',
  value: 1
}, {
  label: '未学习',
  value: 0
}, {
  label: '全部',
  value: 2
}]
</script>

<template>
    <div class="full flex-column" style="gap: 20px">
      <div class="flex-row" style="width: 100%; gap: 20px">
        <HSearchBar style="width: 85%" searchUrl="/affair/fuzzy" @onEnter="goAffair"></HSearchBar>
        <HRadio :options="options" v-model:value="data.learned" style="flex-shrink: 0"></HRadio>
      </div>
      <div style="flex-grow: 1;width: 100%; min-height: 0">
        <post-player-column-infinity :get-post-list="getAffairList" url-prefix="/affair/" v-if="data.learned === 2">
        </post-player-column-infinity>
        <post-player-column-infinity :get-post-list="getAffairList0" url-prefix="/affair/" v-if="data.learned === 0">
        </post-player-column-infinity>
        <post-player-column-infinity :get-post-list="getAffairList1" url-prefix="/affair/" v-if="data.learned === 1">
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
