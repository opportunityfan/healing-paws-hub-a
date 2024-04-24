<script setup lang="ts">
import {useRoute} from "vue-router";
import {computed, onMounted, ref} from "vue";
import axios from "axios";
import {ElMessage} from "element-plus";
import {compute} from "three/examples/jsm/nodes/gpgpu/ComputeNode";
import {goto} from "@/assets/api";
import store from "@/store";
import MarkdownRenderer from "@/components/MarkdownRenderer.vue";
import HButton from "@/components/HButton.vue";
import HScroller from "@/components/HScroller.vue";

const router=useRoute();
const item = ref<any>({});
const imd = ref<number>(0);
const ans = ref<string[]>([]);
const answer = ref('');
const item1 = ref<any>({});
const issubmit = ref(false);
const drawer = ref(false);

function state(item2:any){
  issubmit.value=true;
  item1.value=item2;
}

function insure(){
  submit(item1.value);
  issubmit.value=false;
}

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
    answer.value='';
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
    answer.value='';
  }
}

function select(value2:any){
  console.log(imd.value,value2);
  drawer.value=false;
  imd.value=(value2);
}

function record(){
  console.log(answer.value);
  ans.value[imd.value]=answer.value;
  console.log(ans.value);
  answer.value='';
}

async function submit(item:any){
  ElMessage({
    showClose: true,
    message: '交卷后不可修改',
    type: 'warning',
  })
  console.log(ans);
  const datasub = {
    examId : item.id,
    result : ans.value,
  }
  await axios.post('http://150.158.110.63:8080/examrecord',datasub,{
    headers:{
      'token' : store.state.token
    }
  })
  goto('/exam');
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

onMounted(()=>{
  console.log(store.state.token);
})
</script>

<template>
  <div class="full0">
    <div class="full1">
      <el-row justify="space-between">
        <el-col :span="8">
          <h4 class="dao">
            {{ item.examName }}
          </h4>
        </el-col>
        <el-col :span="8">
          <div>
            <vue-countdown v-if="item.totalTime" @end="onCountdownEnd"
                           :time="item.totalTime * 60 * 1000" v-slot="{ hours, minutes, seconds }"
                            >
                <h4 class="dao">
                  {{ hours }} : {{ minutes }} : {{ seconds }}
                </h4>
            </vue-countdown>
          </div>
        </el-col>
      </el-row>
      <div>
<!--        {{item.questionList}}-->
<!--          <h4 class="dao">请选择要查看的考试题目-->
<!--          <select v-model="value2" @change="select" class="sele">-->
<!--            <option v-for="( s , index) in item.questionList" :key="index" :value="index">-->
<!--              {{index+1}}-->
<!--            </option>-->
<!--          </select>-->
<!--          </h4>-->
      </div>
      <br>
      <div>
        <el-drawer v-model="drawer" title="题目跳转" :with-header="false" size="50%" class="wind">
          <div class="wind">
            <span>选择要跳转的题目</span>
            <el-row>
              <HButton v-for="( s , index) in item.questionList" :key="index" :value="index" @click="select(index)" class="quest">
                {{index+1}}
              </HButton>
            </el-row>
          </div>
        </el-drawer>
      </div>
      <el-row justify="space-between">
        <el-col :span="6" >
          <el-row justify="center">
            <HButton @click="Last" class="butt" >上一题</HButton>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row justify="center">
            <HButton @click="state(item) " class="butt">
              交卷
            </HButton>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row justify="center">
            <HButton @click="Next" class="butt">下一题</HButton>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row justify="center">
            <HButton @click="drawer = true" class="butt">题目跳转</HButton>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <br>
    <div class="full2">
      <HScroller scroll-direction="column">
        <div v-if="item.questionList && item.questionList.length>0">
          <markdown-renderer :markdown="'#### 题目描述：'"></markdown-renderer>
          <markdown-renderer :markdown="question.statement" class="full"></markdown-renderer>
          <markdown-renderer :markdown="'#### 题目分数：'+question.score"></markdown-renderer>
          <markdown-renderer :markdown="'#### 请输入答案：'"></markdown-renderer>
          <el-input v-model="answer" @blur="record()">
          </el-input>
        </div>
      </HScroller>
    </div>
    <el-dialog v-model="issubmit" title="交卷" width="500" :center="true" class="xdialog">
      <span>是否确认交卷</span>
      <template #footer>
        <el-button color="#9FB66B" @click="insure()"><span>确认</span></el-button>
        <el-button color="#5A8100" @click="issubmit=false">取消</el-button>
      </template>
    </el-dialog>
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
.full0{
  height: 100%;
  display flex;
  flex-direction column;
  width 100%;
}
.full2{
  height calc(100%-152px);
  overflow auto;
}
.dao{
  color #5A8100
}
.butt{
  width 50%;
}
.sele{
  width: 100px;
  background-color: #FFF9E9;
  color: #5A8100;
  height 30px;
  border-radius 5px;
  border-width 3px;
  border-color #5A8100
}
.quest{
  height 50px;
  width 50px;
  margin 25px;
}
.wind{
  background-color #FFF9E9;
}
</style>
