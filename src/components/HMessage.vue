<template>
  <div class="message-main">
    <transition-group
        name="animate__animated animate__fade"
        enter-active-class="animate__fadeInUp"
        leave-active-class="animate__fadeOutDown"
    >
      <div
          v-for="message in store.state.messageList"
          :key="message.id" class="message-block flex-row border-radius-regular"
          :class="message.type"
      >
        <div class="box-icon" style="color: var(--white-color)">
          <i class='bx bxs-error' v-if="message.type === 'error'" style="font-size: 16px"></i>
          <i class='bx bx-check' v-if="message.type === 'success'" style="font-size: 16px"></i>
          <i class='bx bx-error-circle' v-if="message.type === 'warning'" style="font-size: 16px"></i>
          <i class='bx bx-info-circle' v-if="message.type === 'info'" style="font-size: 16px"></i>
        </div>
        <div class="text-inverse">
          {{ message.content }}
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import store from "@/store";
import {onMounted, onUnmounted} from "vue";

// eslint-disable-next-line no-undef
let intervalHandle : NodeJS.Timeout;

onMounted(() => {
  intervalHandle = setInterval(updateMessage, 100)
})

onUnmounted(() => {
  clearInterval(intervalHandle)
})

const updateMessage = () => {
  for (let i = 0; i < store.state.messageList.length; ++ i) {
    store.state.messageList[i].duration -= 100;
    if (store.state.messageList[i].duration <= 0) {
      store.state.messageList.splice(i, 1)
      i--
    }
  }
}

</script>

<style scoped lang="stylus">
.message-main
  position absolute
  width 100%
  height 0
  bottom 20px
  display flex
  flex-direction column-reverse

.message-block
  --animate-duration 0.3s
  min-width 150px
  padding 0 10px
  height 40px
  flex-shrink 0
  margin 10px auto
  justify-content center

.error
  background-color var(--error-color)

.success
  background-color var(--theme-color)

.warning
  background-color var(--accent-color)

.info
  background-color var(--grey-color)
</style>
