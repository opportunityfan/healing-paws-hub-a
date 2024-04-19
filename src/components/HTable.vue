<script lang="ts">
import {string} from "three/examples/jsm/nodes/shadernode/ShaderNode";
import {defineComponent} from "vue";
import {CaretBottom, CaretTop, DCaret} from '@element-plus/icons-vue'
export default defineComponent({
  components: {CaretBottom, CaretTop, DCaret},
  emits: ['trans'],
  props: {
    tabledata: {
      type:Array,
      defaultValue:[]
    }
  },
  data(){
    return {
      abc:"123",
      timesort: 0,
    }
  },
  methods:{
    toexam(href:string){
      window.location.href=href;
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
})
</script>

<template>
<table class="xtable">
  <colgroup>
    <col width="25%">
    <col width="50%">
    <col width="25%">
  </colgroup>
  <thead>
  <tr>
    <th class="tabletitle">考试名称</th>
    <th class="tabletitle" @click="sort()">
      <el-row align="middle" justify="center">
        考试时间
        <el-icon v-if="timesort===0"><DCaret /></el-icon>
        <el-icon v-if="timesort===1"><CaretTop /></el-icon>
        <el-icon v-if="timesort===2"><CaretBottom /></el-icon>
      </el-row>

    </th>
    <th class="tabletitle">考试分数</th>
  </tr>
  </thead>
  <tbody>
  <tr v-for="(item,index) in tabledata" :key="index">
    <td>
        <router-link :to="'/examStart/'+item.id" class="tdlink">
            {{item.examName}}
        </router-link>
    </td>
    <td>{{item.startTime}}-{{item.endTime}}</td>
    <td>{{item.totalScore}}</td>
  </tr>
  </tbody>
</table>
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
        background-color #5A8100
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
