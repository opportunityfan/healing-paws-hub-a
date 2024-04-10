<template>
  <div class="full" >
    <transition
        name="animate__animated animate__fade"
        enter-active-class="animate__fadeIn"
        leave-active-class="animate__fadeOut"
        mode="out-in"
    >
      <div v-if="data.loading" class="loading center">
        <div class="spinner1" style="background-color: var(--theme-color)"></div>
      </div>
      <div v-else class="full">
        <slot name="default"></slot>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive} from "vue";

const data = reactive<{
  loading: boolean
}>({
  loading: true
})

// eslint-disable-next-line no-undef
const props = defineProps<{
  load: () => Promise<void>
}>()

onMounted(() => {
  props.load().then(() => {
    data.loading = false
  })
})
</script>

<style scoped>

</style>
