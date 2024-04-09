<script setup lang="ts">

import HButton from "@/components/HButton.vue";
import {goto} from "@/assets/api";

const goAffairManage = () =>{
  goto('/affairManageSearch')
}
</script>

<template>
  <div class="full">
    <div >
      <HButton @click="goAffairManage" style="width: 200px;">事务管理</HButton>
    </div>
  </div>
</template>

<style scoped lang="stylus">

</style>