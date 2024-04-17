<template>
  <div class="full editor-main">
    <v-md-editor
        v-model="data.markdown"
        :height="props.height"
        left-toolbar="undo redo | h bold italic strikethrough quote | ul ol table hr | link image code video"
        right-toolbar="preview sync-scroll"
        :disabled-menus="[]"
        :toolbar="toolbar"
        @upload-image="handleUploadImage"
    ></v-md-editor>
  </div>
</template>

<script setup lang="ts">
import {defineEmits, onMounted, reactive, watch} from "vue";
import axios from "@/assets/axios";
import store from "@/store";
import { FileSystemFileHandle } from '@vueuse/core'

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

const toolbar = {
  video: {
    title: '插入视频',
    icon: 'bx bx-video',
    action: (editor : any) => {
      window.showOpenFilePicker({
        multiple: false,
        types: [{
          description: '视频文件',
          accept: {
            "video/*" : [".asx", ".asf", ".mpg", ".wmv", ".3gp", ".mp4", ".mov", ".avi", ".flv", ".rmvb"]
          }
        }]
      }).then((res : FileSystemFileHandle[]) => {
        if (res && res[0]) {
          res[0].getFile().then((res) => {
            console.log(res)
            const formData = new FormData()
            formData.append('upload',res)
            axios.post('/affairnode/upload',formData,{
              headers:{
                'token' : store.state.token
              }
            }).then((res)=>{
              console.log(res)
              editor.insert(() => {
                return {
                  text: `<video controls src="${res.data.data}" type="video/*" style="width: 100%"></video>`
                }
              })
            })
          })
        }
      })
    }
  }
}

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
