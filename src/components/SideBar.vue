<template>
  <div class="sidebar-main border-radius-regular padding-surround" ref="sidebarRef">
    <transition>
      <div class="locked-sidebar border-radius-regular" style="height: 100%">
        <div class="locked-sidebar-background full border-radius-regular image-cover1"></div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref, VueElement, watch} from "vue";
import store from "@/store"
const sidebarRef = ref<VueElement>();
onMounted(() => {
  watch(
      () => store.state.sidebar_unlock,
      (val, preval) => {
        if (!sidebarRef.value) return;
        if (val) {
          sidebarRef.value.style['width'] = '200px';
        } else {
          sidebarRef.value.style['width'] = '60%';
        }
      },
      {
        immediate: true
      }
  )
})
</script>

<style scoped>
.sidebar-main {
  /*background-color: var(--sidebar-color);*/
  height: 100%;
  transition: width 0.2s;
}
.locked-sidebar {
  background-color: rgba(255, 255, 255, 0.3);
}
.locked-sidebar-background {
  background-image: url('../assets/login-background.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
</style>
