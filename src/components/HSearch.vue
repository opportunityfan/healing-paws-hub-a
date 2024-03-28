<script setup lang="ts">

import {reactive,defineProps,withDefaults,watch} from "vue";

const props = withDefaults(defineProps<{
  modelValue: string
}>(),{
  modelValue:''
})
const data = reactive<{
  content: string
  focus: boolean
  empty: boolean
}>({
  content: '',
  focus: false,
  empty: true
})

watch(
    () => props.modelValue,
    (val, preval) => {
      data.content = val;
      if (val !== '')
        data.empty = false
      else data.empty = true
    },
    {}
)
const onBlur = () => {
  data.focus = false

}
const onFocus = () => {
  data.focus = true
}
</script>

<template>
  <div class="search-main" style="margin: 0 0">

    <div class="search-border flex-row">
      <div class="box-icon">
        <i class='bx bx-search icon-color' ></i>
      </div>
      <div class="placeholder" v-if="(data.empty && !data.focus)">Search...</div>
      <input class="search-field" v-model="data.content" @blur="onBlur" @focus="onFocus">
    </div>
  </div>
</template>

<style scoped lang="stylus">
.search-main
  width 100%
  height 25px
  position relative
  margin 0 0
  z-index 0

.search-border
  position relative
  height 100%
  margin 3px 0
  border-radius 5px
  border var(--object-unfocus-color) 1.5px solid
  transition border-color 0.1s

.search-border:focus-within
  border var(--theme-color) 1.5px solid

.search-field
  height 90%

  background rgba(0,0,0,0)

.placeholder
  position absolute
  color var(--font-subject-color)
  font-size 14px
  top: 50%
  left: 22px
  transform  translate(0, -50% - 2px)
  z-index -1

.icon-color
  color var(--object-unfocus-color)

</style>