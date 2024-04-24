<script setup lang="ts">
import {useRoute} from "vue-router";
import {computed, onMounted, ref} from "vue";
import axios from "@/assets/axios";
import store from "@/store";
import {ElMessage} from "element-plus";

const router=useRoute();
const pagenum=ref(1);
const pagesize=ref(7);
const testdata=ref([]);
const item=ref([]);
const value2=ref(0);
const imd = ref<number>(0);
const ID =  router.params.id;
const record=ref({});

async function getData() {
  const res = await axios.get('/examrecord/page/id', {
    params: {
      pageNum: pagenum.value,
      pageSize: pagesize.value,
    },
    headers: {
      'token': store.state.token
    }
  })
  testdata.value=res.data.data.listData;
  record.value=res.data.data.listData.find(e=> {
    return e.examId === ID;
  });
  console.log(record.value);
}

async function getData2() {
  const res = await axios.get('/exam', {
    params: {
      id : router.params.id,
    }
  })
  console.log(res);
  item.value=res.data.data;
}

function select(){
  console.log(imd.value,value2.value);
  imd.value=(value2.value);
}

function Last(){
  if(imd.value==0){
    ElMessage({
      showClose: true,
      message: '已经是第一题了',
      type: 'warning',
    })
  }
  else{
    imd.value=imd.value-1;
  }
}

function Next(){
  if(imd.value>=(item.value.questionList.length-1)){
    ElMessage({
      showClose: true,
      message: '已经是最后一题了',
      type: 'warning',
    })
  }
  else{
    imd.value=imd.value+1;
  }
}

onMounted(()=>{
  getData();
  getData2();
})

const question = computed(()=>{
  if (!(item.value.questionList)){
    return { };
  }
  else {
    const ques = item.value.questionList[imd.value];
    // console.log(ques);
    // const quest = JSON.parse(ques);
    return ques;
  }
})

</script>

<template>
  <div>
  <div>
    <el-button>
      考试题目跳转
      <el-select v-model="value2" @change="select">
        <el-option v-for="( s , index) in item.questionList" :label="index+1" :key="index" :value="index">
        </el-option>
      </el-select>
    </el-button>
  </div>
  <div class="hang">
    <div class="zuo">
      <el-button @click="Last">上一题</el-button>
    </div>
    <div class="you">
      <el-button @click="Next">下一题</el-button>
    </div>
  </div>
  <div>
    <br>
    <div v-if="item.questionList && item.questionList.length>0&&record.result">
      <h5>
        题目分数：{{question.score}}
      </h5>
      <br>
      <h3>
        题目描述
      </h3>
      <br>
      <div>
        {{ question.statement }}
      </div>
      <br>
      <div>
        标准答案：{{question.answer}}
      </div>
      <div>
        您的答案：{{record.result[imd]}}
      </div>
      <br>
    </div>
  </div>
  </div>
</template>

<style scoped lang="stylus">

</style>