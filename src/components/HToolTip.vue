<script setup lang="ts">
import {withDefaults, defineProps} from 'vue'
const props = withDefaults(defineProps<{
  x : number
  y : number
  content : string
}>(),{
  content:'测试哟'
})
</script>

<template>
  <div class="tooltip" :style="{ top: `${y}px`, left: `${x}px` }">
    <div class="arrow"></div>
    <div class="content">{{ content }}</div>
  </div>
</template>

<style scoped lang="stylus">
.tooltip
  position absolute

.arrow
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 20px solid #9FB66B; /* 尖角颜色 */
  position: absolute;
  top: -20px; /* 根据需要调整 */
  left: 20%;
  transform: translateX(-50%);

.content
  padding: 10px;
  background-color: #fff;
  border: 1px solid #ccc;
</style>