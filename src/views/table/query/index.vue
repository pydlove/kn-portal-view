<template>
  <div class="container">
    <!-- 左侧栏 -->
    <a-card class="left-card">
      <a-button type="dashed" style="margin-left: 4px;width: 160px;border-color: #409EFF;color: #409EFF">新建对话</a-button>
    </a-card>

    <!-- 右侧内容 -->
    <a-card class="right-card">
      <a-textarea
        v-model:value="query"
        placeholder="请输入您要查询的内容，按Enter键发送查询"
        style="margin-left: 20%;width: 60%;white-space: pre-wrap;resize: none;"
        :loading="isSearchLoading"
        :auto-size="{ minRows: 2, maxRows: 2 }"
        @keydown.enter.native="removeNewline"
        @keydown.enter="handleQuery"
      />

      <div class="table-info" v-show="data.isShow" @click="">
        test
      </div>

      <!-- 查询结果展示 -->
      <div class="data-info" v-show="!data.isShow">
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
import {talkQuestion} from "@/api/table/query";
import {barDataItem} from "@/views/table/query/index"; // 确保导入的是正确的函数

const query = ref('');
const results = ref<barDataItem[]>([]); // 定义 results 的类型
const chartType = ref('');
const chartData = ref(null);
const chart = ref(null);
const barData = ref<barDataItem>(null);
const data = reactive({
    isShow: false
})

const removeNewline = (event) =>{
  event.preventDefault(); 
}

const handleQuery = async () => {
  alert("请求查询接口")
  if (!query.value) {
    message.warning('请输入查询内容');
    return
  }

  try {
    const res = await talkQuestion({tableName: 't_disability_info', content: query.value})
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
.results-container {
  margin-top: 20px;
  width: 80%;
  height: 500px;
}

.chart-container {
  margin-top: 20px;
  width: 80%;
}


.container{margin-top: 16px;width: 100%; height: 500px; float: left;}
.left-card{width: 220px; height: 100%;float: left;border-color: #C5C5C5}
.right-card{margin-left: 10px;width: calc(100% - 230px); height: 100%;float: left;border-color: #C5C5C5}
::-webkit-scrollbar {width: 3px;height: 3px;}
::-webkit-scrollbar-track {background: #fff;border-radius: 3px;}
::-webkit-scrollbar-thumb {background: rgb(205, 206, 206);border-radius: 3px;}
::-webkit-scrollbar-thumb:hover {background: #333;}
::-webkit-scrollbar-corner {background: #fff;}
</style>
