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
    <div class="search-border">

      <div class="placeholder" v-if="(data.empty && !data.focus)">Search...</div>
      <input class="search-field" v-model="data.content" @blur="onBlur" @focus="onFocus">
    </div>
  </div>
</template>

<style scoped lang="stylus">
.search-main
  width 200px
  height 30px
  position relative
  margin 20px 0

.search-border
  position relative
  height 100%
  margin 5px
  border-radius 5px
  border var(--object-unfocus-color) 1.5px solid
  transition border-color 0.1s
.search-border:focus-within
  border var(--theme-color) 1.5px solid

.search-field
  height 90%
  margin-left 10px
  background var(--background-color)
.placeholder
  position absolute
  color var(--font-subject-color)
  font-size 14px
  top: 50%
  left: 10px
  transform  translate(0, -50% - 2px)
  z-index 1
</style>