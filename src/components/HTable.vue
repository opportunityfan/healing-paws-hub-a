<script lang="ts">
import {string} from "three/examples/jsm/nodes/shadernode/ShaderNode";
import {defineComponent} from "vue";

export default defineComponent({
  props: {
    tabledata: {
      type:Array,
      defaultValue:[]
    }
  },
  data(){
    return {
      abc:"123"
    }
  },
  methods:{
    toexam(href:string){
      window.location.href=href;
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
    <th class="tabletitle">考试时间</th>
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
