<template>
  <div class="sidebar-main padding-surround" ref="sidebarRef">
    <transition
      name="animate__animated animate__fade"
      enter-active-class="animate__fadeIn"
      leave-active-class="animate__fadeOut"
      mode="out-in"
    >
      <div v-if="!store.state.sidebar_unlock" class="locked-sidebar border-radius-regular">
        <div class="locked-sidebar-background full border-radius-regular image-cover1"></div>
      </div>
      <div v-else class="unlocked-sidebar flex-column">
        <div class="sidebar-top-block">
          <div class="icon-app-name-flex flex-row" style="position: relative;left: -10px">
            <HIcon :size="50"></HIcon>
            <div class="title-inverse">Healp</div>
          </div>
          <side-bar-item-group>
            <side-bar-item name="study">
              <div class="flex-row" style="justify-content: left; gap: 20px">
                <div class="box-icon">
                  <i class='bx bx-book'></i>
                </div>
                <div>Study</div>
              </div>
            </side-bar-item>
            <side-bar-item name="archive">
              <div class="flex-row" style="justify-content: left; gap: 20px">
                <div class="box-icon">
                  <i class='bx bx-archive'></i>
                </div>
                <div>Archive</div>
              </div>
            </side-bar-item>
            <side-bar-item name="guide">
              <div class="flex-row" style="justify-content: left; gap: 20px">
                <div class="box-icon">
                  <i class='bx bxs-analyse'></i>
                </div>
                <div>Guide</div>
              </div>
            </side-bar-item>
            <side-bar-item name="exam">
              <div class="flex-row" style="justify-content: left; gap: 20px">
                <div class="box-icon">
                  <i class='bx bx-spreadsheet' ></i>
                </div>
                <div>Exam</div>
              </div>
            </side-bar-item>
          </side-bar-item-group>
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
import HIcon from "@/components/HIcon.vue";
import SideBarItem from "@/components/SideBarItem.vue";
import {onMounted, ref, VueElement, watch} from "vue";
import store from "@/store"
import {signOut} from "@/assets/api";
import SideBarItemGroup from "@/components/SideBarItemGroup.vue";
const sidebarRef = ref<VueElement>();
onMounted(() => {
  watch(
      () => store.state.sidebar_unlock,
      (val, preval) => {
        if (!sidebarRef.value) return;
        if (val) {
          sidebarRef.value.style['width'] = '250px';
          sidebarRef.value.style['bottom'] = '20px';
          sidebarRef.value.style['left'] = '-20px';
          sidebarRef.value.style['height'] = 'calc(100% + 40px)';
        } else {
          sidebarRef.value.style['width'] = '60%';
          sidebarRef.value.style['bottom'] = '0';
          sidebarRef.value.style['left'] = '0';
          sidebarRef.value.style['height'] = '100%';
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
  position relative
  height 100%
  transition all 0.5s, width 1s
  border-radius 0 0 10px 10px
  --animate-duration 0.5s

.locked-sidebar
  height 100%
  //background-color rgba(255, 255, 255, 0.3)

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

.sidebar-top-block
  width 100%

.sidebar-bottom-block
  height 120px
  margin 20px 10px
  background-color var(--theme-color-dark)

.icon-app-name-flex
  padding-top 30px
  padding-bottom 80px
  gap 5px
  justify-content center

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
