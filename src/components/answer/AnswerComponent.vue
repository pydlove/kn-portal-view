<template>
  <div class="scrollable-answers-container" ref="scrollContainer">
    <div v-for="(item, index) in messages" :key="index" class="message-container">
      <div class="question">{{ item.question }}</div>
      <div class="answer">
        <div v-if="item.answer">{{ item.answer }}</div>
        <!-- 动态渲染图表 -->
        <div v-if="item.chart" :ref="(el) => setChartRef(el, index)" class="chart-container">
          <div v-if="loading[index]" class="loading-overlay">
            <a-spin />
          </div>
          <component
              :is="getChartComponent(item.chartType)"
              :chartData="item.chartData"
              :ref="(el) => setChartComponentRef(el, index)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, nextTick, defineAsyncComponent } from 'vue';
import * as echarts from 'echarts';
import { Spin as ASpin } from 'ant-design-vue';

// 异步引入图表组件，并使用 onLoaded 钩子确保组件加载完成后再初始化图表
const TableChart = defineAsyncComponent({
  loader: () => import('@/components/charts/TableChart.vue'),
  onLoaded: () => {
    // 组件加载完成后的处理逻辑
  }
});

const BarChart = defineAsyncComponent({
  loader: () => import('@/components/charts/BarChart.vue'),
  onLoaded: () => {
    // 组件加载完成后的处理逻辑
  }
});

const LineChart = defineAsyncComponent({
  loader: () => import('@/components/charts/LineChart.vue'),
  onLoaded: () => {
    // 组件加载完成后的处理逻辑
  }
});

const PieChart = defineAsyncComponent({
  loader: () => import('@/components/charts/PieChart.vue'),
  onLoaded: () => {
    // 组件加载完成后的处理逻辑
  }
});

defineProps<{
  messages: Array<{
    question: string;
    answer: string;
    chart: boolean;
    chartType: 'table' | 'bar' | 'line' | 'pie';
    chartData: any;
  }>;
  loading: boolean[];
}>();

// 图表容器的引用
const chartRefs = ref<(HTMLElement | null)[]>([]);

// 图表组件的引用
const chartComponentRefs = ref<any[]>([]);

// 滚动容器的引用
const scrollContainer = ref<HTMLElement | null>(null);

// 设置图表容器的引用
const setChartRef = (el: HTMLElement | null, index: number) => {
  if (el) {
    chartRefs.value[index] = el;
  }
};

// 设置图表组件的引用
const setChartComponentRef = (el: any, index: number) => {
  if (el) {
    chartComponentRefs.value[index] = el;
  }
};

// 根据图表类型获取对应的组件
const getChartComponent = (chartType: 'table' | 'bar' | 'line' | 'pie') => {
  switch (chartType) {
    case 'table':
      return TableChart;
    case 'bar':
      return BarChart;
    case 'line':
      return LineChart;
    case 'pie':
      return PieChart;
    default:
      return null;
  }
};

// 初始化图表
const initCharts = async () => {
  await nextTick(); // 确保 DOM 更新后再初始化图表
  for (let index = 0; index < messages.length; index++) {
    const chartDom = chartRefs.value[index];
    const chartComponent = chartComponentRefs.value[index];
    const message = messages[index];
    console.log('Initializing chart for index:', index, 'chartDom:', chartDom, 'chartComponent:', chartComponent); // 调试信息

    if (chartDom && chartComponent) {
      const chartData = message.chartData;
      if (chartComponent.initBarChart) {
        chartComponent.initBarChart(chartData);
      } else if (chartComponent.initLineChart) {
        chartComponent.initLineChart(chartData);
      } else if (chartComponent.initPieChart) {
        chartComponent.initPieChart(chartData);
      } else if (chartComponent.columns && chartComponent.tableData) {
        chartComponent.columns = chartData.columns;
        chartComponent.tableData = chartData.data;
      }
      loading[index] = false; // 数据准备完毕，关闭加载状态
    } else {
      console.error('Chart DOM element or component is not found for index:', index);
      // 增加等待时间，确保组件已经挂载
      setTimeout(() => {
        initCharts();
      }, 500);
    }
  }
};

// 监听 messages 的变化，确保 chartRefs 和 chartComponentRefs 和 messages 长度一致
watch(() => props.messages, (newMessages) => {
  chartRefs.value = newMessages.map(() => null);
  chartComponentRefs.value = newMessages.map(() => null);
  loading.value = newMessages.map(() => false); // 初始化加载状态为 false
}, { deep: true });

// 页面加载时初始化图表（如果有）
onMounted(() => {
  initCharts();
});
</script>

<style scoped>
.scrollable-answers-container {
  margin-top: 10px; /* 根据 .fixed-question-container 的高度调整 */
  width: 800px; /* 与 .chat-container 的宽度一致 */
  height: calc(100% - 140px); /* 根据需要调整 */
  overflow-y: auto;
  padding: 20px;
  background-color: #ffffff; /* 设置回答部分背景为白色 */
  border-top: 1px solid #e8e8e8;
}

.message-container {
  margin-bottom: 20px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  padding: 10px;
  background-color: #ffffff; /* 设置消息容器背景为白色 */
}

.question {
  font-weight: bold;
  margin-bottom: 10px;
}

.answer {
  margin-top: 10px;
}

.chart-container {
  width: 100%;
  height: 300px;
  background-color: #ffffff; /* 设置图表容器背景为白色 */
  position: relative; /* 添加相对定位 */
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8); /* 半透明背景 */
  z-index: 100; /* 确保加载样式在图表之上 */
}
</style>
