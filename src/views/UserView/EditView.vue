<script setup lang="ts">

import axios from "@/assets/axios";
import store from "@/store";
import {reactive, ref} from "vue";
import HDivider from "@/components/HDivider.vue";
import HInput from "@/components/HInput.vue";
import HButton from "@/components/HButton.vue";
import HAvatar from "@/components/HAvatar.vue";
import HRadio from "@/components/HRadio.vue";
import {goRoleSelect} from "@/assets/api";
const data = reactive<{
  nickName : string,
  password : string,
  confirmPassword : string
  picked : string
}>({
  nickName : store.state.nick_name,
  password : '',
  confirmPassword : '',
  picked : ''
})
const editPanel = reactive({visible : false})
const chooseRole = () => {
  axios.post('/sysUser/setPermission',{},{
    params:{
      permission:'前台'
    },
    headers:{
      'Content-Type' : 'application/json',
      'token': store.state.token
    }
  }).then((res)=>{

    console.log(res.data)
  })
}
const fileInput = ref()
const selectedFile = ref()
const handleImage = (event : any) =>{
  const files = event.target.files || event.dataTransfer.files
  if(!files.length) return;
  selectedFile.value = files[0]

  console.log('handleImage')
  upLoadImage()
}
const upLoadImage = async () => {
  if(!selectedFile.value){
    alert('请先选图片')
    return
  }
  const formData = new FormData()
  formData.append('avatar',selectedFile.value)
  await axios.post('/sysUser/setAvatar',formData,{
    headers:{
      'token' : store.state.token
    }
  }).then((res)=>{
    console.log(res.data)
    store.state.avatar_url = res.data.data
  })
}
const changeNickName = () =>{
  console.log('昵称修改成功！')
}
const editAvatar = () =>{
  console.log('change')
  editPanel.visible = !editPanel.visible
}

</script>

<template>
<!--  <div class="title" style="text-align: left;width: 97%">个人信息-->

<!--  </div>-->

  <div class="main-panel full">
    <div class="left-panel">
      <div class="module">
        <div class="sub-title">
          昵称
        </div>
        <HInput name="NickName" v-model="data.nickName" height="25px" @keydown.enter="changeNickName"></HInput>
        <div class="hint">这里可以修改你的昵称哦</div>
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
          <HButton height="35px" style="width: 200px">
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
        <HAvatar size="200" @click="editAvatar"></HAvatar>
        <div v-if="editPanel.visible">
          <input type="file" accept="image/*" @change="handleImage" ref="fileInput"/>

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
</style>