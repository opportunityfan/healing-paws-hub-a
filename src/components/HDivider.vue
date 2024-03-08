<template>
  <div
    v-if="type==='horizontal'"
    :class="[`m-divider-horizontal ${orientation}`,
    {
      dashed: dashed,
      margin24: !showText,
      marginLeft: orientationMargin !==''&&orientation === 'left',
      marginRight: orientationMargin !==''&&orientation === 'right',
    }]"
    :style="`--border-width: ${borderWidth}px;`">
     <span class="u-text" v-if="orientation === 'left'" :style="`margin-left: ${margin};`" v-show="showText">
      <slot></slot>
    </span>
    <span class="u-text" v-else-if="orientation === 'right'" :style="`margin-right: ${margin};`" v-show="showText">
      <slot></slot>
    </span>
    <span class="u-text" v-else v-show="showText">
      <slot></slot>
    </span>
  </div>

  <div v-else class="m-divider-vertical"></div>

</template>

<script setup lang="ts">
import {computed,useSlots} from "vue";
interface Props{
  dashed?: boolean
  orientation?: 'left'|'center'|'right'
  orientationMargin?:string|number
  borderWidth?: number
  type?: 'horizontal'|'vertical'
}
// eslint-disable-next-line no-undef
const props = withDefaults(defineProps<Props>(),{
  dashed: false,
  orientation: 'center',
  orientationMargin:'',
  borderWidth: 1,
  type: 'horizontal'
})

const margin = computed(()=>{
  if(props.orientationMargin !== ''){
    if(typeof props.orientationMargin === 'number'){
      return props.orientationMargin + 'px'
    }else{
      return props.orientationMargin
    }
  }
  return false
})

const slots = useSlots()
const showText = computed(()=>{
  const defaultSlots = slots.default?.()
  if(defaultSlots){
    return Boolean(defaultSlots[0].children!=='v-if'&&defaultSlots[0].children?.length)
  }
  return false
})
</script>


<style scoped lang="stylus">
.m-divider-horizontal {
  display: flex;
  align-items: center;
  margin: 16px 0;
  width: 100%;
  min-width: 100%;
  &::before, &::after {
    position: relative;
    width: 50%;
    border-top-width: var(--border-width);
    border-top-style: solid;
    border-top-color: rgba(5, 5, 5, .06);
    transform: translateY(50%);
    content: '';
  }
  .u-text {
    display: inline-block;
    font-size: 16px;
    color: rgba(0, 0, 0, .88);
    font-weight: 500;
    line-height: 1.5714285714285714;
    white-space: nowrap;
    text-align: center;
    padding: 0 16px;
  }
}
.m-divider-vertical {
  position: relative;
  top: -.06em;
  display: inline-block;
  height: .9em;
  margin: 0 8px;
  vertical-align: middle;
  border-top: 0;
  border-inline-start: 1px solid rgba(5, 5, 5, .06);
}
.dashed {
  &::before {
    border-top-style: dashed;
  }
  &::after {
    border-top-style: dashed;
  }
}
.left {
  &::before {
    width: 5%;
  }
  &::after {
    width: 95%;
  }
}
.right {
  &::before {
    width: 95%;
  }
  &::after {
    width: 5%;
  }
}
.margin24 {
  margin: 24px 0;
}
.marginLeft {
  &::before {
    width: 0;
  }
  &::after {
    width: 100%;
  }
}
.marginRight {
  &::before {
    width: 100%;
  }
  &::after {
    width: 0;
  }
}
</style>