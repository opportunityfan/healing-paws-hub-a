<template>
  <div class="full editor-main">
    <v-md-editor
        v-model="data.markdown"
        :height="props.height"
        left-toolbar="undo redo | h bold italic strikethrough quote | ul ol table hr | link image code"
        right-toolbar="preview sync-scroll"
        :disabled-menus="[]"
        @upload-image="handleUploadImage"
    ></v-md-editor>
  </div>
</template>

<script setup lang="ts">
import {defineEmits, onMounted, reactive, watch} from "vue";
import axios from "@/assets/axios";
import store from "@/store";

// eslint-disable-next-line no-undef
const props = withDefaults(defineProps<{
  modelValue: string,
  height?: string
}>(), {
  height: '100%'
})

const data = reactive<{
  markdown: string
}>({
  markdown: ''
})

const emits = defineEmits(['update:modelValue'])

watch(
    () => props.modelValue,
    (val, preval) => {
      data.markdown = val;
    },
    {
      immediate: true
    }
)

watch(
    () => data.markdown,
    (val, preval) => {
      emits('update:modelValue', val);
    },
    {
      immediate: true
    }
)

const handleUploadImage = (event: any, insertImage: (arg0: { url: any; desc: any; }) => void, files: File[]) => {
 console.log(files)
  if(!files || !files[0]){
    alert('请先选图片')
    return
  }
  const formData = new FormData()
  formData.append('upload',files[0])
  axios.post('/affairnode/upload',formData,{
    headers:{
      'token' : store.state.token
    }
  }).then((res)=>{
    console.log(res)
    insertImage({
      url: res.data.data,
      desc: files[0].name
    })
  })
}
</script>

<style scoped lang="stylus">
.editor-main
  text-align left
</style>

<style lang="stylus">
.v-md-editor
  background-color rgba(0, 0, 0, 0) !important
  color var(--black-color) !important
  box-shadow none !important
  border-top 1px solid #ddd !important
  border-bottom 1px solid #ddd !important
  border-radius 0 !important

.CodeMirror
  background-color rgba(0 ,0 ,0 ,0) !important
  color var(--black-color) !important
.CodeMirror-gutters
  background-color transparent !important

.CodeMirror-activeline-background
  background-color var(--grey-color-bright) !important

.CodeMirror-activeline .CodeMirror-linenumber
    color var(--theme-color) !important

.CodeMirror-selected
  background-color var(--grey-color) !important

.v-md-editor__toolbar-item:hover, .v-md-editor__toolbar-item--active, .v-md-editor__toolbar-item--active:hover
  background var(--grey-color-bright) !important

.github-markdown-body div[class*=v-md-pre-wrapper-]
  background-color var(--grey-color-bright) !important
</style>
