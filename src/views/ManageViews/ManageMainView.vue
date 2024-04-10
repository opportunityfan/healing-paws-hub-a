<template>
  <div class="full">
    <router-view></router-view>
    <bottom-bar></bottom-bar>
  </div>
</template>

<script setup lang="ts">
import {goto} from "@/assets/api";
import BottomBar from "@/components/BottomBar.vue";

const goAffairManage = () =>{
  goto('/affairManageSearch')
}
</script>


<style scoped lang="stylus">

</style>
