<script setup lang="ts">
import {defineEmits, defineProps, reactive, withDefaults} from "vue";
import {tag} from "@/assets/api";

const props = withDefaults(defineProps<{
  itemsPerPage?: number,
  totalPages? :number,

  //requestItems : (pageNum : number, pageSize : number) => Promise<tag[]>
}>(),{
  itemsPerPage: 10,
  totalPages: 10,
})

const data = reactive<{

  requesting: boolean
  currentPage : number
}>({

  requesting: false,
  currentPage : 1
})
const prePage = ()=>{
  if(data.currentPage > 1) {
    data.currentPage--
    emit('onPageChange',data.currentPage,props.itemsPerPage)
  }
}
const nextPage = ()=>{
  if (data.currentPage < props.totalPages) {
    data.currentPage++
    emit('onPageChange',data.currentPage,props.itemsPerPage)
  }
}
const emit = defineEmits(['onPageChange'])
</script>

<template>


    <div class="pagination">
        <span class="box-icon button-hover" style="font-size: 16px" @click="prePage">
          <i class='bx bx-chevron-left'></i>
        </span>
      <span>
          {{data.currentPage}}/{{totalPages}}
        </span>
      <span class="box-icon button-hover" style="font-size: 16px" @click="nextPage">
          <i class='bx bx-chevron-right' ></i>
        </span>
    </div>

</template>

<style scoped lang="stylus">
.pagination
  display flex
  justify-content center
  margin-top 3px
  font-size 12px
</style>