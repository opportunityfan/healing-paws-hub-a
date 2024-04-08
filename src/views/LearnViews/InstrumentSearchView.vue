<script setup lang="ts">

import HSearchBar from "@/components/HSearchBar.vue";
import {goItem} from "@/assets/api";
</script>

<template>
  <div class="full">
    <HSearchBar search-url="/item/search" @onEnter="goItem"></HSearchBar>

  </div>
</template>

<style scoped lang="stylus">

</style>