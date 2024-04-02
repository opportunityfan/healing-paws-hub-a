//搜索事务的界面

<script setup lang="ts">

import HSearch from "@/components/HSearch.vue";
import HSearchBar from "@/components/HSearchBar.vue";
import {goAffair, goAffairSearchView, testaxios} from "@/assets/api";
import HpageTable from "@/components/HpageTable.vue";
import axios from "@/assets/axios";
import store from "@/store";
import {reactive} from "vue";

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

</script>

<template>
  <div style="width: 100%">
    <HSearchBar style="width: 85%" searchUrl="/affair/fuzzy" @onEnter="goAffair"></HSearchBar>
    <div>
      <HpageTable :items="affairs" itemsPerPage=2 @itemClick="goAffair"></HpageTable>
    </div>
  </div>
</template>

<style scoped lang="stylus">

</style>
