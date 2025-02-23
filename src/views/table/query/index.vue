<template>
  <a-layout>
    <!-- 左侧栏 -->
    <a-layout-sider :width="200" style="background: #fff">
      <a-menu mode="inline" :style="{ height: '100%', borderRight: 0 }">
        <a-menu-item key="new-dialog" @click="handleNewDialog">
          <span>新建对话</span>
        </a-menu-item>
        <!-- 其他菜单项可以根据需要添加 -->
      </a-menu>
    </a-layout-sider>

    <!-- 右侧内容 -->
    <a-layout-content>
      <div class="smart-query-container">
        <!-- 搜索框和搜索按钮 -->
        <a-input-search
            v-model:value="query"
            placeholder="请输入您的查询"
            enter-button="搜索"
            @search="handleQuery"
        />
      </div>
      <!-- 查询结果展示 -->
      <div class="results-container">
        <h3>查询结果</h3>
<!--          <a-table :columns="columns" :data-source="results"/>-->

        <!-- 图表展示 -->
        <div class="chart-container">
          <h3>图表展示</h3>
          <bar-chart ref="chart" :chartData="barData"></bar-chart>
        </div>
      </div>
    </a-layout-content>
  </a-layout>
</template>

<script lang="ts" setup>
import {Bar} from 'vue-chartjs';
import {ref, computed} from 'vue';
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

const handleQuery = async () => {
  if (!query.value) {
    message.warning('请输入查询内容');
    return;
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
.smart-query-container {
  padding: 20px;
}

.results-container {
  margin-top: 20px;
  width: 80%;
  height: 500px;
  //background-color: red;
}

.chart-container {
  margin-top: 20px;
  width: 80%;
}
</style>
