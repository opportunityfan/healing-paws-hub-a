<script setup lang="ts">

import {reactive, ref} from "vue";
import HImage from "@/components/HImage.vue";
import {goBack, goRoleSelect, goto, Image} from "@/assets/api";
import HDivider from "@/components/HDivider.vue";
import HButton from "@/components/HButton.vue";
import axios from "@/assets/axios";
import store from "@/store";

const roles =reactive<{
  role : string
  image: Image
}[]>([

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  {role:'前台',image: (new Image(require("@/assets/receptionist.png"),0.618,1))},
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  {role:'医助',image: (new Image(require("@/assets/assistant.png"),0.618,1))},
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  {role:'医师',image: (new Image(require("@/assets/doctor.png"),0.618,1))}
])

const hintMessages = ['您选择了前台人员哦','您选择了医助哦','您选择了医生哦',' ']
const roleSelected = ref(3)
const onSelect = (index: number) => {
  if(index === roleSelected.value){
    roleSelected.value = 3
  }
  else{
    roleSelected.value = index
  }

}

const ConfirmSelected = () => {

  console.log('确认选择')
}
const chooseRole = () => {
  axios.post('/sysUser/setPermission',{},{
    params:{
      permission:roles[roleSelected.value].role
    },
    headers:{
      'Content-Type' : 'application/json',
      'token': store.state.token
    }
  }).then((res)=>{
    if(res.data.code===200){
      store.state.role = roles[roleSelected.value].role
      console.log(res.data)
      goBack()
    }
  })
}
const submit = () =>{
  if(roleSelected.value !== 3){
    console.log()
    chooseRole()
  }

}
const isSubmitDisabled = ref(true)
</script>

<template>
  <div class="full">
    <div class="role-flow-bar flex-row">
      <div v-for="(role, index) in roles" :key="index" >
        <HImage :image="role.image" size="140" class="image-block" :class="{ 'image-block-selected' : roleSelected === index}" @click="onSelect(index)" ></HImage>
        <div style="margin: 20px 0">{{ role.role }}</div>
        <HDivider ></HDivider>
      </div>
    </div>
    <div class="text hint-message" :style="{height: roleSelected === 3 ? '0' :'16px'}">

      {{hintMessages[roleSelected]}}
    </div>
    <div class="item-center">
      <HButton height="35px" style="width: 120px" @click="submit" >确认选择</HButton>
    </div>
    <div style="margin-top: -20px;" >
      <span class="hint">角色修改后可以随时修改哦</span>
    </div>
  </div>
</template>

<style scoped lang="stylus">

.role-flow-bar
  margin 25px 20px
  justify-content space-between

.image-block
  border-radius 16px
  overflow hidden
  border 2px solid var(--theme-color-bright)
.image-block-selected
  border-width 2px
  border-color var(--accent-color-dark)
  transform scale(1.2)
.hint-message
  transition all 0.3s
  overflow hidden
</style>