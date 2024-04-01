<script lang="ts">
import {string} from "three/examples/jsm/nodes/shadernode/ShaderNode";

export default {
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
  }
}
</script>

<template>
<table class="xtable">
  <colgroup>
    <col width="20%">
    <col width="40%">
    <col width="20%">
    <col width="20%">
  </colgroup>
  <thead>
  <tr>
    <th>name</th>
    <th>date</th>
    <th>score</th>
    <th>attend</th>
  </tr>
  </thead>
  <tbody>
  <tr v-for="(item,index) in tabledata" :key="index">
    <td>{{item.examName}}</td>
    <td>{{item.startTime}}-{{item.endTime}}</td>
    <td>{{item.totalScore}}</td>
    <td>
      <router-link :to="`/examStart/${item.id}`">
        <el-button>
          进入
        </el-button>
      </router-link>
    </td>
  </tr>
  </tbody>
</table>
</template>

<style scoped lang="scss">
.xtable{
  width: 100%;
  border-collapse: collapse;
  td{
    border-bottom: 1px solid black;
  }
}
</style>