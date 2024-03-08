<template>
  <div class="input-main"></div>
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
  height 30px;
  border var(--theme-color) 1px solid

</style>
