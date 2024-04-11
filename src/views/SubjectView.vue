<script setup lang="ts">
import HButton from "@/components/HButton.vue";
import axios from "axios";
import {onMounted, ref} from "vue";
// import HDealWith from "@/components/HDealWith.vue";

const questiondata=ref({});
const text=ref(null);
const isdelete=ref(false);
const statement=ref('');
const pageSize=ref(10);
const pageNum=ref(1)
async function getdata(){
  const res = await axios.get('http://150.158.110.63:8080/question/group',{
    params:{
      diseases:text.value,
      pageNum: pageNum.value,
      pageSize: pageSize.value,
    }
  })
  questiondata.value=res.data.data;
}

function state2(ID:string){
  console.log(isdelete);
  isdelete.value=true;
  statement.value=ID;
}

async function delete1() {
  const res = await axios.delete('http://150.158.110.63:8080/question',{
    params: {
      id: statement.value,
    }
  })
  console.log(res.data);
  isdelete.value=false;
}

function search(){
  getdata();
}

async function  pagechange(page:number){
  pageNum.value=page;
  await getdata();
}

onMounted(()=>{
  getdata();
})
</script>

<template>
  <div>
    <router-link to="/subjectAdd">
      <HButton>前往添加题目</HButton>
    </router-link>
    <el-input v-model="text" @blur="search">
    </el-input>
    <table class="xtable">
      <colgroup>
        <col width="20%">
        <col width="20%">
        <col width="30%">
        <col width="30%">
      </colgroup>
      <thead>
      <tr>
        <th>Statement</th>
        <th>score</th>
        <th>category</th>
        <th>operation</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in questiondata" :key="item.id">
        <td>{{item.statement}}</td>
        <td>{{item.score}}</td>
        <td>
          {{item.type.join(',')}}
        </td>
        <td>
          <router-link :to="`/subjectUpdate/${item.id}`">
            <el-button>修改</el-button>
          </router-link>
          <el-button @click="state2(item.id)">删除</el-button>
        </td>
      </tr>
      </tbody>
    </table>
    <el-dialog v-model="isdelete" title="删除" width="500" :center="true" class="xdialog">
      <span>是否确认删除</span>
      <!--    <span>{{statement}}</span>-->
      <template #footer>
        <el-button color="#9FB66B" @click="delete1()"><span>确认</span></el-button>
        <el-button color="#5A8100" @click="isdelete=false">取消</el-button>
      </template>
    </el-dialog>
    <el-pagination
        small
        background
        layout="prev, pager, next"
        :page-size="pageSize"
        :total="100"
        class="mt-4"
        @current-change="pagechange"
    />
  </div>
</template>

<style scoped lang="stylus">

</style>