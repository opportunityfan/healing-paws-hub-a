<script setup lang="ts">

import {reactive, withDefaults, defineProps, defineEmits, ref, computed, watch, onMounted, defineExpose} from "vue";
import HDivider from "@/components/HDivider.vue";
import HInput from "@/components/HInput.vue";
import {tag} from "@/assets/api";
import HLoading from "@/components/HLoading.vue";

const props = withDefaults(defineProps<{
  itemsPerPage?: number,
  totalPages? :number
  requestItems : (pageNum : number, pageSize : number) => Promise<tag[]>
}>(),{
  itemsPerPage: 10,
  totalPages: 10
})

const data = reactive<{
  tagList: tag[]
  requesting: boolean
}>({
  tagList: [],
  requesting: false
})
const emit = defineEmits(['itemClick','itemClick-Index'])
const itemClick = (id: string,index : number)=>{
  emit('itemClick',id)
  emit('itemClick-Index',index)
}

const currentPage = ref(1)

const prePage = ()=>{
  if(currentPage.value > 1) {
    currentPage.value--
  }
}
const nextPage = ()=>{
  if (currentPage.value < props.totalPages) {
    currentPage.value++
  }
}

// onMounted(() => {
//   data.tagList.length=0
//   data.requesting = true
//   props.requestItems(currentPage.value,props.itemsPerPage).then(res=>{
//
//     res.forEach((tag) =>{
//       data.tagList.push(tag)
//     })
//   }).finally(()=>{
//     data.requesting = false
//   })
// })

const onLoad = async () => {
  data.tagList.length=0
  data.requesting = true
  props.requestItems(currentPage.value,props.itemsPerPage).then(res=>{

    res.forEach((tag) =>{
      data.tagList.push(tag)
    })
  }).finally(()=>{
    data.requesting = false
  })
}

watch(
    () => currentPage.value,
    (val,preval) => {
      update()
    }
)
const update = () =>{
  data.tagList.length=0
  data.requesting = true
  props.requestItems(currentPage.value,props.itemsPerPage).then(res=>{

    res.forEach((tag) =>{
      data.tagList.push(tag)
    })
  }).finally(()=>{
    data.requesting = false
  })
}
defineExpose({update})
</script>

<template>
  <h-loading :load="onLoad">
    <div class="page-Table">
        <div v-for="(item, index) in data.tagList" :key="index" class="item-part" @click="itemClick(item.id,index)" >
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
  </h-loading>
</template>

<style scoped lang="stylus">
.page-Table
  border 2px solid var(--theme-color-bright)
  border-radius 16px
  width 100%
  margin 0px 0
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