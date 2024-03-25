<script setup lang="ts">
import {defineProps, reactive, withDefaults, defineEmits, computed, watch} from 'vue'
import * as url from "url";
const props = withDefaults(defineProps<{
  name: string,
  src: string,
  lazy: boolean,
  fit: string
}>(),{
  name: ' ' ,
  lazy: false,
  fit:'cover'
})

const emits = defineEmits(['load','error'])

</script>

<template>
  <div class="image-block">
    <span class="img-background full border-radius-regular flex-container" :style="{'background-image': 'url('+ props.src+')'}">
      <div class="text-inverse">{{ props.name }}</div>
    </span>
  </div>


</template>

<style scoped lang="stylus">


.img-background

  background-repeat no-repeat
  background-size cover
  background-position center

.image-block
  display inline-block

  width 100px
  height 100px
  cursor pointer
  transition all 0.3s ease

.image-block:hover
  transform scale(1.15)
  transition all 0.3s ease
.flex-container
  display flex
  flex-direction column
  justify-content flex-end
</style>