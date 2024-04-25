<script setup lang="ts">
import {useRoute} from "vue-router";
import {computed, onMounted, ref} from "vue";
import axios from "@/assets/axios";
import store from "@/store";
import {ElMessage} from "element-plus";
import HButton from "@/components/HButton.vue";
import MarkdownRenderer from "@/components/MarkdownRenderer.vue";
import HScroller from "@/components/HScroller.vue";

const router=useRoute();
const pagenum=ref(1);
const pagesize=ref(7);
const testdata=ref([]);
const item=ref([]);
const value2=ref(0);
const imd = ref<number>(0);
const ID =  router.params.id;
const record=ref({});
const drawer=ref(false);

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

function select1(value2:any){
  console.log(imd.value,value2);
  drawer.value=false;
  imd.value=(value2);
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
      <el-drawer v-model="drawer" title="题目跳转" :with-header="false" size="50%" class="wind">
        <div class="wind">
          <span>选择要跳转的题目</span>
          <el-row>
            <HButton v-for="( s , index) in item.questionList" :key="index" :value="index" @click="select1(index)" class="quest">
              {{index+1}}
            </HButton>
          </el-row>
        </div>
      </el-drawer>
      <el-row justify="space-between">
        <el-col :span="6" >
        </el-col>
        <el-col :span="6">
        </el-col>
        <el-col :span="6">
        </el-col>
        <el-col :span="6">
          <el-row justify="center">
            <HButton @click="drawer = true" class="butt">题目跳转</HButton>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div class="full2">
      <HScroller scroll-direction="column">
        <div>
          <div v-if="item.questionList && item.questionList.length>0&&record.result">
            <br>
            <div>
              <markdown-renderer :markdown="'#### 题目描述：'"></markdown-renderer>
              <markdown-renderer :markdown="question.statement" class="full"></markdown-renderer>
              <markdown-renderer :markdown="'#### 题目分数：'+question.score"></markdown-renderer>
              <markdown-renderer :markdown="'#### 标准答案：'+question.answer"></markdown-renderer>
              <markdown-renderer :markdown="'#### 您的答案：'+record.result[imd]"></markdown-renderer>
            </div>
            <br>
          </div>
        </div>
        <div>
          <el-row justify="space-between">
            <el-col :span="8" >
              <el-row justify="center">
                <HButton @click="Last" class="butt" >上一题</HButton>
              </el-row>
            </el-col>
            <el-col :span="8">
            </el-col>
            <el-col :span="8">
              <el-row justify="center">
                <HButton @click="Next" class="butt">下一题</HButton>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </HScroller>
    </div>

  </div>
</template>

<style scoped lang="stylus">
.quest{
  height 50px;
  width 50px;
  margin 25px;
}
.full2{
  height 600px;
  overflow auto;
}
</style>