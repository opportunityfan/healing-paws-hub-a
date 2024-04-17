<script setup lang="ts">

import HImage from "@/components/HImage.vue";
import HFileUpload from "@/components/HFileUpload.vue";
import {ref, withDefaults, defineProps, reactive, defineExpose} from "vue";
import {Image as Img} from "@/assets/api";

const props = withDefaults(defineProps<{
  image : Img
}>(),{

})
const data = reactive<{
  image : Img,
  pic : string
}>({
  image : props.image,
  pic : ''
})
const isMouseOverAvatar = ref(false)
const picFile = ref()
const getPicFile = ()=>{
  return picFile
}
defineExpose([{
  getPicFile
}])

const onMouseEnterAvatar = () =>{
  isMouseOverAvatar.value = true
}
const onMouseLeaveAvatar = () => {
  isMouseOverAvatar.value = false
}
const handleImage = (image : File) =>{
  console.log('图片文件信息',image)
  let imageFile = new Image()
  imageFile.src = window.URL.createObjectURL(image)
  imageFile.onload = () => {
    data.image = new Img(imageFile.src, imageFile.width, imageFile.height)
  }
  data.pic= image.path
  picFile.value = image
}
</script>

<template>
  <div style="position: relative; width: fit-content" class="avatar-box"
       @mouseenter="onMouseEnterAvatar"
       @mouseleave="onMouseLeaveAvatar">
    <HImage :image="data.image" :size="100" :lazy-load="false"></HImage>
    <div :style="{opacity : isMouseOverAvatar ? '1' : '0'}"
         class="center add-icon" >
      <HFileUpload @handleFile="handleImage"></HFileUpload>
    </div>
  </div>
</template>

<style scoped lang="stylus">

</style>