//搜索事务的界面

<script setup lang="ts">

import HSearch from "@/components/HSearch.vue";
import HSearchBar from "@/components/HSearchBar.vue";
import {goAffair, goAffairSearchView} from "@/assets/api";
import HpageTable from "@/components/HpageTable.vue";

const affairs = [{id:'1',name:'item1'},{id:'2',name:'item2'},{id:'3',name:'item3'}]
</script>

<template>
  <div style="width: 100%">
    <HSearchBar style="width: 85%"></HSearchBar>
    <div>
      <HpageTable :items="affairs" itemsPerPage=2></HpageTable>
      <span class="clickable-text" @click="goAffair">临时跳转到事务页面</span>
    </div>
  </div>
</template>

<style scoped lang="stylus">

</style>