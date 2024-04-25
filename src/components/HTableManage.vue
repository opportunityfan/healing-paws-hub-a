<script lang="js">
import {string} from "three/examples/jsm/nodes/shadernode/ShaderNode";
import axios from "axios";
import {CaretBottom, CaretTop, DCaret} from "@element-plus/icons-vue";
import HButton from "@/components/HButton.vue";

export default {
  components: {HButton, CaretBottom, CaretTop, DCaret},
  emits: ['trans','publish'],
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
      timesort: 0,
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
      const res = await axios.put('http://150.158.110.63:8080/exam/newrelease',
        {
          id: this.statement,
        }
      )
      console.log(res.data.code);
      console.log(res.data.msg);
      console.log(res.data.data);
      this.$emit('publish',this.ispublish);
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
    },
    sort(){
      if(this.timesort===0){
        this.timesort=1;
      }
      else if(this.timesort===1){
        this.timesort=2;
      }
      else{
        this.timesort=0;
      }
      this.$emit('trans',this.timesort);
    }
  }
}
</script>

<template>
<!--  {{tabledata}}-->
  <table class="xtable">
    <colgroup>
      <col width="15%">
      <col width="35%">
      <col width="10%">
      <col width="10%">
      <col width="30%">
    </colgroup>
    <thead>
    <tr>
      <th class="tabletitle">name</th>
      <th class="tabletitle" @click="sort()">
        <el-row align="middle" justify="center">
          考试时间
          <el-icon v-if="timesort===0"><DCaret /></el-icon>
          <el-icon v-if="timesort===1"><CaretTop /></el-icon>
          <el-icon v-if="timesort===2"><CaretBottom /></el-icon>
        </el-row>
      </th>
      <th class="tabletitle">score</th>
      <th class="tabletitle">flag</th>
      <th class="tabletitle">operation</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="(item,index) in tabledata" :key="index">
      <td>{{item.examName}}</td>
      <td>{{item.startTime}}-{{item.endTime}}</td>
      <td>{{item.totalScore}}</td>
      <td>
        <span v-if="item.state===1">已发布</span>
        <span v-if="item.state===0">未发布</span>
        <span v-if="item.state===-1">已结束</span>
      </td>
      <td>
        <el-row justify="center">
          <div class="flex-row" style="width: 80px">
            <router-link :to="`/examUpdate/${item.id}`">
              <HButton style="width: 20px;margin: auto 3px" height="20px"><i class='bx bx-edit-alt'></i></HButton>
            </router-link>
            <HButton style="width: 20px;margin: auto 3px" height="20px" @click="state(item)"><i class='bx bx-send' ></i></HButton>
            <HButton style="width: 20px;margin: auto 3px" height="20px" type="danger" @click="state2(item)"><i class='bx bx-trash'></i></HButton>
            <!--          <el-button @click="state2(item.id)">删除</el-button>-->
          </div>
        </el-row>
<!--        <router-link :to="`/examUpdate/${item.id}`">-->
<!--          <el-button>修改</el-button>-->
<!--        </router-link>-->
<!--        <el-button @click="state(item)">发布</el-button>-->
<!--        <el-button @click="state2(item)">删除</el-button>-->
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
        background-color #C6CCBA
        color #FFF9E9
      }
    }
    &:nth-child(odd){
      td{
        color #5A8100
      }
    }
  }

}
.tabletitle{
  color:#5A8100;
  height:43px;
  line-height : 43px;
  border-bottom: 1px solid #5A8100;
}
.tdlink{
  text-decoration: none;
  color: inherit;
}
</style>
