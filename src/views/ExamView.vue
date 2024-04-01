<script setup lang="ts">
import HSearch from "@/components/HSearch.vue";
import HTimePicker from "@/components/HTimePicker.vue";
import HButton from "@/components/HButton.vue";
import HTable from "@/components/HTable.vue";
import HDropdown from "@/components/HDropdown.vue";
import {goto} from "@/assets/api";
import {onMounted, ref} from "vue";
import axios from "axios";
function ChangeRecord(){
  goto('/examLink');
}

const text=ref('');
const choose=ref('');
const value2=ref('');
const tabledata=ref([]);
const pagenum=ref(1);
const pagesize=ref(1);

async function getData(){
  const res=await axios.get('http://150.158.110.63:8080/exam/page',{
    params: {
      pageNum:pagenum.value,
      pageSize:pagesize.value,
    }
  });
  console.log(res.data.data);
  tabledata.value=res.data.data;
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
    <div class="shang">
      <HButton @click="ChangeRecord">考试</HButton>
<!--      <HSearch></HSearch>-->
<!--      <HTimePicker></HTimePicker>-->
      <div class="hang">
        <div class="zuo">
          <el-input v-model="text">
          </el-input>
        </div>
        <div class="you">
          <el-select v-model="choose">
            <el-option value="1">
              实习生
            </el-option>
            <el-option value="2">
              2
            </el-option>
            <el-option value="3">
              3
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="flex-row">
        <div class="hang">
          <el-date-picker
              v-model="value2"
              type="daterange"
              start-placeholder="Start Date"
              end-placeholder="End Date"
              :default-value="[new Date(2010, 9, 1), new Date(2010, 10, 1)]"
          />
          </div>
      </div>
      <div class="hang">
        <el-button >按序号顺序</el-button>
        <el-button >按时间顺序</el-button>
      </div>
    </div>
    <div class="xia">
      <HTable :tabledata="tabledata"></HTable>
    </div>
    <el-pagination
        small
        background
        layout="prev, pager, next"
        :page-size="pagesize"
        :total="4"
        class="mt-4"
        @current-change="pagechange"
    />
  </div>
</template>

<style scoped lang="scss">
.shang{
  //background-color: #FFFFFF;
  padding: 16px;
}
//.xia{background-color: #FFFFFF}
.hang{
  display: flex;
  gap: 10px;
  .zuo{
    flex: 1;
  }
  .you{
    flex: 1;
  }
}
</style>