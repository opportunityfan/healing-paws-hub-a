<template>
  <div>
    这是病例查询结果页面
    <div class="flex-column">
      <div class="flex-row">
        <HImage :image="image" @click="goArchiveDetails"></HImage>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import HImage from "@/components/HImage.vue";
import {Image} from "@/assets/api";
import {reactive, ref} from "vue";
import {goto} from "@/assets/api";


// eslint-disable-next-line @typescript-eslint/no-var-requires
let image = new Image(require("@/assets/login-background.png"), 1, 1)


function goArchiveDetails(){
  goto('/archiveDetail')
  console.log("进入病例详情界面")
}

</script>

<style scoped>

</style>