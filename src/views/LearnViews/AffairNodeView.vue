<script setup lang="ts">
import {useRoute} from "vue-router";
const route = useRoute()
const nodeId = route.params.nodeId

</script>

<template>
  <div>
    {{nodeId}}
  </div>
</template>

<style scoped lang="stylus">

</style>