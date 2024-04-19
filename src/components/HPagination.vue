<script setup lang="ts">
import {defineEmits, defineProps, reactive, withDefaults} from "vue";
import {tag} from "@/assets/api";
import HButton from "@/components/HButton.vue";
import HFormInput from "@/components/HFormInput.vue";

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
        <HButton class="box-icon button-hover page-button" height="20px" style="font-size: 20px" @click="prePage">
          <i class='bx bx-chevron-left'></i>
        </HButton>
<!--      <HFormInput name="页码" v-model="data.currentPage" style="height: 26px;width: 24px"></HFormInput>-->
        <span style="display: inline-block;line-height: 26px;">
          {{data.currentPage}}/{{totalPages}}
        </span>
      <HButton class="box-icon button-hover page-button" height="20px" style="font-size: 20px" @click="nextPage">
          <i class='bx bx-chevron-right' ></i>
        </HButton>
    </div>

</template>

<style scoped lang="stylus">
.pagination
  display flex
  justify-content center
  margin-top 3px
  font-size 14px

.page-block
  border 1px solid var(--theme-color)

.page-button
  width 24px
  margin 3px 4px
</style>