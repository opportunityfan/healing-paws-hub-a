<script setup lang="ts">

import RoleSelectPanel from "@/components/RoleSelectPanel.vue";
</script>

<template>
  <div class="full">
    <div class="title-with-hint">
      <div class="title">角色选择</div>
      <div class="hint">请选择您的角色吧</div>
    </div>
    <div class="full">
      <RoleSelectPanel>

      </RoleSelectPanel>
    </div>
  </div>
</template>

<style scoped lang="stylus">
.title-with-hint
  text-align center


</style>