<template>
  <div class="input-main">
    <div class="input-name">{{ props.name }}</div>
    <div class="input-border"></div>
  </div>
</template>

<script setup lang="ts">
import {defineProps, withDefaults} from 'vue'
const props = withDefaults(defineProps<{
  name: string
  password: boolean
}>() , {
  password: false
});
</script>

<style scoped lang="stylus">
.input-main
  width 100%
  height 50px
  padding-top 5px
  padding-bottom 5px

.input-name
  position absolute
  color var(--object-unfocus-color)
  font-size 10px;

.input-border
  border-radius 5px
  border var(--object-unfocus)
</style>
