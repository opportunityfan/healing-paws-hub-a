<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {string} from "three/examples/jsm/nodes/shadernode/ShaderNode";
import {dayjs, FormEmits, FormInstance} from "element-plus";
import axios from "axios";
import {goto} from "@/assets/api";
import {useRoute} from "vue-router";

const router=useRoute();
const pagenum=ref(1);
const pagesize=ref(10);
const examform=reactive({
  id:router.params.id,
  examName: '',
  type:1,
  startTime:'',
  totalTime:'',
  endTime:'',
  questionIdList:[],
});
const rules=reactive({
  examName: [
    {
      required:true,
      message:'考试名称必填',
      trigger:'blur',
    }
  ],
  startTime: [
    {
      required:true,
      message:'考试开始时间必填',
      trigger:'blur',
    }
  ],
  endTime: [
    {
      required:true,
      message:'考试开始时间必填',
      trigger:'blur',
    }
  ]
});
const formref=ref<FormInstance>();
const isAdd=ref(false);
const questiondata=ref([]);
const examList=ref<string[]>([]);
function submit(){
  formref.value?.validate((valid)=>{
    if(valid){
      console.log(examform);
      getsubmit(examform);
    }
  });
}

async function getsubmit(newexam:object){
  examform.startTime=dayjs(examform.startTime).format('YYYY-MM-DD hh:mm:ss');
  examform.endTime=dayjs(examform.endTime).format('YYYY-MM-DD hh:mm:ss');
  console.log(newexam);
  const result=await axios.put('http://150.158.110.63:8080/exam',examform);
  console.log(result);
  goto('/examManage');
}
async function getdata(){
  const res = await axios.get('http://150.158.110.63:8080/question/page',{
    params:{
      pageNum: pagenum.value,
      pageSize: pagesize.value,
    }
  })
  questiondata.value=res.data.data;
}


function Add(Value:boolean,Id:string){
  console.log(Value);
  if(Value){
    examList.value.push(Id);
  }
  else{
    examList.value.splice(examList.value.indexOf(Id),1);
  }
}

function insured(){
  (examform.questionIdList as string[])=examList.value;
  isAdd.value=false;
}

async function  pagechange(page:number){
  pagenum.value=page;
  await getdata();
}

async function ins(){
  if (router.params.id){
    const exam2=await getdata2();
    examform.examName=exam2.examName;
    examform.type=exam2.type;
    examform.totalTime=exam2.totalTime;
    examform.startTime=exam2.startTime;
    examform.endTime=exam2.endTime;
    examform.questionIdList=exam2.questionIdList?? [];
    examList.value=exam2.questionIdList ?? [];
  }
  await getdata();
}
async function getdata2(){
  const res2=await axios.get('http://150.158.110.63:8080/exam',{
    params:{
      id : router.params.id,
    }
  })
  return res2.data.data;
}

onMounted(()=>{
  ins();
})
</script>

<template>
  <div>
    <el-form :model="examform" :rules="rules" @submit="submit()" ref="formref">
      <el-form-item prop="examName" label="考试名称">
        <el-input v-model="examform.examName">
        </el-input>
      </el-form-item>
      <el-form-item prop="questionIdList" label="选择题目">
        <el-button @click="isAdd=true">添加题目</el-button>
      </el-form-item>
      <el-form-item prop="startTime" label="开始时间">
        <el-date-picker
            v-model="examform.startTime"
            type="datetime"
        />
      </el-form-item>
      <el-form-item prop="endTime" label="结束时间">
        <el-date-picker
            v-model="examform.endTime"
            type="datetime"
        />
      </el-form-item>
      <el-form-item prop="totalTime" label="考试时间">
        <el-input-number v-model="examform.totalTime" :min="30" :max="180" :controls="false"/>
      </el-form-item>
      <el-form-item label="参与者">
        <el-select v-model="examform.type">
          <el-option label="实习生" :value="1"></el-option>
          <el-option label="兽医" :value="2"></el-option>
          <el-option label="兽医2" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="submit()">提交</el-button>
        <el-button @click="goto('/examManage')">取消</el-button>
      </el-form-item>
    </el-form>
    <el-dialog v-model="isAdd" title="添加题目" width="1000" class="xdialog" @closed="examList=[]">
      <table class="xtable">
        <colgroup>
          <col width="25%">
          <col width="25%">
          <col width="25%">
          <col width="25%">
        </colgroup>
        <thead>
        <tr>
          <th>ID</th>
          <th>score</th>
          <th>statement</th>
          <th>operation</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in questiondata" :key="item.id">
          <td>{{item.id}}</td>
          <td>{{item.score}}</td>
          <td>{{item.statement}}</td>
          <td>
            <el-checkbox :checked="examList.indexOf(item.id)>=0" @change="(value)=>{Add(value,item.id)}"></el-checkbox>
          </td>
        </tr>
        </tbody>
      </table>
      <el-pagination
          small
          background
          layout="prev, pager, next"
          :page-size="pagesize"
          :total="20"
          class="mt-4"
          @current-change="pagechange"
      />
      <template #footer>
        <el-button @click="insured()">确认</el-button>
        <el-button @click="isAdd=false">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="stylus">

</style>