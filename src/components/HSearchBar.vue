<script setup lang="ts">
import { ref, defineEmits, withDefaults, defineProps } from 'vue'
import {tag, autoComplete, goto, goAffair, autoCompleteWXJ} from '@/assets/api';
import { onBeforeRouteUpdate, useRoute } from "vue-router";

const isFocus = ref(false)
const selectPanel = ref(false)
const selectedIndex = ref(-1)

const input = ref<HTMLInputElement>()
const inputValue = ref('')

const autoCompletes = ref<tag[]>([])

const props = withDefaults(defineProps<{
  searchUrl : string
}>(),{

})
const emit = defineEmits(['onEnter'])

inputValue.value = useRoute().query.tags as string || ''
// 根据路由中tags参数，修改搜索框
onBeforeRouteUpdate((to, from, next) => {
  if (to.query.tags) {
    inputValue.value = to.query.tags as string
  } else {
    inputValue.value = ''
  }
  next()
})

const onClick = (e: any) => {
  input.value!.focus()
  isFocus.value = true
  onInput({target: input.value!})
}

const onFocusOut = (e: any) => {
  if (!selectPanel.value) {
    isFocus.value = false
  }
}

const onInput = (e: any) => {
  console.log('onInput', e.target.value)
  isFocus.value = true
  // 补全最后一词
  const value = e.target.value



  if(props.searchUrl === '/affair/fuzzy'){
    autoComplete(props.searchUrl, value).then((res) => {
      autoCompletes.value = res
      selectedIndex.value = 0
    })
  }else{
    autoCompleteWXJ(props.searchUrl,value).then(res => {
      autoCompletes.value = res
      selectedIndex.value = 0
    })
  }
  console.log('搜索框长度',autoCompletes.value.length)
}

const onKeyDown = (e: any) => {
  e.preventDefault()
  if (selectedIndex.value < autoCompletes.value.length - 1) {
    selectedIndex.value += 1
  }
}

const onKeyUp = (e: any) => {
  e.preventDefault()
  if (selectedIndex.value > 0) {
    selectedIndex.value -= 1
  }
}

const onTab = (e: any) => {
  e.preventDefault()
  if (selectedIndex.value >= 0) {
    onSelected(autoCompletes.value[selectedIndex.value])
  }
}

const onEnter = (e: any) => {
  if (selectedIndex.value >= 1) {
    onSelected(autoCompletes.value[selectedIndex.value])
  }
  let id: string
  if(autoCompletes.value.length>=1) {
    id = autoCompletes.value[selectedIndex.value].id
  }else{
    id = ''
  }
  emit('onEnter',id)
  //goAffair(id)
  // 转义+号等特殊字符
  //goto('/search?tags=' + encodeURIComponent(input.value!.value))
}

const onSelected = (item: tag) => {
  console.log('onSelect', item)
  input.value!.focus()
  isFocus.value = true
  // 补全最后一个
  const value = input.value!.value
  const index = value.lastIndexOf(' ')
  input.value!.value = value.substring(0, index + 1) + item.name
}

const onMouseEnter = (index: number) => {
  selectedIndex.value = index
}
</script>

<template>
  <div class="search-div">
    <div class="search-bar">
      <div class="search-form" @click="onClick" @focusout="onFocusOut">
        <svg width="24" height="24" stroke="CurrentColor" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 38C30.3888 38 38 30.3888 38 21C38 11.6112 30.3888 4 21 4C11.6112 4 4 11.6112 4 21C4 30.3888 11.6112 38 21 38Z" fill="none" stroke-width="4" stroke-linejoin="round"/><path d="M26.657 14.3431C25.2093 12.8954 23.2093 12 21.0001 12C18.791 12 16.791 12.8954 15.3433 14.3431" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M33.2216 33.2217L41.7069 41.707" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <input type="text" placeholder="Search" v-model="inputValue"
               @input="onInput" ref="input"
               @keydown.down="onKeyDown"
               @keydown.up="onKeyUp"
               @keydown.enter="onEnter"
               @keydown.tab="onTab"
        />
      </div>

        <div class="search-panel" v-if="isFocus" @mouseenter="selectPanel = true" @mouseleave="selectPanel = false">
          <div v-for="(item, index) in autoCompletes" :key="index"
               :class="['search-panel-item', {'selected': selectedIndex === index}]"
               @click="onSelected(item)"
               @mouseenter="onMouseEnter(index)">
            {{item.name}}
          </div>
        </div>

    </div>
  </div>
</template>

<style scoped lang="stylus">
.search-panel-enter-active {
  animation: search-panel 0.2s;
}

.search-panel-leave-active {
  animation: search-panel 0.2s reverse;
}

@keyframes search-panel {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

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

.search-panel {
  position relative
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  z-index 10
}

.search-panel-item {
  padding: 0 10px;
  width: 100%;
  height: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

/* 同时为item且sleected */
.search-panel-item.selected {
  background: var(--accent-color);
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