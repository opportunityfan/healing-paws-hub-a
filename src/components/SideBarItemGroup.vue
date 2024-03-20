<template>
  <slot name="default"></slot>
</template>

<script setup lang="ts">
import {
  VNodeArrayChildren,
  getCurrentInstance,
  onMounted,
  VNode,
  ComponentInternalInstance,
  ref, onUpdated
} from "vue";

const keyVNode : Map<string, ComponentInternalInstance> = new Map<string, ComponentInternalInstance>()
const selectedName  = ref<string>('')

const changeSelect = (name : string) => {
  keyVNode.get(selectedName.value)?.exposed?.setSelect(false)
  selectedName.value = name
  keyVNode.get(selectedName.value)?.exposed?.setSelect(true)
}

// eslint-disable-next-line no-undef
defineExpose({
  changeSelect
})

const update = () => {
  keyVNode.clear()
  const group = getCurrentInstance()
  if (group?.subTree.children) {
    const children = group.subTree.children as VNodeArrayChildren
    children.forEach((vn) => {
      const component = (vn as VNode).component
      if (component) {
        if (component.type.__name == "SideBarItem") {
          keyVNode.set(component.props.name as string, component)
          if (selectedName.value === '') selectedName.value = component.props.name as string;
        }
      }
    })
  }
  keyVNode.get(selectedName.value)?.exposed?.setSelect(true)
}

onMounted(() => {
  update()
})
onUpdated(() => {
  update()
})
</script>

<style scoped>

</style>
