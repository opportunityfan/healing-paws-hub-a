<script setup lang="ts">

import HInput from "@/components/HInput.vue"
import {reactive} from "vue"

let data = reactive<{
  name: string
  description: string | null
  type: string[]
}>({
  name: "",
  description: null,
  type: []
})

</script>

<template>

<div>
  这是管理病例的页面
  <div>
    <div class="title">增加单个病例</div>
    <div class="half-title">输入</div>
    <HInput
      name="name"
      v-model="data.name"
    ></HInput>
  </div>
</div>

</template>

<style scoped lang="stylus">

</style>