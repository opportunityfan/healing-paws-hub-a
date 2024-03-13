<template>
  <div class="sidebar-main border-radius-regular padding-surround" ref="sidebarRef">
    <transition
      name="animate__animated animate__fade"
      enter-active-class="animate__fadeIn"
      leave-active-class="animate__fadeOut"
      mode="out-in"
    >
      <div v-if="!store.state.sidebar_unlock" class="locked-sidebar border-radius-regular">
        <div class="locked-sidebar-background full border-radius-regular image-cover1"></div>
      </div>
      <div v-else class="unlocked-sidebar border-radius-regular flex-column">
        <div class="sidebar-top-block">
<!--          <div class="title-inverse">Healing Paw Hub</div>-->
        </div>
        <div class="sidebar-bottom-block border-radius-regular flex-column">
          <div class="avatar-bar"></div>
          <div style="margin: 0 10px;height: 1.5px; background-color: var(--theme-color)"></div>
          <div class="function-bar flex-row">
            <div class="box-icon button-hover" style="font-size: 20px">
              <i class='bx bx-edit' ></i>
            </div>
            <div class="box-icon button-hover" @click="onSignOut">
              <i class='bx bx-exit' style="font-size: 20px"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref, VueElement, watch} from "vue";
import store from "@/store"
import {signOut} from "@/assets/api";
const sidebarRef = ref<VueElement>();
onMounted(() => {
  watch(
      () => store.state.sidebar_unlock,
      (val, preval) => {
        if (!sidebarRef.value) return;
        if (val) {
          sidebarRef.value.style['width'] = '250px';
        } else {
          sidebarRef.value.style['width'] = '60%';
        }
      },
      {
        immediate: true
      }
  )
})

const onSignOut = () => {
  signOut();
}
</script>

<style scoped lang="stylus">
.sidebar-main
  /*background-color: var(--sidebar-color);*/
  height 100%
  transition width 0.2s
  --animate-duration 0.5s

.locked-sidebar
  height 100%
  background-color rgba(255, 255, 255, 0.3)

.locked-sidebar-background
  background-image url('../assets/login-background.png')
  background-repeat no-repeat
  background-size cover
  background-position center

.unlocked-sidebar
  height 100%
  background-color var(--theme-color)
  color var(--font-inverse-color)
  justify-content space-between
  padding-top 10px
  box-sizing border-box

.sidebar-bottom-block
  height 120px
  margin 10px
  background-color var(--theme-color-dark)

.avatar-bar
  flex-grow 1

.function-bar
  height 40px
  padding 5px
  width 100%
  box-sizing border-box
  justify-content space-around
  .box-icon
    width 30px
</style>
