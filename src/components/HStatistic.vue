<template>
  <div class="hint">
    <i class="bx bxs-trophy"></i>
    {{ data.study }}
    |
    <i class='bx bxs-star'></i>
    {{ data.star }}
    |
    {{ data.date }}
  </div>
</template>

<script setup lang="ts">
import {reactive} from "vue";

const data = reactive<{
  star: number
  study: number
  date: string
}>({
  star: 34,
  study: 60,
  date: '2024-2-22'
})
</script>

<style scoped>

</style>
