<template>
  <div class="form-input-main">
    <div class="form-input-border" :style="{height: props.height}">
      <div class="form-input-placeholder hint" v-if="data.empty && !data.focus">{{ '<' + props.name + '>' }}</div>
      <input class="form-input-field" v-model="data.content" @blur="onBlur" :type="props.password?'password':''" @focus="onFocus">
    </div>
  </div>
</template>

<script setup lang="ts">
import {defineProps, withDefaults, defineEmits, reactive, watch} from 'vue'
const props = withDefaults(defineProps<{
  name: string
  password?: boolean
  modelValue: string
  type?: string
  height?: string
  width?: string
}>() , {
  password: false,
  height: '40px',
  type: 'text',
});

const emits = defineEmits(['update:modelValue', 'blur'])

const data = reactive<{
  content: string
  focus: boolean
  empty: boolean
}>({
  content: '',
  focus: false,
  empty: true
})

watch(
    () => props.modelValue,
    (val, preval) => {
      data.content = val;
      if (val !== '')
        data.empty = false
      else data.empty = true
    },
    {
      immediate: true
    }
)

watch(
    () => data.content,
    (val, preval) => {
      if (val !== '')
        data.empty = false
      else data.empty = true
      emits('update:modelValue', val);
    },
    {
      immediate: true
    }
)

const onBlur = () => {
  data.focus = false
  emits('blur')
}

const onFocus = () => {
  data.focus = true
}
</script>

<style scoped lang="stylus">
.form-input-main
  position relative
  background-color transparent
  transition all 0.2s
  overflow hidden
  border-radius 5px
  z-index 0
  &:hover, &:focus-within
    background-color rgba(0,0,0,0.1)

.form-input-field
  padding-left 10px
  background-color transparent
  height 100%
  font-size 14px

.form-input-placeholder
  position absolute
  top 50%
  left 10px
  transform translate(0,-50%)
  z-index -1

</style>
