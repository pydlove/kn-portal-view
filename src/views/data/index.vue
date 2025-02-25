<template>
  <div class="chat-container">
    <!-- 固定的提问部分 -->
    <div class="fixed-question-container">
      <div class="input-container">
        <a-input
            v-model:value="inputText"
            placeholder="请输入你的问题"
            @pressEnter="handleSubmit"
        />
        <a-button type="primary" @click="handleSubmit">提交</a-button>
      </div>
    </div>

    <!-- 回答部分，可以滚动 -->
    <div class="scrollable-answers-container" ref="scrollContainer">
      <div v-for="(item, index) in paginatedMessages" :key="index" class="message-container">
        <div class="question">{{ item.question }}</div>
        <div class="answer">
          <div v-if="item.answer">{{ item.answer }}</div>
          <!-- 动态渲染图表 -->
          <div v-if="item.chart" :ref="(el) => setChartRef(el, index)" class="chart-container"></div>
        </div>
      </div>
    </div>

    <!-- 分页组件 -->
    <div class="pagination-container">
      <a-pagination
          v-model:current="currentPage"
          :total="messages.length"
          :page-size="pageSize"
          @change="handlePageChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, nextTick, computed } from 'vue';
import * as echarts from 'echarts';
import { Input as AInput, Button as AButton, Pagination as APagination } from 'ant-design-vue';

// 输入框内容
const inputText = ref<string>('');

// 消息列表，包含提问、回答和图表
interface Message {
  question: string;
  answer: string;
  chart: boolean;
  chartType: 'table' | 'bar' | 'line' | 'pie'; // 添加图表类型
}
const messages = ref<Message[]>([]);

// 图表容器的引用
const chartRefs = ref<(HTMLElement | null)[]>([]);

// 滚动容器的引用
const scrollContainer = ref<HTMLElement | null>(null);

// 分页相关的数据
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);

// 计算分页后的数据
const paginatedMessages = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return messages.value.slice(start, end);
});

// 设置图表容器的引用
const setChartRef = (el: HTMLElement | null, index: number) => {
  if (el) {
    chartRefs.value[index] = el;
  }
};

// 初始化图表
const initChart = async (index: number) => {
  await nextTick(); // 确保 DOM 更新后再初始化图表
  const chartDom = chartRefs.value[index];
  console.log('Initializing chart for index:', index, 'chartDom:', chartDom); // 调试信息
  if (chartDom) {
    const chart = echarts.init(chartDom);
    const message = paginatedMessages.value[index];
    let option;

    switch (message.chartType) {
      case 'table':
        option = {
          dataset: {
            source: [
              ['product', '2015', '2016', '2017'],
              ['Matcha Latte', 43.3, 85.8, 93.7],
              ['Milk Tea', 83.1, 73.4, 55.1],
              ['Cheese Cocoa', 86.4, 65.2, 82.5],
              ['Walnut Brownie', 72.4, 53.9, 39.1],
            ],
          },
          xAxis: { type: 'category' },
          yAxis: {},
          series: [
            {
              type: 'table',
              layout: 'row',
              label: {
                show: true,
                formatter: function (params: any) {
                  return params.value;
                },
              },
            },
          ],
        };
        break;
      case 'bar':
        option = {
          xAxis: {
            type: 'category',
            data: ['A', 'B', 'C', 'D', 'E'],
          },
          yAxis: {
            type: 'value',
          },
          series: [
            {
              data: [120, 200, 150, 80, 70],
              type: 'bar',
            },
          ],
        };
        break;
      case 'line':
        option = {
          xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          },
          yAxis: {
            type: 'value',
          },
          series: [
            {
              data: [820, 932, 901, 934, 1290, 1330, 1320],
              type: 'line',
            },
          ],
        };
        break;
      case 'pie':
        option = {
          series: [
            {
              type: 'pie',
              data: [
                { value: 335, name: '直接访问' },
                { value: 310, name: '邮件营销' },
                { value: 234, name: '联盟广告' },
                { value: 135, name: '视频广告' },
                { value: 1548, name: '搜索引擎' },
              ],
            },
          ],
        };
        break;
      default:
        option = {};
    }

    chart.setOption(option);
  }
};

// 处理提交
const handleSubmit = () => {
  if (inputText.value.trim() === '') {
    return;
  }

  // 随机选择一个图表类型
  const chartTypes: Message['chartType'][] = ['table', 'bar', 'line', 'pie'];
  const randomChartType = chartTypes[Math.floor(Math.random() * chartTypes.length)];

  // 添加提问和回答到消息列表
  messages.value.push({
    question: inputText.value,
    answer: `回答：${inputText.value}`,
    chart: true, // 标记是否需要渲染图表
    chartType: randomChartType, // 随机选择图表类型
  });

  // 同时向 chartRefs 添加一个 null 占位符
  chartRefs.value.push(null);

  // 清空输入框
  inputText.value = '';

  // 延迟初始化新添加的图表
  nextTick(() => {
    initChart(messages.value.length - 1);
    scrollToBottom();
  });
};

// 滚动到底部
const scrollToBottom = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
  }
};

// 处理分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page;
  // 重新初始化图表
  chartRefs.value = paginatedMessages.value.map(() => null);
  nextTick(() => {
    paginatedMessages.value.forEach((_, index) => {
      initChart(index);
    });
  });
};

// 监听 messages 的变化，确保 chartRefs 和 messages 长度一致
watch(messages, (newMessages) => {
  chartRefs.value = newMessages.map(() => null);
}, { deep: true });

// 页面加载时初始化图表（如果有）
onMounted(() => {
  paginatedMessages.value.forEach((_, index) => {
    initChart(index);
  });
});
</script>

<style scoped>
.chat-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
  height: 100vh; /* 使容器占满整个视口高度 */
}

.fixed-question-container {
  position: fixed;
  top: 20px; /* 根据需要调整 */
  left: 50%;
  transform: translateX(-50%);
  width: 800px; /* 与 .chat-container 的宽度一致 */
  background-color: #fff; /* 确保背景色与页面一致 */
  z-index: 1000; /* 确保提问部分在最上层 */
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
}

.scrollable-answers-container {
  margin-top: 100px; /* 根据 .fixed-question-container 的高度调整 */
  height: calc(100vh - 180px); /* 根据需要调整 */
  overflow-y: auto;
  padding: 20px;
}

.message-container {
  margin-bottom: 20px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  padding: 10px;
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
}

.input-container {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
