<template>
  <div>
    <slot name="default"></slot>
  </div>
</template>

<script setup lang="ts">

// eslint-disable-next-line no-undef
const props = defineProps<{
  modelValue: boolean
}>()
</script>

<style scoped>

</style>
