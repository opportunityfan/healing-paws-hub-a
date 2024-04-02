<template>
  <div class="full" style="text-align: left">
    <v-md-preview :text="props.markdown"></v-md-preview>
  </div>
</template>

<script setup lang="ts">

// eslint-disable-next-line no-undef
const props = defineProps<{
  markdown: string
}>()
</script>

<style scoped>

</style>
