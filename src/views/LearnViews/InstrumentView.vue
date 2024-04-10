<script setup lang="ts">
import {useRoute} from "vue-router";

const route = useRoute()
const affairId = route.params.itemId//事务id
</script>

<template>
  <div>
    {{affairId}}
  </div>
</template>

<style scoped lang="stylus">

</style>