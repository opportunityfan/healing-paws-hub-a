<script setup lang="ts">

import axios from "@/assets/axios";
import store from "@/store";
import {reactive} from "vue";


const chooseRole = () => {
  axios.post('/sysUser/setPermission',{},{
    params:{
      permission:'前台'
    },
    headers:{
      'Content-Type' : 'application/json',
      'token': store.state.token
    }
  }).then((res)=>{

    console.log(res.data)
  })
}
</script>

<template>
  <div>
    <button @click="chooseRole">选角色</button>
  </div>
</template>

<style scoped lang="stylus">

</style>