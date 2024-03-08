<template>
  <div class="registry-main full padding-surround">
    <div class="registry-panel center">
      <div class="title">Sign up</div>
      <div class="hint">Sign up to enjoy the feature of Paw</div>
      <HInput name="NickName"></HInput>
      <HInput name="Email"></HInput>
      <HInput :password="true" name="password"></HInput>

      <HDivider>Test HDivider</HDivider>

    </div>
  </div>
</template>

<script setup>
import HInput from "@/components/HInput.vue";
import HDivider from "@/components/HDivider.vue";

</script>



<style scoped lang="stylus">
.registry-main
  padding-left 20px
  box-sizing border-box
  position relative

.registry-panel
  width 300px
  height 600px
  text-align left
  div
    margin 10px 0
</style>