<script setup lang="ts">
import {useRoute} from "vue-router";
import axios from "axios";
import {onMounted, ref} from "vue";
import HButton from "@/components/HButton.vue";
import store from "@/store";

const router=useRoute();
const item = ref<any>({});

async function getData(){
  const res=await axios.get('http://150.158.110.63:8080/exam',{
    params:{
      id: router.params.id
    }
  })
  item.value=res.data.data;
}
const enterExam = () => {
  store.state.isTesting = true
}

onMounted(()=>{
  getData();
})
</script>

<template>
  <div class="full">
    <h1 class="head">
      {{item.examName}}
    </h1>
    <h4 class="head">
      考试时间：{{item.startTime}}-{{item.endTime}}
      <br>
      共计{{item.totalTime}}分钟
      <br>
      考试分数：{{item.totalScore}}
    </h4>
    <div class="hello">
      考试规则：
      <br>
      1.考试需要在规定时间内完成考试内容
      <br>
      2.不得作弊
    </div>
    <router-link :to="`/examTest/${item.id}`">
      <HButton @click="enterExam">
        开始考试
      </HButton>
    </router-link>
  </div>
</template>

<style scoped lang="stylus">
.head{
  color #5A8100
}
.hello{
  color #9FB66B
}
</style>
