<template>
  <div class="full">
    <vue-markdown :source="props.markdown"></vue-markdown>
  </div>
</template>

<script setup lang="ts">
import VueMarkdown from "vue-markdown-render";

// eslint-disable-next-line no-undef
const props = defineProps<{
  markdown: string
}>()
</script>

<style scoped>

</style>
