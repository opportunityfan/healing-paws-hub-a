<script setup lang="ts">
import {useRoute} from "vue-router";
import axios from "axios";
import {onMounted, ref} from "vue";

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

onMounted(()=>{
  getData();
})
</script>

<template>
  <h1 class="head">
    {{item.examName}}
  </h1>
  <h4 class="head">
    考试分数：{{item.totalScore}}
    考试时间：{{item.startTime}}-{{item.endTime}} 共计{{item.totalTime}}分钟
  </h4>
  <div>
    考试规则：
    <br>
    1.考试需要在规定时间内完成考试内容
    <br>
    2.不得作弊
    <br>
    3.，，，，，，，
    <br>
    4，，，，，，，，
    <br>
    5，，，，，，，
    <div>

    </div>
  </div>
    <router-link :to="`/examTest/${item.id}`">
      <el-button>
        开始考试
      </el-button>
    </router-link>
</template>

<style scoped lang="stylus">
.head{
  color #5A8100
}
</style>