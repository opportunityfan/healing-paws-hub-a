<template>
  <div class="talk-bar-anchor border-radius-regular">
    <transition
        name="animate__animated animate__fade"
        enter-active-class="animate__fadeIn"
        leave-active-class="animate__fadeOut"
        mode="out-in"
    >
      <div class="talk-bar-shadow" v-if="store.state.talkBarAppend"></div>
    </transition>
    <div
        class="talk-bar-main"
        v-click-outside="closeTalkBar"
        :style="{right: store.state.talkBarAppend? '0' : 'calc(-70% - 10px)'}">
      <div class="full flex-column" style="--animate-duration: 0.25s">
        <div class="flex-row" style="width: 100%;gap: 10px">
          <div class="subtitle">智能助教</div>
          <div class="hint" style="transform: translate(0, 3px)">你的AI学习助手</div>
        </div>
        <HDivider style="padding: 10px 0"></HDivider>
        <div style="flex-grow: 1; width: calc(100% + 15px)">
          <HScroller :scroll-direction="'column'">
            <div class="history-content">
              <div v-for="(history, index) in store.state.talkHistories" :key="index">
                <div v-if="history.selfSend" class="flex-row history" style="justify-content: flex-end">
                  <div class="content text-inverse" style="background-color: var(--theme-color)">{{ history.content }}</div>
                  <HAvatar :size="35" style="padding: 0"></HAvatar>
                </div>
                <div v-else class="flex-row history" style="justify-content: flex-start">
                  <HIcon :size="35"></HIcon>
                  <div class="content text" style="background-color: var(--grey-color-bright)">{{ history.content }}</div>
                </div>
              </div>
            </div>
          </HScroller>
        </div>
        <HDivider style="padding: 10px 0"></HDivider>
        <div class="talk-input-area flex-column">
          <textarea style="flex-grow: 1; font-size: 14px" v-model="data.text"></textarea>
          <div class="flex-row" style="width: 100%; justify-content: flex-end">
            <div class="submit-button border-radius-regular flex-row text-inverse" style="justify-content: center" @click="onSubmit">
              <div>发送</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import store from "@/store";
import { closeTalkBar } from "@/assets/api";
import HIcon from '@/components/HIcon.vue'
import HDivider from "@/components/HDivider.vue";
import HScroller from "@/components/HScroller.vue";
import {onMounted, VueElement, ref, reactive} from "vue";
import HAvatar from "@/components/HAvatar.vue";
import {string} from "three/examples/jsm/nodes/shadernode/ShaderNode";

onMounted(() => {
  store.state.talkHistories = [
    {
      content: '不是哥们儿',
      selfSend: false
    },
    {
      content: '你先开的',
      selfSend: true
    }
  ]
})

const data = reactive<{
  text: string
}>({
  text: ''
})

const onSubmit = () => {
  store.state.talkHistories.push({
    content: data.text,
    selfSend: true
  })
  data.text = ''
}
</script>

<style scoped lang="stylus">
.talk-bar-anchor
  position absolute
  width 100%
  height 100%
  top 0
  left 0
  overflow hidden
  pointer-events none
  & > div
    pointer-events all

.talk-bar-main
  position absolute
  padding 20px
  box-sizing border-box
  height 100%
  width 70%
  top 0
  transition right 0.5s
  border-radius 10px
  box-shadow 0 0 3px 3px rgba(0, 0, 0, 0.2)
  background-color: var(--background-color)
  overflow hidden
  z-index 13

.talk-bar-shadow
  --animate-duration 0.5s
  position absolute
  height 100%
  width 100%
  background-color rgba(0, 0, 0, 0.8)
  top 0
  right 0
  transition opacity 0.5s
  z-index 12

.talk-input-area
  height 100px
  width 100%
  padding 0 10px
  box-sizing border-box

.history-content
  padding-right 15px

.history
  padding 10px 0
  gap 10px

.content
  border-radius 10px
  overflow hidden
  padding 10px 10px
  user-select: text

.submit-button
  height 30px
  width 60px
  background-color var(--theme-color)
  transition all 0.2s
  margin-top 10px
  &:hover
    background-color var(--theme-color-dark)
</style>
