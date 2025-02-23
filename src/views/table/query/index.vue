<template>
  <div class="container">
    <!-- 左侧栏 -->
    <a-card class="left-card">
      <a-button type="dashed" style="margin-left: 4px;width: 160px;border-color: #409EFF;color: #409EFF">新建对话</a-button>
    </a-card>

    <!-- 右侧内容 -->
    <a-card class="right-card">
      <div style="width: 100%;float: left;">
        <div style="width: 100px;height: 50px;float: left;">
          <a-button class="change-view" type="dashed" shape="round" v-if="!data.isShow" @click="changeView">切换表</a-button>
        </div>
        <a-textarea
          v-model:value="query"
          placeholder="请输入您要查询的内容，按Enter键发送查询"
          style="margin-left: calc(20% - 100px);width: 60%;white-space: pre-wrap;resize: none;"
          :loading="isSearchLoading"
          :auto-size="{ minRows: 2, maxRows: 2 }"
          @keydown.enter.native="removeNewline"
          @keydown.enter="handleQuery"
        />
      </div>

      <div class="table-info" v-if="data.isShow">
        <a-row :gutter="[16, 16]">
          <a-col :span="6" v-for="item in data.cardData" :key="item.tableId">
            <a-card class="table-card" :title="item.tableName">
              <div class="table-desc">{{ item.tableComment }}</div>
              <div class="table-handle">
                <a-button class="handle" type="dashed" shape="round" @click="preview(item)" >预览</a-button>
                <a-button class="handle" type="dashed" shape="round" @click="question(item)" >提问</a-button>
              </div>

            </a-card>
          </a-col>
        </a-row>
      </div>

      <!-- 查询结果展示 -->
      <div class="data-info" v-if="!data.isShow">
        <div class="results-container">
          <h3>查询结果</h3>
  <!--          <a-table :columns="columns" :data-source="results"/>-->

          <!-- 图表展示 -->
          <div class="chart-container">
            <h3>图表展示</h3>
            <bar-chart ref="chart" :chartData="barData"></bar-chart>
          </div>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import {Bar} from 'vue-chartjs';
import {ref, computed, reactive} from 'vue';
import {message} from 'ant-design-vue';
import BarChart from '../../../components/charts/BarChart.vue';
import {getAllTable} from "@/api/table/table";
import {talkQuestion} from "@/api/table/query";
import {barDataItem, TableVo} from "@/views/table/query/index"; // 确保导入的是正确的函数

const query = ref('');
const results = ref<barDataItem[]>([]); // 定义 results 的类型
const chartType = ref('');
const chartData = ref(null);
const chart = ref(null);
const barData = ref<barDataItem>(null);
const data = reactive({
    isShow: false,
    cardData:[]
})

const removeNewline = (event) =>{
  event.preventDefault(); 
}

const changeView = () =>{
  data.isShow = true;
  queryTableInfo()
}

const queryTableInfo = async () => {
  try {
    const res: { rows: TableVo[];} = await getAllTable()
    data.cardData = res;

  } catch (e) {}
}

const preview = (item) =>{
  data.isShow = false;
  console.log(item)
}

const question = (item) =>{
  data.isShow = false;
  console.log(item)
}

const handleQuery = async () => {
  alert("请求查询接口")
  if (!query.value) {
    message.warning('请输入查询内容');
    return
  }

  try {
    const res = await getAllTable({tableName: 't_disability_info', content: query.value})
    barData.value = res.barData
    console.log(barData.value)
    if (chart.value) {
      chart.value.updateChart();
    }
  } catch (error) {
    message.error('网络错误，请检查连接');
  }
};

const handleNewDialog = () => {
  // 处理新建对话的逻辑
  message.info('新建对话');
  query.value = ''; // 清空查询输入
  results.value = []; // 清空查询结果
  chartType.value = ''; // 清空图表类型
  chartData.value = null; // 清空图表数据
};
</script>

<style scoped>
.container{margin-top: 16px;width: 100%; height: 600px; float: left;}
.left-card{width: 220px; height: 100%;float: left;border-color: #C5C5C5}
.right-card{margin-left: 10px;width: calc(100% - 230px); height: 100%;float: left;border-color: #C5C5C5}
.change-view{width:100px;height:48px;border-color: #409EFF;color: #409EFF}
.table-info{margin-top: 70px;}
.data-info{margin-top: 70px;}
.table-card{background-color: #f2f2f2;}
::v-deep .ant-card-head{background-color: #D3C4E1;}
.table-desc{margin-top: -10px;}
.table-handle{margin-top: 20px;float: right};
::v-deep .ant-card .ant-card-body{background-color: #C5C5C5;}
::-webkit-scrollbar {width: 3px;height: 3px;}
::-webkit-scrollbar-track {background: #fff;border-radius: 3px;}
::-webkit-scrollbar-thumb {background: rgb(205, 206, 206);border-radius: 3px;}
::-webkit-scrollbar-thumb:hover {background: #333;}
::-webkit-scrollbar-corner {background: #fff;}
</style>
