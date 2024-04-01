<template>
  <div class="input-main" :class="props.state">
    <div
        class="input-name"
        :style="{
          opacity: (data.empty && !data.focus) ? 0 : 1
        }"
    >
      {{ props.name }}
    </div>
    <div class="input-border">
      <div class="placeholder" v-if="(data.empty && !data.focus)">{{ props.name }}</div>
      <input class="input-field" v-model="data.content" @blur="onBlur" :type="props.password?'password':''" @focus="onFocus">
    </div>
    <div class="information-bar hint" :style="{height: props.information === '' ? '0' : '15px'}">
      <i v-if="props.state === 'error'" class='bx bxs-error-circle'></i>
      {{ props.information }}
    </div>
  </div>
</template>

<script setup lang="ts">
import {defineProps, withDefaults, defineEmits, reactive, watch} from 'vue'
const props = withDefaults(defineProps<{
  name: string
  password?: boolean
  modelValue: string
  state?: string
  information?: string
}>() , {
  password: false,
  state: 'default',
  information: ''
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
    {}
)

watch(
    () => data.content,
    (val, preval) => {
      if (val !== '')
        data.empty = false
      else data.empty = true
      emits('update:modelValue', val);
    },
    {}
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
.input-main
  width 100%
  position relative
  margin: 18px 0

.input-name
  position absolute
  background-color var(--background-color)
  left 10px;
  top -5px
  padding-left 3px;
  padding-right 3px
  font-size 10px
  transition all 0.1s
  overflow hidden
  z-index 1

.default
  .input-name
    color var(--object-unfocus-color)
  .input-border
    border var(--object-unfocus-color) 1.5px solid
  .placeholder
    color var(--grey-color)
  &:focus-within
    .input-name
      color var(--theme-color)
    .input-border
      border var(--theme-color) 1.5px solid

.error
  .input-name
    color var(--error-color)
  .input-border
    border var(--error-color) 1.5px solid
  .placeholder
    color var(--error-color)
  .information-bar
    color var(--error-color)

.input-border
  position relative
  height 40px;
  margin-top 5px
  margin-bottom 5px
  border-radius 5px
  transition border-color 0.1s

.input-field
  margin-left 10px
  height 100%
  background-color rgba(0, 0, 0, 0)

.placeholder
  position absolute
  font-size 14px
  top: 50%
  left: 12px
  transform  translate(0, -50% - 2px)
  z-index -1

.information-bar
  padding-left 10px
  transition all 0.2s
  overflow hidden
</style>
