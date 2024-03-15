<script setup lang="ts">

import HInput from "@/components/HInput.vue";
import HDivider from "@/components/HDivider.vue";
import HSearch from "@/components/HSearch.vue";
</script>

<template>
  <div class="main-panel border-radius-regular">
    <HDivider></HDivider>
    <div class = "sub-title" >
      事务学习
    </div>
  </div>
</template>

<style scoped lang="stylus">

.main-panel
  width 100%
  height 100%
  //background var(--theme-color-bright)
  div
    margin 10px 10px
.sub-title
  font-size: 26px;
  color: var(--font-title-color);
  font-weight: 550;
  text-align left
  margin 10px
</style>