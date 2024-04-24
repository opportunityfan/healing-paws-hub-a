<script setup lang="ts">

import HButton from "@/components/HButton.vue";
import {goto} from "@/assets/api";
import axios from "@/assets/axios";
import store from "@/store";
import {onMounted, ref} from "vue";

const pagenum=ref(1);
const pagesize=ref(5);
const testdata=ref([]);

function go(){
  goto('/exam');
}
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
  console.log(res);
  testdata.value=res.data.data.listData;
}


async function  pagechange(page:number){
  pagenum.value=page;
  await getData();
}

onMounted(()=>{
  getData();
})
</script>

<template>
<div>
  <HButton @click="go">
    前往考试
  </HButton>
  <h3>
    考试记录
  </h3>
  <table class="xtable">
    <colgroup>
      <col width="30%">
      <col width="40%">
      <col width="30%">
    </colgroup>
    <thead>
    <tr>
      <th>name</th>
      <th>date</th>
      <th>score</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="(item,index) in testdata" :key="index">
      <td>
        <router-link :to="`/examRecord/${item.examId}`" class="tdlink">
          {{item.examName}}
        </router-link>
      </td>
      <td>{{item.time}}</td>
      <td>{{item.score}}</td>
    </tr>
    </tbody>
  </table>
  <el-pagination
      small
      background
      layout="prev, pager, next"
      :page-size="pagesize"
      :total="7"
      class="mt-4"
      @current-change="pagechange"
  />
</div>
</template>

<style scoped lang="stylus">
.xtable{
  width: 100%;
  border-collapse: collapse;
  td{
    height :43px;
    line-height : 43px;

  }
  tr{
    &:nth-child(even){
      td{
        background-color #7A806E
        color #d9d9d9
      }
    }
    &:nth-child(odd){
      td{
        color #5A8100
      }
    }
  }
}
.tdlink{
  text-decoration: none;
  color: inherit;
}
</style>