<script setup lang="ts">

import axios from "@/assets/axios";
import store from "@/store";
import {reactive, ref, watch} from "vue";
import HInput from "@/components/HInput.vue";
import HButton from "@/components/HButton.vue";
import HAvatar from "@/components/HAvatar.vue";
import {getUserInfo, goRoleSelect} from "@/assets/api";
import HFileUpload from "@/components/HFileUpload.vue";
const data = reactive<{
  account : string
  userName : string,
  password : string,
  confirmPassword : string
  picked : string
}>({
  account : '',
  userName : store.state.nick_name,
  password : '',
  confirmPassword : '',
  picked : ''
})
const ispasswordSame = ref(true)
const isMouseOverAvatar = ref(false)
const onMouseEnterAvatar = () =>{
  isMouseOverAvatar.value = true
}
const onMouseLeaveAvatar = () => {
  isMouseOverAvatar.value = false
}

const updateUserData = async () =>{
  const bodyData = {
    account:data.account,
    password:'',
    userName:data.userName
  }
  if(ispasswordSame.value){
    bodyData.password = data.confirmPassword
  }
  await axios.post('/sysUser/update',bodyData,{
    headers:{
      'token':store.state.token
    }
  }).then((res)=>{
    console.log(res.data)
  })
  let res = getUserInfo()
  console.log(res)
}
const upLoadImage = async (image : File) => {
  if(!image){
    alert('请先选图片')
    return
  }
  const formData = new FormData()
  formData.append('avatar',image)
  await axios.post('/sysUser/setAvatar',formData,{
    headers:{
      'token' : store.state.token
    }
  }).then((res)=>{
    console.log(res.data)
    store.state.avatar_url = res.data.data
  })
}
watch(
    () => data.confirmPassword,
    (val,preval) => {
      if(val !== data.password){
        ispasswordSame.value = false
      }else{
        ispasswordSame.value = true
      }
    }
)

</script>

<template>
  <div class="main-panel full">
    <div class="left-panel">
      <div class="module">
        <div class="sub-title">
          昵称
        </div>
        <HInput name="userName" v-model="data.userName" height="25px" @keydown.enter="updateUserData"></HInput>
        <div class="hint">这里可以修改你的昵称哦</div>
      </div>
      <div class="module">
        <div class="sub-title">
          账号
        </div>
        <HInput name="account" v-model="data.account" height="25px" @keydown.enter="updateUserData"></HInput>
        <div class="hint">这里可以修改你的账号哦</div>
      </div>
      <div class="module">
        <div class="sub-title">
          密码
        </div>
        <HInput name="Password" v-model="data.password" height="25px" ></HInput>
        <HInput name="ConfirmPassword" v-model="data.password" height="25px" ></HInput>
        <div class="hint">这里可以修改你的密码哦</div>
      </div>

      <div class="module">
        <div>
          <HButton height="35px" style="width: 200px" @click="updateUserData">
            更新信息
          </HButton>
          <div style="text-align: left; margin-top: -20px;" >
            <span class="hint">想要更改您的角色?</span>
            <span class="clickable-text" @click="goRoleSelect">点击此处!</span>
          </div>

        </div>
      </div>
    </div>
    <div class="right-panel" >
      <div class="module">
        <div class="sub-title" style="padding: 0 10px">
          头像
        </div>
        <div style="position: relative; width: fit-content" class="avatar-box"
             @mouseenter="onMouseEnterAvatar"
             @mouseleave="onMouseLeaveAvatar">
          <HAvatar  size="200" class="avatar-icon"></HAvatar>
          <div :style="{opacity : isMouseOverAvatar ? '1' : '0'}"
               class="center add-icon" >
            <HFileUpload @handleFile="upLoadImage"></HFileUpload>
          </div>
        </div>


      </div>
    </div>
  </div>
</template>

<style scoped lang="stylus">
.main-panel
  display flex
  justify-content space-between
  align-items stretch

.left-panel
  flex 1
  padding 0

.right-panel
  flex 2
  margin 0 50px

.sub-title
  font-size 20px
  color var(--font-title-color)
  font-weight 550
  text-align left
  padding 5px 0px


.module
  margin 20px 0px

.avatar-box
  display flex
  border-radius 999px
  &:hover
    cursor pointer
    .avatar-icon
      filter blur(4px)
      transition 0.3s
  
.add-icon
  position absolute
  transition 0.3s


</style>