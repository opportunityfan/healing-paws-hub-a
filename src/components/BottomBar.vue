<template>
  <div class="bottom-bar-main" :style="{width: data.append? '800px' : '40px'}">
    <div class="bottom-item-container flex-row" style="justify-content: flex-start; gap: 20px">
      <div class="bottom-item-menu" style="width: 40px; z-index: 10;" :class="{'append' : data.append}" @click="onAppend">
        <div class="box-icon center">
          <i class='bx bx-menu'></i>
        </div>
      </div>
      <transition
          name="animate__animated animate__fade"
          enter-active-class="animate__fadeIn"
          leave-active-class="animate__fadeOut"
          mode="out-in"
      >
        <div style="height: 100%" v-if="data.append">
          <transition
              name="animate__animated animate__fade"
              enter-active-class="animate__fadeInLeft"
              leave-active-class="animate__fadeOutRight"
              mode="out-in"
          >
            <div class="flex-row" style="justify-content: flex-start; gap: 20px; height: 100%" v-if="data.page === 1">
              <div class="bottom-item flex-row">
                <div class="text-bold-inverse" @click="goto('/affairManageSearch')">事务管理</div>
              </div>
              <div class="bottom-item flex-row" v-if="data.append && data.page === 1">
                <div class="text-bold-inverse">事务节点管理</div>
              </div>
              <div class="bottom-item flex-row" v-if="data.append && data.page === 1">
                <div class="text-bold-inverse">器械管理</div>
              </div>
              <div class="bottom-item flex-row" v-if="data.append && data.page === 1">
                <div class="text-bold-inverse" @click="goto('/departmentManage')">科室管理</div>
              </div>
              <div class="bottom-item" style="width: 40px" @click="onNext">
                <div class="box-icon center">
                  <i class='bx bx-chevron-right'></i>
                </div>
              </div>
            </div>
            <div class="flex-row" style="justify-content: flex-start; gap: 20px; height: 100%" v-else>
              <div class="bottom-item flex-row" v-if="data.append && data.page === 2">
                <div class="text-bold-inverse" @click="goto('/archiveManage')">病历管理</div>
              </div>
              <div class="bottom-item flex-row" v-if="data.append && data.page === 2">
                <div class="text-bold-inverse" @click="goto('/examManage')">考试管理</div>
              </div>
              <div class="bottom-item flex-row" v-if="data.append && data.page === 2">
                <div class="text-bold-inverse" @click="goto('/subject')">试题管理</div>
              </div>
              <div class="bottom-item" style="width: 40px" @click="onNext">
                <div class="box-icon center">
                  <i class='bx bx-chevron-right'></i>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import {reactive} from "vue";
import {goto} from "@/assets/api";

const data = reactive<{
  append : boolean
  page : number
}>({
  append : false,
  page : 1
})

const onAppend = () => {
  data.append = !data.append
}

const onNext = () => {
  data.page ++
  if (data.page > 2) data.page = 1
}
</script>

<style scoped lang="stylus">
.bottom-bar-main
  position absolute
  height 40px
  border-radius 999px
  left 20px
  bottom 20px
  transition width 0.3s
  --animate-duration 0.5s
  overflow hidden

.bottom-item-container
  justify-content space-between
  height 100%

.bottom-item
  position relative
  height 100%
  border-radius 999px
  padding 0 15px
  flex-shrink: 0
  box-sizing border-box
  color var(--white-color)
  background-color var(--grey-color-bright)
  transition all 0.2s
  &:hover
    background-color var(--grey-color)

.bottom-item-menu
  position relative
  height 100%
  border-radius 999px
  padding 0 10px
  flex-shrink: 0
  box-sizing border-box
  color var(--white-color)
  background-color var(--theme-color)
  transition all 0.2s
  &:hover
    background-color var(--theme-color-dark)

.append
  animation rotate90 0.2s
  transform rotate(.25turn)
</style>
