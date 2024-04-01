<script setup lang="ts">

import {reactive, withDefaults, defineProps, defineEmits, ref, computed} from "vue";
import HDivider from "@/components/HDivider.vue";
import HInput from "@/components/HInput.vue";

const props = withDefaults(defineProps<{
  itemsPerPage?: number,
  items: Array<{id:string,name:string}>
}>(),{
  itemsPerPage: 10
})
const emit = defineEmits(['itemClick'])
const itemClick = (id: string)=>{
  emit('itemClick',id)
}
const totalPages = computed(()=>{
  return Math.ceil(props.items.length/props.itemsPerPage)
})
const currentPage = ref(1)

const currentPageItems = computed(()=>{
  const start = (currentPage.value - 1)*props.itemsPerPage
  const end = currentPage.value*props.itemsPerPage
  return props.items.slice(start,end)
})

const prePage = ()=>{
  currentPage.value--

}
const nextPage = ()=>{
  currentPage.value++
}
</script>

<template>
  <div class="page-Table">

      <div v-for="item in currentPageItems" :key="item.id" class="item-part" @click="itemClick(item.id)">
        {{item.name}}

      </div>


    <div class="pagination">
      <span class="box-icon button-hover" style="font-size: 16px" @click="prePage">
        <i class='bx bx-chevron-left'></i>
      </span>
      <span>
        {{currentPage}}/{{totalPages}}
      </span>
      <span class="box-icon button-hover" style="font-size: 16px" @click="nextPage">
        <i class='bx bx-chevron-right' ></i>
      </span>
    </div>
  </div>
</template>

<style scoped lang="stylus">
.page-Table
  border 2px solid var(--theme-color-bright)
  border-radius 16px
  width 85%
  margin 20px 0
.page-Table:hover
  border-color var(--theme-color)
  transition 0.3s
.pagination
  display flex
  justify-content center
  margin-top 3px
  font-size 12px
.item-part
  margin 10px 20px
  color var(--font-text-color)
  border-radius 8px
.item-part:hover
  background var(--theme-color)
  transition 0.3s
  cursor pointer
  color var(--font-inverse-color)
</style>