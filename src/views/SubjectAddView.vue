<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {string} from "three/examples/jsm/nodes/shadernode/ShaderNode";
import {dayjs, FormEmits, FormInstance} from "element-plus";
import axios from "axios";
import {goto} from "@/assets/api";
import store from "@/store";

const subjectform=reactive({
  statement: '',
  answer:'',
  type:[],
  detail:'',
  score:1,
});
const rules=reactive({
  statement: [
    {
      required:true,
      message:'题目描述必填',
      trigger:'blur',
    }
  ],
  answer: [
    {
      required:true,
      message:'题目答案必填',
      trigger:'blur',
    }
  ],
  score: [
    {
      required:true,
      message:'题目分数必填',
      trigger:'blur',
    }
  ]
});
const formref=ref<FormInstance>();
const isAdd=ref(false);
const diseasedata=ref([]);
const typeList=ref<string[]>([]);
const pageSize=ref(10);
const pageNum=ref(1);
function submit(){
  formref.value?.validate((valid)=>{
    if(valid){
      console.log(subjectform);
      getsubmit();
    }
  });
}

async function getsubmit(){
  console.log(subjectform);
  const result=await axios.post('http://150.158.110.63:8080/question',subjectform);
  console.log(result);
  goto('/subject');
}

async function  pagechange(page:number){
  pageNum.value=page;
  await getdata();
}
async function getdata(){
  const res = await axios.get('http://150.158.110.63:8080/disease',{
    params:{
      pageNum: pageNum.value,
      pageSize: pageSize.value,
    },
    headers: {
      'token': store.state.token
    }
  })
  console.log(res.data.data);
  diseasedata.value=res.data.data;
}


function Add(Value:boolean,Id:string){
  console.log(Value);
  if(Value){
    typeList.value.push(Id);
  }
  else{
    typeList.value.splice(typeList.value.indexOf(Id),1);
  }
}

function insured(){
  (subjectform.type as string[])=typeList.value;
  getdata();
  isAdd.value=false;
}

onMounted(()=>{
  getdata();
})
</script>

<template>
  <div>
<!--    {{diseasedata}}-->
    <el-form :model="subjectform" :rules="rules" @submit="submit()" ref="formref">
      <el-form-item prop="statement" label="题目描述">
        <el-input v-model="subjectform.statement">
        </el-input>
      </el-form-item>
      <el-form-item prop="answer" label="题目答案">
        <el-input v-model="subjectform.answer">
        </el-input>
      </el-form-item>
      <el-form-item prop="type" label="添加类型">
        <el-button @click="isAdd=true">选择病种</el-button>
      </el-form-item>
      <el-form-item prop="detail" label="题目答案解析">
        <el-input v-model="subjectform.detail">
        </el-input>
      </el-form-item>
      <el-form-item prop="score" label="题目分数">
        <el-input-number v-model="subjectform.score" :min="1" :max="100" :controls="false"/>
      </el-form-item>
      <el-form-item>
        <el-button @click="submit()">提交</el-button>
        <el-button @click="goto('/subject')">取消</el-button>
      </el-form-item>
    </el-form>
    <el-dialog v-model="isAdd" title="添加题目" width="1000" class="xdialog" @closed="typeList=[]">
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
          <th>name</th>
          <th>type</th>
          <th>operation</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in diseasedata" :key="item.id">
          <td>{{item.id}}</td>
          <td>{{item.name}}</td>
          <td>{{item.type}}</td>
          <td>
            <el-checkbox @change="(value)=>{Add(value,item.name)}"></el-checkbox>
          </td>
        </tr>
        </tbody>
      </table>
      <el-pagination
          small
          background
          layout="prev, pager, next"
          :page-size="pageSize"
          :total="61"
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