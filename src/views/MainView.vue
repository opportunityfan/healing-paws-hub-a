<script setup lang="ts">

</script>

<template>
  <div class="full" style="position: relative; --animate-duration: 0.3s">
    <router-view v-slot="{ Component }">
      <transition
          name="animate__animated animate__fade"
          enter-active-class="animate__fadeIn"
          leave-active-class="animate__fadeOut"
          mode="out-in"
      >
        <component :is="Component"></component>
      </transition>
    </router-view>
  </div>
</template>

<style scoped lang="stylus">

</style>
