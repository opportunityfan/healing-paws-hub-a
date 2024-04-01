<script setup lang="ts">

import axios from "@/assets/axios";
import store from "@/store";
import {reactive} from "vue";
import HDivider from "@/components/HDivider.vue";
import HInput from "@/components/HInput.vue";
import HButton from "@/components/HButton.vue";
const data = reactive<{
  nickName : string,
  password : string,
  confirmPassword : string
}>({
  nickName : store.state.nick_name,
  password : '',
  confirmPassword : ''
})
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
const changeNickName = () =>{
  console.log('昵称修改成功！')
}
</script>

<template>
  <div class="title" style="text-align: left;width: 97%">个人信息
    <HDivider></HDivider>
  </div>

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
          <HButton height="30px" style="width: 60%">
            更新信息
          </HButton>
        </div>
      </div>
    </div>
    <div class="right-panel" >
      <div class="module">
        <div class="sub-title">
          头像
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
  padding 5px 0

.module
  margin 20px 0px
</style>