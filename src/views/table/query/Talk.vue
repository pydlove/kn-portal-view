<template>
  <div class="container" :style="data.questionStyle">
    <!-- 固定的提问部分 -->
    <div class="fixed-question-container">
      <div style="width: 100%;margin-top: -28px;">
        <a-textarea
          v-model:value="inputText"
          placeholder="请输入您要查询的内容，按Enter键发送查询"
          style="width: calc(100% - 120px);white-space: pre-wrap;resize: none;float: left;border-color: #409EFF;line-height: 22px;"
          :auto-size="{ minRows: 2, maxRows: 2}"
          @keydown.enter.native="removeNewline"
          @keydown.enter="handleSubmit"
        />
        <a-button style="text-align:center;line-height: 36px;margin-left: 10px;width: 80px;height: 54px;border-radius: 4px;font-weight: bold;background-color: #409EFF;color: #fff" @click="handleSubmit">搜索</a-button>
      </div>

      <!-- 新增的表名称和数据源切换按钮 -->
      <div class="table-info-container">
        <div class="table-name">{{ props.tableInfo.tableDesc }}</div>
<!--         <a-button type="text" @click="switchDataSource" class="switch-button">
          <template #icon>
            <swap-outlined />
          </template>
          切换数据源
        </a-button> -->
      </div>
      <!-- 回答部分，可以滚动 -->
      <div class="scrollable-answers-container" ref="scrollContainer">
        <a-spin :spinning="data.loading">
          <a-empty :description="false" v-if="data.isMessageEmpty" style="margin-top: 12%"/>
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
        </a-spin>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, nextTick, defineAsyncComponent, reactive, provide, inject} from 'vue';
import * as echarts from 'echarts';
import { InputSearch as AInputSearch, Button as AButton, Spin as ASpin } from 'ant-design-vue';
import { SwapOutlined } from '@ant-design/icons-vue';
import { talkQuestion } from "@/api/table/query";

const messages = ref<Message[]>([]);
const updateTalkInfoList = inject('updateTalkInfoList');
const handleActive = inject('handleActive');
const props = defineProps({
  tableInfo: String
});
defineExpose({ resumTalk });

const data = reactive({questionStyle:"",isMessageEmpty:true,loading:false,talkId:""})

const removeNewline = (event) => {
  event.preventDefault();
}

function resumTalk(historyTalk){
  if (historyTalk){
    if (data.talkId == historyTalk.talkId){
      return;
    }
    data.talkId = historyTalk.talkId
    // messages.value = historyTalk.dataList
    messages.value = new Array()
    let historyList = historyTalk.dataList
    if (historyList == null || historyList == undefined || historyList.length == 0){
      return;
    }
    nextTick(() => {
      data.loading = true;
      data.isMessageEmpty = false
      for (let i = 0; i < historyList.length; i ++){
        messages.value.push(historyList[i]);
        initChart(messages.value.length - 1);
        scrollToBottom();
      }
      data.loading = false;
    });
  }
}

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

const messageEmpty = () => {
  if (messages.value && messages.value.length > 0){
    data.isMessageEmpty = false
  } else {
    data.isMessageEmpty = true
  }
};

const saveLocal = () =>{
  if (data.talkId == null || data.talkId == undefined || data.talkId.length == 0){
    data.talkId = new Date().getTime()
  }
  let talkInfo = {"talkId":data.talkId,"tableName":props.tableInfo.tableName,"tableDesc":props.tableInfo.tableDesc,"content":inputText.value, dataList:messages.value}
  let newTalkInfoList = new Array();

  let dataList = JSON.parse(localStorage.getItem("talkInfoList"));
  if (dataList == null || dataList == undefined){
    dataList = new Array()
  }
  newTalkInfoList.push(talkInfo)
  for(let i = 0; i < dataList.length; i ++){
    if (i > 8){
      break;
    }
    if (dataList[i] != null && dataList[i] != undefined && dataList[i] != "" && dataList[i] != "null" && dataList[i] != "undefined"){
      if (data.talkId == dataList[i].talkId){
        dataList[i].dataList = messages.value
        localStorage.setItem("talkInfoList", JSON.stringify(dataList))
        updateTalkInfoList()
        return;
      }
      newTalkInfoList.push(dataList[i])
    }
  }
  data.talkInfoList = newTalkInfoList
  localStorage.setItem("talkInfoList", JSON.stringify(newTalkInfoList))
  updateTalkInfoList()
  nextTick(() => {
    handleActive(data.talkId);
  });
}


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
const handleSubmit = async () => {
  let value = inputText.value
  if (value.trim() === '') {
    return;
  }
  // 设置加载状态
  data.loading = true
  try {
    const res = await talkQuestion({ tableName: props.tableInfo.tableName, content: inputText.value });
    const chartType = res.chartType
    const chartData = getChartData(chartType, res);
    // 添加提问和回答到消息列表
    messages.value.push({
      question: value,
      // answer: `回答：${value}`,
      chart: true,
      chartType: chartType,
      chartData: chartData
    });
    //去除空状态图标
    messageEmpty()
    // 同时向 chartRefs 和 chartComponentRefs 添加一个 null 占位符
    chartRefs.value.push(null);
    chartComponentRefs.value.push(null);

    // 延迟初始化新添加的图表
    nextTick(() => {
      initChart(messages.value.length - 1);
      scrollToBottom();
    });
    saveLocal()
  } catch (error) {
    data.loading = false
    console.error('请求失败', error);
  }

  // 清空输入框
  inputText.value = '';
  data.loading = false
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
  let winHeight = `${window.innerHeight}`;
  data.questionStyle = "width:100%;height: " + (winHeight - 160) + "px;max-height:" + (winHeight - 160) + "px;";
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
      if (!res.tableData || !res.tableData.headers || !res.tableData.rows) {
        throw new Error('接口返回的 tableData 数据不完整');
      }
      return {
        columns: res.tableData.headers,
        data: res.tableData.rows
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

.container {
  display: flex;
  width: 100%;
  height: 100%;
  margin-left: -24px;
}


.fixed-question-container {
  position: relative;
  width: 100%; /* 与 .chat-container 的宽度一致 */
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
  font-size: 17px;
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
  overflow-y: auto;
  border-top: 1px solid #e8e8e8;
  height: calc(100% - 56px);
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
  color: #888888;
}

.answer {
  margin-top: 10px;
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
