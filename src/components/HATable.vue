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
    <table>
      <template v-if="props.dataList.length>0">
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
          :class="{ operation : v.scopedSlots === 'Operation'}"
        >
          <template v-if="!v.scopedSlots">{{item[v.key]}}</template>
          <template v-else>
            <slot
              :name="v.scopedSlots"
              :row="item"
              :rowIndex="index"
              :data="item[v.key]"
            >
            </slot>
          </template>
        </td>

      </tr>
      </template>
      <template v-else>

          <slot name="empty">

          </slot>

      </template>
    </table>
  </div>
</template>

<style scoped lang="stylus">

.main-part:hover
  transition 0.3s
  table{
    border-color var(--theme-color)
  }

.head-row
  border 1.2px solid var(--theme-color)

table{
  width 100%
  border-spacing 0
  empty-cells show
  border 1.2px solid var(--theme-color-bright)
}
table th{
  white-space nowrap
}
table td, table th{
  padding 6px 12px
  border 1.2px solid var(--theme-color-bright)
  text-align center
  font-size 14px
}
tr{
  width 100%
}
.operation
  width 100px
</style>