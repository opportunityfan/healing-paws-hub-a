<script setup lang="ts">
import HButton from "@/components/HButton.vue";
import axios from "axios";
import {onMounted, ref} from "vue";
import HPagination from "@/components/HPagination.vue";
import {showMessage} from "@/assets/api";
import HSearch from "@/components/HSearch.vue";
import {ElMessage} from "element-plus";
// import HDealWith from "@/components/HDealWith.vue";

const questiondata=ref({});
const text=ref(null);
const isdelete=ref(false);
const statement=ref('');
const pageSize=ref(5);
const pageNum=ref(1);
const pageNation = ref()
async function getdata(currentPage:number,pagesize : number){

  console.log('测试getdata',currentPage)
  console.log('ceshipagesize',pagesize)
  const res = await axios.get('http://150.158.110.63:8080/question/group',{
    params:{
      diseases:text.value,
      pageNum: currentPage,
      pageSize: pagesize,
    }
  })
  console.log('ceshi res.data',res.data)
  pageNum.value=res.data.data.totalPages;
  questiondata.value=res.data.data.listData;
  console.log(questiondata.value);
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
  if(res.data.code!=200){
    ElMessage({
      showClose: true,
      message: res.data.data,
      type: 'error',
    })
  }
  else{
    ElMessage({
      showClose: true,
      message: '删除成功',
      type: 'success',
    })
  }
  isdelete.value=false;
}

function search(){
  getdata(pageNation.value.data.currentPage,pageSize.value);
}

async function  pagechange(page:number){
  pageNum.value=page;
  await  getdata(pageNation.value.data.currentPage,pageSize.value);
}

onMounted(()=>{
  getdata(pageNation.value.data.currentPage,pageSize.value);
})
</script>

<template>
  <div>
    <router-link to="/subjectAdd">
      <HButton>前往添加题目</HButton>
    </router-link>
    <HSearch v-model="text" @onEnter="search">
    </HSearch>
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
        <td>{{item.name}}</td>
        <td>{{item.score}}</td>
        <td>
          {{item.type.join(',')}}
        </td>
        <td>
          <el-row justify="center">
            <div class="flex-row" style="width: 80px">
              <router-link :to="`/subjectUpdate/${item.id}`">
                <HButton style="width: 25px;margin: auto 5px" height="20px"><i class='bx bx-edit-alt'></i></HButton>
              </router-link>
              <HButton style="width: 25px;margin: auto 5px" height="20px" type="danger" @click="state2(item.id)"><i class='bx bx-trash'></i></HButton>
              <!--          <el-button @click="state2(item.id)">删除</el-button>-->
            </div>
          </el-row>
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
<!--    <el-pagination-->
<!--        small-->
<!--        background-->
<!--        layout="prev, pager, next"-->
<!--        :page-size="pageSize"-->
<!--        :total="100"-->
<!--        class="mt-4"-->
<!--        @current-change="pagechange"-->
<!--    />-->
    <HPagination @onPageChange="getdata" :itemsPerPage="pageSize" :total-pages="pageNum" ref="pageNation">
    </HPagination>
  </div>
</template>

<style scoped lang="stylus">

</style>