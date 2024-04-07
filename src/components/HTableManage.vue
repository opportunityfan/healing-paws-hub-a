<script lang="js">
import {string} from "three/examples/jsm/nodes/shadernode/ShaderNode";
import axios from "axios";

export default {
  props: {
    tabledata: {
      type:Array,
      defaultValue:[]
    }
  },
  data(){
    return {
      abc:"123",
      ispublish: false,
      isdelete: false,
      statement: "",
      ifpublish:{},
    }
  },
  methods:{
    state(Item){
      console.log(this.ispublish);
      this.ispublish=true;
      this.statement=Item.id;
    },
    state2(Item){
      console.log(this.isdelete);
      this.isdelete=true;
      this.statement=Item.id;
    },
    async publish() {
      this.ifpublish.id=this.statement;
      const res = await axios.put('http://150.158.110.63:8080/exam/release',
        {
          id: this.statement,
        }
      )
      console.log(res.data.code);
      console.log(res.data.msg);
      console.log(res.data.data);
      this.ispublish=false;
    },
    async delete1() {
      const res = await axios.delete('http://150.158.110.63:8080/exam',{
        params: {
          id: this.statement,
        }
      })
      console.log(res.data.code);
      console.log(res.data.msg);
      console.log(res.data.data);
      this.isdelete=false;
    }
  }
}
</script>

<template>
<!--  {{tabledata}}-->
  <table class="xtable">
    <colgroup>
      <col width="15%">
      <col width="30%">
      <col width="15%">
      <col width="15%">
      <col width="25%">
    </colgroup>
    <thead>
    <tr>
      <th>name</th>
      <th>date</th>
      <th>score</th>
      <th>flag</th>
      <th>operation</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="(item,index) in tabledata" :key="index">
      <td>{{item.examName}}</td>
      <td>{{item.startTime}}-{{item.endTime}}</td>
      <td>{{item.totalScore}}</td>
      <td>
        <span v-if="item.release===true">已发布</span>
        <span v-if="item.release===false">未发布</span>
      </td>
      <td>
        <router-link :to="`/examUpdate/${item.id}`">
          <el-button>修改</el-button>
        </router-link>
        <el-button @click="state(item)">发布</el-button>
        <el-button @click="state2(item)">删除</el-button>
      </td>
    </tr>
    </tbody>
  </table>
  <el-dialog v-model="ispublish" title="发布" width="500" :center="true" class="xdialog">
    <span>是否确认发布</span>
<!--    <span>{{statement}}</span>-->
    <template #footer>
      <el-button color="#9FB66B" @click="publish()"><span>确认</span></el-button>
      <el-button color="#5A8100" @click="ispublish=false">取消</el-button>
    </template>
  </el-dialog>
  <el-dialog v-model="isdelete" title="删除" width="500" :center="true" class="xdialog">
    <span>是否确认删除</span>
    <!--    <span>{{statement}}</span>-->
    <template #footer>
      <el-button color="#9FB66B" @click="delete1()"><span>确认</span></el-button>
      <el-button color="#5A8100" @click="isdelete=false">取消</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="stylus">
.xtable{
  width: 100%;
  border-collapse: collapse;
  td{
    border-bottom: 1px solid black;
  }
}
</style>

<style lang="stylus">
.xdialog{
  background-color: #FFF9E9;
}
</style>
