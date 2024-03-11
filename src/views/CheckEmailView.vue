<template>
  <div class="check-email-panel">
    <div class="title">Check Your Email</div>
    <div>We have send an email to xxxxxxxxx@xx.com. Please check in to activate your account.</div>
    <div class="hint">
      have account activated?
      <div class="clickable-text" @click="goSignIn">Sign In</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {goto} from "@/assets/api";

const goSignIn = () => {
  goto('/login')
}
</script>

<style scoped lang="stylus">
.check-email-panel
  width 100%
  height 100%
  div
    margin 10px 0
</style>
