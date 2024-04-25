<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {string} from "three/examples/jsm/nodes/shadernode/ShaderNode";
import {dayjs, ElMessage, FormEmits, FormInstance} from "element-plus";
import axios from "axios";
import {goto} from "@/assets/api";
import store from "@/store";
import {useRoute} from "vue-router";
import MarkdownEditor from "@/components/MarkdownEditor.vue";
import HScroller from "@/components/HScroller.vue";
import HPagination from "@/components/HPagination.vue";
const router=useRoute();
const subjectform=reactive({
  id:router.params.id,
  name:'',
  statement: '',
  answer:'',
  type:[],
  detail:'',
  questionType:1,
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
const pageNation = ref();
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
  const result=await axios.put('http://150.158.110.63:8080/question',subjectform);
  console.log(result);
  if(result.data.code!=200){
    ElMessage({
      showClose: true,
      message: result.data.data,
      type: 'error',
    })
  }
  else{
    ElMessage({
      showClose: true,
      message: '修改成功',
      type: 'success',
    })
  }
  goto('/subject');
}

async function getdata(currentPage:number,pagesize : number){
  const res = await axios.get('http://150.158.110.63:8080/disease',{
    params:{
      pageNum: currentPage,
      pageSize: pagesize,
    },
    headers: {
      'token': store.state.token
    }
  })
  console.log(res.data.data);
  pageNum.value=res.data.data.totalPages;
  diseasedata.value=res.data.data.listData;
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
  getdata(pageNation.value.data.currentPage,pageSize.value);
  isAdd.value=false;
}

async function getdata2(){
  const res2=await axios.get('http://150.158.110.63:8080/question',{
    params:{
      id : router.params.id,
    }
  })
  return res2.data.data;
}
async function ins(){
  if (router.params.id){
    const question2=await getdata2();
    subjectform.name=question2.name;
    subjectform.statement=question2.statement;
    subjectform.answer=question2.answer;
    subjectform.detail=question2.detail;
    subjectform.score=question2.score;
    subjectform.questionType=question2.questionType;
    subjectform.type=question2.type ?? [];
    typeList.value=question2.type??[];
  }
  await getdata(1,pageSize.value);
}

onMounted(()=>{
  ins();
})
</script>

<template>
  <div>
    <!--    {{diseasedata}}-->
    <div class="full0">
      <HScroller scroll-direction="column">
        <div class="full1">
          <el-form :model="subjectform" :rules="rules" @submit="submit()" ref="formref">
            <el-form-item prop="name" label="题目名字">
              <el-input v-model="subjectform.name">
              </el-input>
            </el-form-item>
            <el-form-item prop="statement" label="题目描述">
              <!--        <el-input v-model="subjectform.statement">-->
              <!--        </el-input>-->
              <MarkdownEditor v-model="subjectform.statement" height="200px" class="full2"></MarkdownEditor>
            </el-form-item>
            <el-form-item prop="answer" label="题目答案">
              <el-input v-model="subjectform.answer">
              </el-input>
            </el-form-item>
            <el-form-item prop="type" label="添加所属病类型">
              <el-button @click="isAdd=true">选择病种</el-button>
            </el-form-item>
            <el-form-item prop="questionType" label="添加题目类型">
              <el-select v-model="subjectform.questionType">
                <el-option :value="1" label="判断题"></el-option>
                <el-option :value="2" label="选择题"></el-option>
                <el-option :value="3" label="填空题"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="detail" label="题目答案解析">
              <!--        <el-input v-model="subjectform.detail">-->
              <!--        </el-input>-->
              <MarkdownEditor v-model="subjectform.detail" height="200px"></MarkdownEditor>
            </el-form-item>
            <el-form-item prop="score" label="题目分数">
              <el-input-number v-model="subjectform.score" :min="1" :max="100" :controls="false"/>
            </el-form-item>
            <el-form-item>
              <el-button @click="submit()">提交</el-button>
              <el-button @click="goto('/subject')">取消</el-button>
            </el-form-item>
          </el-form>
          <br>
          <br>
          <br>
        </div>
      </HScroller>
    </div>
    <el-dialog v-model="isAdd" title="添加题目" width="1000" class="xdialog" @closed="typeList=[]">
      <table class="xtable">
        <colgroup>
          <col width="25%">
          <col width="50%">
          <col width="25%">
        </colgroup>
        <thead>
        <tr>
          <th>name</th>
          <th>type</th>
          <th>operation</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in diseasedata" :key="item.id">
          <td>{{item.name}}</td>
          <td>{{item.type}}</td>
          <td>
            <el-checkbox @change="(value)=>{Add(value,item.name)}"></el-checkbox>
          </td>
        </tr>
        </tbody>
      </table>
      <HPagination @onPageChange="getdata" :itemsPerPage="pageSize" :total-pages="pageNum" ref="pageNation">
      </HPagination>
      <template #footer>
        <el-button @click="insured()">确认</el-button>
        <el-button @click="isAdd=false">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="stylus">
.full0{
  height 650px;
  overflow auto;
  border-color #5A8100;
  border-width 1px;
  border-style solid;
}
.full1{
  margin-top 30px;
  margin-left 30px;
  margin-bottom 30px;
  width 90%;
}
</style>