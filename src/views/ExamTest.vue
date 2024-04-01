<script setup lang="ts">
import {useRoute} from "vue-router";
import {computed, onMounted, ref} from "vue";
import axios from "axios";
import {ElMessage} from "element-plus";
import {compute} from "three/examples/jsm/nodes/gpgpu/ComputeNode";
import {goto} from "@/assets/api";

const value2=ref(0);
const router=useRoute();
const item = ref<any>({});
const imd = ref<number>(0);
const ans = ref([]);
const answer = ref('');
async function getData(){
  const res=await axios.get('http://150.158.110.63:8080/exam',{
    params:{
      id: router.params.id
    }
  })
  item.value=res.data.data;
}
getData();
function onCountdownEnd(){
  ElMessage({
    showClose: true,
    message: '时间到，交卷.',
    type: 'warning',
  })
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

function select(){
  console.log(imd.value,value2.value);
  imd.value=(value2.value);
}

function record(){
  console.log(answer);
  console.log(ans);
  ans[imd.value]=answer;
}

function submit(){
  ElMessage({
    showClose: true,
    message: '交卷后不可修改',
    type: 'warning',
  })
  console.log(ans);
  goto('/exam/page');
}

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
    倒计
    <vue-countdown v-if="item.totalTime > 0" @end="onCountdownEnd" :time="item.totalTime * 60 * 1000" v-slot="{ hours, minutes, seconds }">
      {{ hours }} : {{ minutes }} : {{ seconds }}
    </vue-countdown>
  </div>
  <h4>
    {{ item.examName }}
  </h4>
  <div>
    <el-button @click="submit">
      交卷
    </el-button>
  </div>
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
    <div v-if="item.questionList && item.questionList.length>0">
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
        请输入答案
      </div>
      <br>
      <el-input v-model="answer" @blur="record()">
      </el-input>
    </div>
  </div>
</template>

<style scoped lang="stylus">
.hang{
  display: flex;
  gap: 10px;
  .zuo{
    flex: 1;
  }
  .you{
    flex: 1;
  }
}
</style>
