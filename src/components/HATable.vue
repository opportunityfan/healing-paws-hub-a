<script setup lang="ts">
import {withDefaults, defineProps, defineEmits, reactive} from 'vue'
const props = withDefaults(defineProps<{
  cols : Array<{
    title:string,
    key:string,
    scopedSlots : string
  }>
  dataList : Array<any>
}>(),{
  cols : ()=>[]
})


</script>

<template>
  <div class="main-part">
    <table class="table-layout">
      <thead>
        <tr >
          <th
          v-for="(item,index) in cols"
          :key="index"

          >
            {{item.title}}
          </th>
        </tr>
      </thead>

      <tr
        v-for="(item,index) in dataList"
        :key="index"
        class="item-row"
      >
        <td
          v-for="(v,k) in cols"
          :key="k"
        >
          <template v-if="!v.scopedSlots">{{item[v.key]}}</template>
          <template v-else>
            <slot
              :name="v.scopedSlots"
              :row="item"
              :data="item[v.key]"
            >
            </slot>
          </template>
        </td>

      </tr>
    </table>
  </div>
</template>

<style scoped lang="stylus">

.main-part:hover
  border-color var(--theme-color)
  transition 0.3s


.head-row
  border 2px solid var(--theme-color)

table{
  width 100%
  border-collapse collapse
  border-spacing 0
  empty-cells show
  border-radius 16px
}
table th{
  white-space nowrap
}
table td, table th{
  padding 8px 16px
  border 1px solid var(--theme-color-bright)
  text-align left
}
</style>