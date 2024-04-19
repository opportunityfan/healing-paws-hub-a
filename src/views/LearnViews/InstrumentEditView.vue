<template>
  <div class="full">
    <h-loading :load="onLoad">
      <HScroller :scroll-direction="'column'">
        <div class="flex-column">
          <div class="flex-row" style="width: 100%">
            <div class="flex-column" style="flex: 1">
              <div class="flex-row" style="width: 100%; gap: 20px;margin-top: 10px">
                <div class="text-bold">器械名称</div>
                <HFormInput v-model="data.instrument.name" name="器械名称" style="width: 200px"></HFormInput>
              </div>
              <div class="flex-row" style="width: 100%; gap: 20px;">
                <div class="text-bold">器械简述</div>
                <HFormInput v-model="data.instrument.introduction" name="器械简述" style="width: 200px"></HFormInput>
              </div>
              <div class="flex-row" style="width: 100%; gap: 20px;">
                <div class="text-bold">器械简述</div>
                <HRadio :options="roles" v-model:value="data.instrument.type"></HRadio>
              </div>
            </div>
            <div class="flex-row" style="flex: 1">
              <div class="text-bold" style="flex-shrink: 0; margin-right: 20px">封面编辑</div>
              <div style="position: relative; width: fit-content" class="avatar-box"
                   @mouseenter="onMouseEnterAvatar"
                   @mouseleave="onMouseLeaveAvatar">
                <HImage :image="data.instrument.image" :size="100" :lazy-load="false"></HImage>
                <div :style="{opacity : isMouseOverAvatar ? '1' : '0'}"
                     class="center add-icon" >
                  <HFileUpload @handleFile="handleImage"></HFileUpload>
                </div>
              </div>
            </div>
          </div>
          <div class="text-bold" style="width: 100%;margin-bottom: 20px;margin-top: 10px;text-align: left">器械内容(请使用markdown编写)</div>
          <MarkdownEditor v-model="data.instrument.usage" height="600px"></MarkdownEditor>
          <div class="flex-row" style="justify-content: flex-end; width: 100%; gap: 20px">
            <HButton style="width: 80px" height="40px">取消</HButton>
            <HButton style="width: 80px" height="40px" @click="onSave">保存</HButton>
          </div>
        </div>
      </HScroller>
    </h-loading>
    <HAlert v-model="data.alert">
      <div class="flex-column" style="gap: 10px; text-align: left">
        <div class="flex-row" style="width: 100%">
          <div class="box-icon">
            <i class='bx bx-save'></i>
          </div>
          <div class="text-bold">修改</div>
        </div>
        <div class="text" style="padding-bottom: 20px; width: 100%">你希望保存更改吗？</div>
        <div class="flex-row" style=" width: 100%;gap: 10px; justify-content: flex-end">
          <h-button type="secondary" height="30px" style="margin: 0; width: 60px; font-size: 12px" id="cancel">取消</h-button>
          <h-button height="30px" style="margin: 0; width: 60px; font-size: 12px" @click="onSave" id="confirm">确认</h-button>
        </div>
      </div>
    </HAlert>
  </div>
</template>

<script setup lang="ts">
import MarkdownEditor from "@/components/MarkdownEditor.vue"
import {getInstrument, Image as Img, instrument, setInstrument, onBeforeBack} from "@/assets/api";
import {onMounted, reactive, ref, nextTick} from "vue";
import HLoading from "@/components/HLoading.vue";
import HScroller from "@/components/HScroller.vue";
import HButton from "@/components/HButton.vue";
import HFormInput from "@/components/HFormInput.vue";
import HRadio from "@/components/HRadio.vue";
import HImage from "@/components/HImage.vue"
import HFileUpload from "@/components/HFileUpload.vue"
import HAlert from "@/components/HAlert.vue";

// eslint-disable-next-line no-undef
const props = defineProps<{instrumentId: string}>()

const data = reactive<{
  instrument: instrument
  star : boolean
  complete: boolean
  selectedImage?: File
  alert: boolean
}>({
  instrument : new instrument('', '', '', '', 0, '', ''),
  star : false,
  complete : false,
  alert: false
})

const roles = ref([{
  label: '前台',
  value: 'receptionist'
},{
  label: '医助',
  value: 'assistantDoctor'
},{
  label: '医师',
  value: 'doctor'
}])


const onLoad = async () => {
  await getInstrument(props.instrumentId).then((res) => {
    //data.affairNode = new affairNode('1', '检查仪器', '在检查仪器之前，需要对仪器进行检查。\n\n如果没有对仪器进行检查就没法检查仪器。\n\n具体步骤如下:\n\n1. 检查仪器\n\n2. 检查仪器\n\n3. 检查仪器\n\n4. 检查仪器\n\n', '', '')
    console.log(res)
    if(res !== undefined) data.instrument = res
    if(data.instrument.usage == undefined) data.instrument.usage = ''
  })
  return
}

const onSave = async () => {
  setInstrument(data.instrument, data.selectedImage).then()
}

const isMouseOverAvatar = ref(false)

const onMouseEnterAvatar = () =>{
  isMouseOverAvatar.value = true
}
const onMouseLeaveAvatar = () => {
  isMouseOverAvatar.value = false
}

const handleImage = (image : File) =>{
  console.log(image)
  let imageFile = new Image()
  imageFile.src = window.URL.createObjectURL(image)
  imageFile.onload = () => {
    data.instrument.image = new Img(imageFile.src, imageFile.width, imageFile.height)
  }
  data.selectedImage = image
  // const reader = new FileReader()
  // reader.readAsDataURL(image)
  // reader.onload = () => {
  //   const base64String = reader.result
  //   console.log(base64String)
  //   data.instrument.image = new Img(base64String as string,1,1)
  //   data.selectedImage = image
  // }

}

onMounted(() => {
  onBeforeBack(() => {
    data.alert = true
    return new Promise<boolean>((resolve) => {
      nextTick(() => {
        const confirm = document.getElementById('confirm')
        confirm?.addEventListener('click', () => {
          onSave()
          resolve(true)
        })
        const cancel = document.getElementById('cancel')
        cancel?.addEventListener('click', () => {
          data.alert = false
          resolve(false)
        })
      })
    })
  })
})


</script>

<style scoped>

</style>
