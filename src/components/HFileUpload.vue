<script setup lang="ts">

import {ref,defineEmits} from "vue";
import axios from "@/assets/axios";
import store from "@/store";

const fileInput = ref<HTMLInputElement>()
const emit = defineEmits(['handleFile'])
const clickFileInput = () => {
  fileInput.value?.click()
}

const selectedFile = ref()
const handleImage = (event : any) =>{
  const files = event.target.files || event.dataTransfer.files
  if(!files.length) return;
  selectedFile.value = files[0]
  emit('handleFile',selectedFile.value)
  console.log('handleImage')
}

</script>

<template>
  <div style="display: flex">
    <input type="file" accept="image/*" @change="handleImage" ref="fileInput" style="display: none"/>
    <div  class="file-input">
      <i class='bx bx-plus file-select' @click="clickFileInput"></i>
    </div>

  </div>
</template>

<style scoped lang="stylus">
.file-input
  display flex
  flex-direction row

.file-select
  font-size 100px
  cursor pointer
</style>