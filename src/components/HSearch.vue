<script setup lang="ts">

import {reactive,defineProps,withDefaults,watch,defineEmits} from "vue";

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
const emit = defineEmits(['update:modelValue','onEnter'])

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
watch(
    () => data.content,
    (val,preval) => {
      if(val != '')
        data.empty = false
      else data.empty = true
      emit('update:modelValue',val)
    }
)
const onBlur = () => {
  data.focus = false

}
const onFocus = () => {
  data.focus = true
}
const onEnter = (e: any) => {

  emit('onEnter')
  //goAffair(id)
  // 转义+号等特殊字符
  //goto('/search?tags=' + encodeURIComponent(input.value!.value))
}
</script>

<template>
  <div class="search-div">
    <div class="search-bar">
      <div class="search-form">
        <svg width="24" height="24" stroke="CurrentColor" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 38C30.3888 38 38 30.3888 38 21C38 11.6112 30.3888 4 21 4C11.6112 4 4 11.6112 4 21C4 30.3888 11.6112 38 21 38Z" fill="none" stroke-width="4" stroke-linejoin="round"/><path d="M26.657 14.3431C25.2093 12.8954 23.2093 12 21.0001 12C18.791 12 16.791 12.8954 15.3433 14.3431" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M33.2216 33.2217L41.7069 41.707" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <input type="text" placeholder="Search" v-model="data.content"
               @keydown.enter="onEnter"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="stylus">
.search-div {
  width: 100%;
  height: 34px;
  position: relative;
  background: var(--background-color);
  border-radius: 999px;
  z-index 10
}

.search-bar {
  top: 0;
  width: 100%;
  height: auto;
  position: relative;
  background: var(--background-color);
  border-radius: 15px;
  overflow: hidden;
  transition: border 0.1s;
  border: 2px solid var(--theme-color-bright);
}

/* 判断是否为搜索状态 */
.search-bar:hover, .search-bar:focus-within {
  border: 2px solid var(--accent-color);
}

.search-form {
  width: 100%;
  height: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
input {
  position: relative;
  width: calc(100% - 30px);
  height: 100%;
  background-color: rgba(0,0,0,0);
  border: none;
  margin: auto;
  color: inherit;
  font-family: inherit;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0.25px;
  z-index: 10;
  top: -0.5px;
}
input:focus-visible {
  outline: none;
}
input::-webkit-input-placeholder {
  color: inherit;
  opacity: 0.7;
}
svg {
  width: 20px;
  height: 20px;
  padding-left: 10px;
  padding-right: 5px;
}
</style>