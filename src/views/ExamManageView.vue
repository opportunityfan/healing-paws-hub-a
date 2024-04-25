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
import HTableManage from "@/components/HTableManage.vue";
import HPagination from "@/components/HPagination.vue";

const text=ref('');
const choose=ref(null);
const value2=ref('');
const tabledata=ref([]);
const pagenum=ref(1);
const pagesize=ref(7);
const sort=ref(0);
let c=ref(null);
let d=ref(null);
const pageNation = ref();
const drawer=ref(false);
async function getData(currentPage:number,pageSize : number){
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
      pageNum:currentPage,
      pageSize:pageSize,
    }
  }).then((result)=>{
      console.log(result.data);
      console.log(result.data.data);
      tabledata.value=result.data.data.listData;
      console.log(tabledata.value);
      }
  );
}
async function  pagechange(page:number){
  pagenum.value=page;
  await getData(pageNation.value.data.currentPage,pagesize.value);
}
onMounted(()=>{
  getData(pageNation.value.data.currentPage,pagesize.value);
})

function search(){
  console.log("search");
  getData(pageNation.value.data.currentPage,pagesize.value);
}
function times(x:number){
  sort.value=x;
  getData(pageNation.value.data.currentPage,pagesize.value);
}

function qt(){
  choose.value=1;
  search();
  drawer.value=false;
}
function ys(){
  choose.value=2;
  search();
  drawer.value=false;
}

function yz(){
  choose.value=3;
  search();
  drawer.value=false;
}
function clearup(){
  sort.value=0;
  text.value='';
  choose.value=null;
  value2.value='';
  getData(pageNation.value.data.currentPage,pagesize.value);
}
</script>

<template>
  <div>
    <div class="shang">
      <router-link to="/examAdd">
        <HButton>前往添加考试</HButton>
      </router-link>
      <HSearch style="width: 80%" v-model="text" @onEnter="search"></HSearch>
      <br>
      <!--      <HSearch></HSearch>-->
      <!--      <HTimePicker></HTimePicker>-->
<!--      <div class="hang">-->
<!--        <div class="zuo">-->
<!--          <el-input v-model="text" @blur="search">-->
<!--          </el-input>-->
<!--        </div>-->
<!--        <div class="you">-->
<!--          <el-select v-model="choose" @change="search">-->
<!--            <el-option :value="1" label="实习生">-->
<!--            </el-option>-->
<!--            <el-option :value="2" label="教师">-->
<!--            </el-option>-->
<!--            <el-option :value="3" label="兽医">-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--        </div>-->
<!--      </div>-->
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
        <div class="zuo">
          <HButton @click="drawer = true">考试身份选择</HButton>
        </div>
        <div class="you">
          <HButton  @click="clearup()">清空条件</HButton>
        </div>
      </div>
    </div>
<!--    {{tabledata}}-->
    <div class="xia">
      <HTableManage :tabledata="tabledata"  @trans="times"></HTableManage>
    </div>
      <HPagination @onPageChange="getData" :itemsPerPage="pagesize" :total-pages="pagenum" ref="pageNation">
      </HPagination>
    <div>
      <el-drawer v-model="drawer" title="选择你的考试身份" :with-header="false" size="50%" class="wind">
        <div class="wind">
          <span>选择你的考试身份</span>
          <el-row>
            <HButton  @click="qt()" class="quest">前台</HButton>
            <HButton  @click="ys()" class="quest">医师</HButton>
            <HButton  @click="yz()" class="quest">医助</HButton>
          </el-row>
        </div>
      </el-drawer>
    </div>
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
</style>