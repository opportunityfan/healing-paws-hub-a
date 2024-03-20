<template>
  <div style="padding: 10px; width: fit-content; height: fit-content">
    <div class="avatar-box" :style="{backgroundImage: 'url(' + store.state.avatar_url + ')', width: props.size + 'px', height: props.size + 'px'}"></div>
  </div>
</template>

<script setup lang="ts">
import store from "@/store";

// eslint-disable-next-line no-undef
const props = withDefaults(defineProps<{
  size?: number
}>(), {
  size: 40
})
</script>

<style scoped lang="stylus">
.avatar-box
  border-radius 999px
  background-size cover
</style>
