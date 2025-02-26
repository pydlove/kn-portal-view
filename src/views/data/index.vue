<template>
  <div class="chat-container">
    <div class="main-content">
      <!-- 会话栏 -->
      <div class="conversation-sidebar">
        <div class="sidebar-header">会话列表</div>
        <div class="sidebar-content" ref="sidebarContent">
          <!-- 示例会话项 -->
          <div class="conversation-item" v-for="(conversation, index) in conversations" :key="index">
            {{ conversation.title }}
          </div>
        </div>
      </div>

      <!-- 固定的提问部分 -->
      <div class="fixed-question-container">
        <div class="input-container">
          <a-input-search
              v-model:value="inputText"
              placeholder="请输入你的问题"
              @search="handleSubmit"
              enter-button="搜索"
              class="input-field"
          />
        </div>
        <!-- 新增的表名称和数据源切换按钮 -->
        <div class="table-info-container">
          <div class="table-name">{{ tableName }}</div>
          <a-button type="text" @click="switchDataSource" class="switch-button">
            <template #icon>
              <swap-outlined />
            </template>
            切换数据源
          </a-button>
        </div>
        <!-- 回答部分，可以滚动 -->
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
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, nextTick, defineAsyncComponent } from 'vue';
import * as echarts from 'echarts';
import { InputSearch as AInputSearch, Button as AButton, Spin as ASpin } from 'ant-design-vue';
import { SwapOutlined } from '@ant-design/icons-vue';
import { talkQuestion } from "@/api/table/query";

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

// 输入框内容
const inputText = ref<string>('');

// 表名称
const tableName = ref<string>('重点青少年关爱信息表');

// 切换数据源
const switchDataSource = () => {
  // 这里可以添加切换数据源的逻辑
  tableName.value = '残疾人基础信息表'; // 示例：切换到新表名称
};

// 消息列表，包含提问、回答和图表
interface Message {
  question: string;
  answer: string;
  chart: boolean;
  chartType: 'table' | 'bar' | 'line' | 'pie'; // 添加图表类型
  chartData: any; // 添加图表数据
}

const messages = ref<Message[]>([]);

// 会话列表
const conversations = ref([
  { title: '会话1' },
  { title: '会话2' },
  { title: '会话3' },
  { title: '会话4' },
  { title: '会话5' },
  { title: '会话6' },
  { title: '会话7' },
  { title: '会话8' },
  { title: '会话9' },
  { title: '会话10' },
]);

// 图表容器的引用
const chartRefs = ref<(HTMLElement | null)[]>([]);

// 图表组件的引用
const chartComponentRefs = ref<any[]>([]);

// 加载状态数组
const loading = ref<boolean[]>([]);

// 滚动容器的引用
const scrollContainer = ref<HTMLElement | null>(null);

// 会话栏内容的引用
const sidebarContent = ref<HTMLElement | null>(null);

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
const getChartComponent = (chartType: Message['chartType']) => {
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

// 处理提交
const handleSubmit = async (value: string) => {
  if (value.trim() === '') {
    return;
  }

  // 设置加载状态
  loading.value.push(true);

  try {
    const res = await talkQuestion({ tableName: "t_disability_info", content: inputText.value });
    const chartType = res.chartType
    // 使用 mock 数据进行测试
    // const mockRes = getMockResponse(value);
    // console.log('Mock Response:', mockRes); // 调试信息
    // const chartType = mockRes.chartType;
    const chartData = getChartData(chartType, res);

    // 添加提问和回答到消息列表
    messages.value.push({
      question: value,
      // answer: `回答：${value}`,
      chart: true,
      chartType: chartType,
      chartData: chartData
    });

    // 同时向 chartRefs 和 chartComponentRefs 添加一个 null 占位符
    chartRefs.value.push(null);
    chartComponentRefs.value.push(null);

    // 延迟初始化新添加的图表
    nextTick(() => {
      initChart(messages.value.length - 1);
      scrollToBottom();
    });
  } catch (error) {
    console.error('请求失败', error);
    loading.value.pop(); // 移除加载状态
  }

  // 清空输入框
  inputText.value = '';
};

// 滚动到底部
const scrollToBottom = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
  }
};

// 监听 messages 的变化，确保 chartRefs 和 chartComponentRefs 和 messages 长度一致
watch(messages, (newMessages) => {
  chartRefs.value = newMessages.map(() => null);
  chartComponentRefs.value = newMessages.map(() => null);
  loading.value = newMessages.map(() => false); // 初始化加载状态为 false
}, { deep: true });

// 页面加载时初始化图表（如果有）
onMounted(() => {
  messages.value.forEach((_, index) => {
    loading.value[index] = true; // 设置加载状态为 true
    // initChart(index);
  });
});

// 初始化图表
const initChart = async (index: number) => {
  await nextTick(); // 确保 DOM 更新后再初始化图表
  const chartDom = chartRefs.value[index];
  const chartComponent = chartComponentRefs.value[index];
  const message = messages.value[index];
 // console.log('Initializing chart for index:', index, 'chartDom:', chartDom, 'chartComponent:', chartComponent); // 调试信息

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
    loading.value[index] = false; // 数据准备完毕，关闭加载状态
  } else {
    console.error('Chart DOM element or component is not found for index:', index);
    // 增加等待时间，确保组件已经挂载
    setTimeout(() => {
      initChart(index);
    }, 500);
  }
};

