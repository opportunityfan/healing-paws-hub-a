<script setup lang="ts">
import HSearch from "@/components/HSearch.vue";
import HTimePicker from "@/components/HTimePicker.vue";
import HButton from "@/components/HButton.vue";
import HTable from "@/components/HTable.vue";
import HDropdown from "@/components/HDropdown.vue";
import {goto} from "@/assets/api";
import {onMounted, ref} from "vue";
import axios from "@/assets/axios";
import {dayjs} from "element-plus";

function ChangeRecord(){
  goto('/examLink');
}

const text=ref('');
const choose=ref(null);
const value2=ref('');
const tabledata=ref([]);
const pagenum=ref(1);
const pagesize=ref(7);
const sort=ref(0);
let c=ref(null);
let d=ref(null);
async function getData(){
  console.log("value2=");
  console.log(value2.value);
  const [a,b]= value2.value;
  c=dayjs(a).format('YYYY-MM-DD hh:mm:ss');
  d=dayjs(b).format('YYYY-MM-DD hh:mm:ss');
  if (value2.value===''){
    c=null;
    d=null;
  }
  console.log(choose.value);
  const res=await axios.get('/exam/page/multi',{
    params: {
      sortTime: sort.value,
      // // sortScore: sort.value==="sortScore",
      examName: text.value,
      type: choose.value,
      startTime: c,
      endTime: d,
      pageNum:pagenum.value,
      pageSize:pagesize.value,
    }
  }).then((result)=>{
        console.log(result.data.data);
        tabledata.value=result.data.data.listData;
      }
  );
}
async function  pagechange(page:number){
  pagenum.value=page;
  await getData();
}
onMounted(()=>{
  getData();
})

function search(){
  console.log("search");
  getData();
}
function operation(order:string){
  sort.value= order;
  getData();
}
function clearup(){
  sort.value=0;
  text.value='';
  choose.value=null;
  value2.value='';
  getData();
}

function times(x:number){
  sort.value=x;
  getData();
}
</script>

<template>
  <div>
    <div class="shang">
      <HButton @click="ChangeRecord">前往考试记录</HButton>
      <!--      <HSearch></HSearch>-->
      <!--      <HTimePicker></HTimePicker>-->
      <div class="hang">
        <div class="zuo">
          <el-input v-model="text" @blur="search">
          </el-input>
        </div>
        <div class="you">
          <el-select v-model="choose" @change="search">
            <el-option :value="1" label="实习生">
            </el-option>
            <el-option :value="2" label="教师">
            </el-option>
            <el-option :value="3" label="兽医">
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
              @change="search"
          />
        </div>
      </div>
      <div class="hang">
        <el-button @click="operation('sortTime')">按时间顺序</el-button>
        <el-button @click="clearup()">清空</el-button>
      </div>
    </div>
    <div class="xia">
      <HTable :tabledata="tabledata" @trans="times"></HTable>
    </div>
    <br>
    <el-row justify="center">
      <el-pagination
          small
          layout="prev, pager, next"
          :page-size="pagesize"
          :total="100"
          class="mt-4 fenye"
          @current-change="pagechange"
      />
    </el-row>

  </div>
</template>

<style scoped lang="stylus">
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
.fenye{
  color:#5A8100;
}
</style>