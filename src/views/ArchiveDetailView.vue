<script setup lang="ts">

import {reactive, ref} from "vue";
import {useRoute} from "vue-router";
import axios from "@/assets/axios";
import store from "@/store";
import HButton from "@/components/HButton.vue";

const route = useRoute()
console.log(route.params.archiveId)

let archiveInfo = reactive({})

function getArchiveDetailsById() {
  axios.get("/case", {
    params: {
      id: route.params.archiveId
    },
    headers:{
      'token':store.state.token
    }
  }).then((res)=>{
    Object.assign(archiveInfo, res.data.data)
    console.log(archiveInfo)
  })
}

getArchiveDetailsById()

</script>

<template>
  <div>
    这是病例详细信息页面
    <br>
    <br>
    <div class="flex-column">
      <div>
        <span>id: {{archiveInfo.id}}</span><br>
        <span>name: {{archiveInfo.name}}</span><br>
        <span>type: {{archiveInfo.type}}</span><br>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>