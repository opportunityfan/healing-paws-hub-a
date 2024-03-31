<script setup lang="ts">

</script>

<template>

    <div class="full" style="position: relative">
      <transition
          name="animate__animated animate__fade"
          enter-active-class="animate__fadeIn"
          leave-active-class="animate__fadeOut"
          mode="out-in"
      >
        <router-view/>
      </transition>
    </div>

</template>

<style scoped lang="stylus">

</style>
