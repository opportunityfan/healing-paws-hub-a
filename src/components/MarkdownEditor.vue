<template>
  <div class="full editor-main">
    <mavon-editor v-model="data.markdown"></mavon-editor>
  </div>
</template>

<script setup lang="ts">
import {reactive} from "vue";

const data = reactive<{
  markdown: string
}>({
  markdown: ''
})
</script>

<style scoped lang="stylus">
.editor-main
  text-align left
</style>
