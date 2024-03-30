//展示某个事务详情的页面

<script setup lang="ts">

import {onMounted,ref} from "vue";
import FlowDia from "@/components/FlowDia.vue";

const title = ref()
onMounted(()=>{
  const rect = title.value.getBoundingClientRect()
  console.log(rect)
})
</script>

<template>
  <div class="full">
    <div ref="title">shiwuxiangq</div>
    <div class="full">
      <FlowDia></FlowDia>
    </div>
  </div>
</template>

<style scoped lang="stylus">

</style>