// 根据图表类型获取对应的数据
const getChartData = (chartType: Message['chartType'], res: any) => {
  switch (chartType) {
    case 'table':
      if (!res.tableData || !res.tableData.columns || !res.tableData.data) {
        throw new Error('接口返回的 tableData 数据不完整');
      }
      return {
        columns: res.tableData.columns,
        data: res.tableData.data
      };
    case 'bar':
      if (!res.barData) {
        throw new Error('接口返回的 barData 数据为空');
      }
      return res.barData;
    case 'line':
      if (!res.lineData) {
        throw new Error('接口返回的 lineData 数据为空');
      }
      return res.lineData;
    case 'pie':
      if (!res.pieData) {
        throw new Error('接口返回的 pieData 数据为空');
      }
      return res.pieData;
    default:
      throw new Error('未知的 chartType');
  }
};

// 生成 mock 数据
const getMockResponse = (value: string) => {
  // 根据输入值随机选择图表类型
  const chartTypes: Message['chartType'][] = ['table', 'bar', 'line', 'pie'];
  const randomChartType = chartTypes[Math.floor(Math.random() * chartTypes.length)];

  const mockResponses = {
    table: {
      chartType: 'table',
      tableData: {
        columns: [
          {
            title: '序号',
            dataIndex: 'index',
            key: 'index'
          },
          {
            title: '名称',
            dataIndex: 'name',
            key: 'name'
          },
          {
            title: '时间',
            dataIndex: 'time',
            key: 'time'
          }
        ],
        data: [
          { index: 1, name: '项目A', time: '2023-01-01' },
          { index: 2, name: '项目B', time: '2023-02-01' },
          { index: 3, name: '项目C', time: '2023-03-01' }
        ]
      }
    },
    bar: {
      chartType: 'bar',
      barData: {
        xName: '类别',
        xAxis: ['A', 'B', 'C', 'D', 'E'],
        yName: '数量',
        yAxis: [120, 200, 150, 80, 70]
      }
    },
    line: {
      chartType: 'line',
      lineData: {
        xAxis: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        yAxis: [820, 932, 901, 934, 1290, 1330, 1320]
      }
    },
    pie: {
      chartType: 'pie',
      pieData: {
        data: [
          { value: 335, name: '直接访问' },
          { value: 310, name: '邮件营销' },
          { value: 234, name: '联盟广告' },
          { value: 135, name: '视频广告' },
          { value: 1548, name: '搜索引擎' }
        ]
      }
    }
  };

  return mockResponses[randomChartType];
};
</script>

<style scoped>
.chat-container {
  display: flex;
  justify-content: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
  height: calc(100vh - 60px); /* 减去菜单栏高度 */
  background-color: #f0f0f0; /* 设置背景为灰色 */
}

.main-content {
  display: flex;
  width: 100%;
  background-color: #ffffff; /* 设置主要内容背景为白色 */
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
}

.conversation-sidebar {
  position: relative;
  width: 250px;
  background-color: #ffffff; /* 设置会话栏背景为白色 */
  border-right: 1px solid #e8e8e8;
  padding: 10px;
}

.sidebar-header {
  padding: 10px 0;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px solid #e8e8e8;
}

.sidebar-content {
  height: calc(100% - 40px); /* 减去头部高度 */
  overflow-y: auto;
}

.conversation-item {
  padding: 10px;
  border-bottom: 1px solid #e8e8e8;
  cursor: pointer;
}

.conversation-item:hover {
  background-color: #e8e8e8;
}

.fixed-question-container {
  position: relative;
  width: 800px; /* 与 .chat-container 的宽度一致 */
  background-color: #ffffff; /* 设置提问部分背景为白色 */
  z-index: 1000; /* 确保提问部分在最上层 */
  padding: 10px;
  margin-left: 20px; /* 根据会话栏宽度调整 */
}

.input-container {
  display: flex;
  gap: 10px;
  align-items: center; /* 确保输入框和按钮在同一行 */
}

.input-field {
  flex: 1; /* 使输入框占据剩余空间 */
}

.input-field :deep(.ant-input) {
  background-color: transparent; /* 设置输入框背景为透明 */
  border-color: #e8e8e8; /* 设置输入框边框颜色 */
}

.table-info-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.table-name {
  font-weight: bold;
}

.switch-button {
  color: #1890ff;
  border: none; /* 去掉按钮边框 */
  padding: 0; /* 去掉按钮内边距 */
  background: none; /* 去掉按钮背景 */
  cursor: pointer; /* 设置鼠标悬停效果 */
}

.switch-button:hover {
  text-decoration: underline; /* 鼠标悬停时显示下划线 */
}

.scrollable-answers-container {
  margin-top: 10px; /* 根据 .fixed-question-container 的高度调整 */
  margin-left: 20px; /* 根据会话栏宽度调整 */
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
