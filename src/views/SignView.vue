<template>
  <div class="sign-main full padding-surround">
    <div class="sign-panel center">
      <router-view v-slot="{ Component }">
        <transition
          name="animate__animated animate__fade"
          enter-active-class="animate__fadeInLeft"
          leave-active-class="animate__fadeOutRight"
          mode="out-in"
        >
          <component :is="Component"></component>
        </transition>
      </router-view>
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
  --animate-duration 0.5s
</style>
