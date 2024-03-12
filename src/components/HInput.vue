<template>
  <div class="input-main">
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
  </div>
</template>

<script setup lang="ts">
import {defineProps, withDefaults, defineEmits, reactive, watch} from 'vue'
const props = withDefaults(defineProps<{
  name: string
  password?: boolean
  modelValue: string
}>() , {
  password: false
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
  height 40px
  position relative
  margin: 20px 0

.input-name
  position absolute
  color var(--object-unfocus-color)
  background-color var(--background-color)
  left 10px;
  top -5px
  padding-left 3px;
  padding-right 3px
  font-size 10px
  transition all 0.1s
  overflow hidden
  z-index 1

.input-border {
  position relative
  height 100%;
  margin-top 5px
  margin-bottom 5px
  border-radius 5px
  border var(--object-unfocus-color) 1.5px solid
}
.input-field
  margin-left 10px
  height 100%
  background-color rgba(0, 0, 0, 0)

.placeholder
  position absolute
  color var(--font-subject-color)
  font-size 14px
  top: 50%
  left: 12px
  transform  translate(0, -50% - 2px)
  z-index -1
</style>
