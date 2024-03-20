<template>
  <div
      class="sidebar-main padding-surround"
      ref="sidebarRef"
      :class="{'locked': !store.state.online, 'unlock-unfolded': store.state.online && !folded, 'unlock-folded': store.state.online && folded}"
  >
    <transition
      name="animate__animated animate__fade"
      enter-active-class="animate__fadeIn"
      leave-active-class="animate__fadeOut"
      mode="out-in"
    >
      <div v-if="!store.state.online" class="locked-sidebar border-radius-regular">
        <div class="locked-sidebar-background full border-radius-regular image-cover1"></div>
      </div>
      <div v-else class="unlocked-sidebar flex-column">
        <div class="sidebar-top-block">
          <div class="icon-app-name-flex flex-row" @click="switchFold">
            <HIcon :size="50"></HIcon>
            <div class="title-inverse foldable" style="flex-grow: 0; text-align: center">Healp</div>
          </div>
          <side-bar-item-group>
            <side-bar-item name="study">
              <div class="flex-row" style="justify-content: center; transition: gap 0.5s" :style="{gap: folded?'0':'20px'}">
                <div class="box-icon">
                  <i class='bx bx-book'></i>
                </div>
                <div class="foldable">Study</div>
              </div>
            </side-bar-item>
            <side-bar-item name="archive">
              <div class="flex-row" style="justify-content: center; transition: gap 0.5s" :style="{gap: folded?'0':'20px'}">
                <div class="box-icon">
                  <i class='bx bx-archive'></i>
                </div>
                <div class="foldable">Archive</div>
              </div>
            </side-bar-item>
            <side-bar-item name="guide">
              <div class="flex-row" style="justify-content: center; transition: gap 0.5s" :style="{gap: folded?'0':'20px'}">
                <div class="box-icon">
                  <i class='bx bxs-analyse'></i>
                </div>
                <div class="foldable">Guide</div>
              </div>
            </side-bar-item>
            <side-bar-item name="exam">
              <div class="flex-row" style="justify-content: center; transition: gap 0.5s" :style="{gap: folded?'0':'20px'}">
                <div class="box-icon">
                  <i class='bx bx-spreadsheet' ></i>
                </div>
                <div class="foldable">Exam</div>
              </div>
            </side-bar-item>
          </side-bar-item-group>
        </div>
        <div class="sidebar-bottom-block border-radius-regular">
          <div class="avatar-bar flex-row">
            <HAvatar></HAvatar>
            <div style="text-align: left">
              <div class="text-inverse">{{ store.state.nick_name }}</div>
              <div class="hint" style="font-size: 10px">{{ store.state.email }}</div>
            </div>
          </div>
<!--          <div style="margin: 0 10px;height: 1.5px; background-color: var(&#45;&#45;theme-color)"></div>-->
          <div class="function-bar flex-row" style="color: var(--grey-color-bright)">
            <div class="flex-row button-hover-inverse" style="gap: 5px">
              <div class="box-icon" style="font-size: 15px">
                <i class='bx bx-edit' ></i>
              </div>
              <div style="font-size: 10px">Edit</div>
            </div>
            <div class="flex-row button-hover-inverse" style="gap: 5px"  @click="onSignOut">
              <div class="box-icon">
                <i class='bx bx-exit' style="font-size: 15px"></i>
              </div>
              <div style="font-size: 10px">Sign Out</div>
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
import {ref} from "vue";
import store from "@/store"
import {signOut} from "@/assets/api";
import SideBarItemGroup from "@/components/SideBarItemGroup.vue";
import HAvatar from "@/components/HAvatar.vue";

const folded = ref<boolean>(false);

const switchFold = () => {
  folded.value = !folded.value
}

const onSignOut = () => {
  signOut();
}
</script>

<style scoped lang="stylus">
.locked
  width 60%
  bottom 0
  left 0
  height 100%

.unlock-folded
  width 100px
  bottom 20px
  left -20px
  height calc(100% + 40px)
  .foldable
    width 0
    opacity 0
    flex-grow 0

.unlock-unfolded
  width 250px
  bottom 20px
  left -20px
  height calc(100% + 40px)

.foldable
  width 100px
  text-align left
  flex-grow 1
  transition all 0.5s, width 1s

.sidebar-main
  position relative
  transition all 0.5s, width 1s
  border-radius 0 0 10px 10px
  --animate-duration 0.5s
  overflow hidden

.locked-sidebar
  height 100%

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
  margin 20px 15px
  padding 5px 0
  //background-color rgba(0, 0, 0, 0.2)
  background-color var(--theme-color-dark)

.icon-app-name-flex
  position relative
  padding-top 30px
  padding-bottom 80px
  justify-content center
  transition all 0.5s

.avatar-bar
  margin 0 10px;
  justify-content left

.function-bar
  height 30px
  padding-bottom 5px
  width 100%
  box-sizing border-box
  justify-content space-around
  .box-icon
    width fit-content
</style>
