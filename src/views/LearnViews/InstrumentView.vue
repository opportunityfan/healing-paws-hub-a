<template>
  <div class="full">
    <HLoading :load="onLoad">
      <div class="full">
        <HScroller scroll-direction="column" ref="scrollRef">
          <div class="flex-column">
            <div>
              <div class="subtitle" style="padding: 15px 0;position: relative">
                <span>{{ data.instrument ? '器械:' + data.instrument?.name : '' }}</span>
                <div class="box-icon button-hover" style="position: absolute; top: 15px;height: 26px;right: -40px;display: inline-block" @click="goto('/instrument-edit/' + data.instrument?.id)">
                  <i class='bx bxs-edit center'></i>
                </div>
              </div>
            </div>
            <HStatistic></HStatistic>
            <markdown-renderer :markdown="data.instrument?.usage ? data.instrument?.usage : ''"  style="user-select: text"></markdown-renderer>
          </div>
        </HScroller>
        <div class="tool-bar flex-column" style="gap: 10px">
          <HIconButton
              name="返回顶部"
              color="var(--grey-color)"
              hover-color="var(--grey-color-dark)"
              icon-class="bxs-to-top"
              :icon-size="18"
              @click="scrollRef.toTop()"
          ></HIconButton>
          <HIconButton
              :name="data.star? '取消收藏' : '收藏'"
              :icon-class="data.star? 'bxs-star' : 'bx-star'"
              :color="data.star? 'var(--accent-color)' : 'var(--grey-color)'"
              :hover-color="data.star? 'var(--accent-color-dark)' : 'var(--grey-color-dark)'"
              @click="onStar"
          ></HIconButton>
          <HIconButton
              name="完成学习"
              :icon-class="data.complete? 'bxs-trophy' : 'bx-check'"
              :color="data.complete? 'var(--accent-color)' : 'var(--grey-color)'"
              :hover-color="data.complete? 'var(--accent-color-dark)' : 'var(--grey-color-dark)'"
              @click="onComplete"
              :icon-size="18"
          ></HIconButton>
        </div>
      </div>
    </HLoading>
  </div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, reactive, VueElement, ref} from "vue";
import { getInstrument, goto, instrument} from "@/assets/api";
import MarkdownRenderer from "@/components/MarkdownRenderer.vue";
import store from "@/store";
import HScroller from "@/components/HScroller.vue";
import HIconButton from "@/components/HIconButton.vue";
import HLoading from "@/components/HLoading.vue";
import HStatistic from "@/components/HStatistic.vue"
// eslint-disable-next-line no-undef
const props = defineProps<{instrumentId: string}>()

const data = reactive<{
  instrument? : instrument
  star : boolean
  complete: boolean
}>({
  instrument : undefined,
  star : false,
  complete : false,
})

const scrollRef = ref<VueElement>()

const onStar = () => {
  data.star = !data.star
}

const onComplete = () => {
  data.complete = true
}

const onLoad = async () => {
  await getInstrument(props.instrumentId).then((res) => {
    data.instrument = res
    // store.state.back_title = '返回学习'
  })
  return
}

onUnmounted(() => {
  store.state.back_title = ''
})

</script>

<style scoped lang="stylus">
.star-button
  border-radius 999px
  width 40px
  height 40px
  background-color var(--grey-color)
  &:hover
    background-color var(--grey-color-dark)

.star
  background-color var(--accent-color)
  &:hover
    background-color var(--accent-color-dark)

.tool-bar
  position absolute
  bottom 50px
  right 50px

.loading
  position absolute

</style>
