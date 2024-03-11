<template>
  <div class="sign-main full padding-surround">
    <div class="sign-panel center">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: "SignView"
}
</script>

<style scoped lang="stylus">
.sign-main
  padding-left 20px
  box-sizing border-box
  position relative

.sign-panel
  width 300px
  height 500px
  text-align left
</style>
