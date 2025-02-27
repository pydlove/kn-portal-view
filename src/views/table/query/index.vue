<template>
  <div class="container">
    <!-- 左侧栏 -->
    <a-card class="left-card">
      <a-button @click="changeView" style="margin-left: 4px;width: 160px;border-color: #409EFF;color: #409EFF">新建对话</a-button>
      <div style="margin-top: 20px"></div>
      <a-row :gutter="[6, 6]" v-for="item in data.talkInfoList" :key="item.id">
        <div class="talk-info" @click="question(item)">{{item.tableComment}}</div>
      </a-row>
    </a-card>

    <!-- 右侧内容 -->
    <a-card class="right-card">
      <div style="width: 100%;float: left;">
        <a-textarea
          v-model:value="query"
          placeholder="请输入您要查询的内容，按Enter键发送查询"
          style="width: calc(100% - 120px);white-space: pre-wrap;resize: none;float: left;border-color: #409EFF;line-height: 44px;"
          :loading="isSearchLoading"
          :auto-size="{ minRows: 1, maxRows: 1}"
          @keydown.enter.native="removeNewline"
          @keydown.enter="handleQuery"
        />
        <a-button style="text-align:center;line-height: 36px;margin-left: 10px;width: 80px;height: 54px;float: left;border-radius: 4px;font-weight: bold;background-color: #409EFF;color: #fff" @click="handleQuery">搜索</a-button>
      </div>


      <a-drawer :title="data.currentTableDesc" placement="right" @close="onClosePreview" :closable="false" v-model:visible="data.previewVisible" width="45%" >
        <a-tabs v-model:activeKey="data.activeKey">
          <a-tab-pane key="1" tab="字段详情">
            <a-spin :spinning="data.tableInfoHeadLoading">
              <a-table
                :columns="data.tableInfoHead"
                :data-source="data.tableDetail.columnList"
                :pagination="false"
                :scroll="{ x: 500, y: 400 }"
                :loading="loading"
              />
            </a-spin>
          </a-tab-pane>
          <a-tab-pane key="2" tab="数据预览" :click="getPreviewData(data.tableDetail)">
            <a-spin :spinning="data.previewDataLoading">
              <a-table
                :columns="data.previewDataHead"
                :data-source="data.previewData"
                :pagination="false"
                :scroll="{ x: 500, y: 400 }"
                :loading="loading"
              />
            </a-spin>
          </a-tab-pane>
        </a-tabs>


      </a-drawer>

      <div class="table-info" v-if="data.isShow">
        <a-row :gutter="[16, 16]">
          <a-col :span="7" v-for="item in data.cardData" :key="item.tableId" style="height: 54px; background-color: #f4f4f4;margin-left: 16px;margin-top: 20px;border-radius: 6px;">
            <div style="font-weight: bold;color:#585858;width: 192px;line-height: 52px;float: left;">{{ item.tableComment }}</div>
            <div style="float: left;margin-top: 11px;margin-left: 20px">
              <a-button class="handle" type="dashed" shape="round" @click="preview(item)" >预览</a-button>
              <a-button class="handle" style="color: #409EFF" type="dashed" shape="round" @click="checkAccessAuthRequest(item)" >提问</a-button>
            </div>
          </a-col>
        </a-row>


<!--         <a-row :gutter="[16, 16]">
          <a-col :span="6" v-for="item in data.cardData" :key="item.tableId">
            <a-card class="table-card" :title="item.tableName">
              <div class="table-desc">{{ item.tableComment }}</div>
              <div class="table-handle">
                <a-button class="handle" type="dashed" shape="round" @click="preview(item)" >预览</a-button>
                <a-button class="handle" type="dashed" shape="round" @click="question(item)" >提问</a-button>
              </div>
            </a-card>
          </a-col>
        </a-row> -->
      </div>

      <!-- 查询结果展示 -->
      <div class="data-info" v-if="!data.isShow">
        <div class="results-container">
          <div class="query-display">
            <a-icon type="question-circle" style="margin-right: 8px;" />
            {{ query }}
          </div>
          <!-- 图表展示 -->
<!--          <div class="chart-container">
            <bar-chart ref="barChart" :chartData="barData"></bar-chart>
          </div>-->
          <div class="chart-container">
            <LineChart ref="lineChart" :chartData="lineData"/>
          </div>
        </div>
      </div>
    </a-card>

    <!-- 引入 Apply 组件 -->
    <apply-modal ref="applyModal"></apply-modal>
  </div>
</template>

<script lang="ts" setup>
import {Bar} from 'vue-chartjs';
import {ref, computed, reactive, onMounted} from 'vue';
import {message} from 'ant-design-vue';
import BarChart from '@/components/charts/BarChart.vue';
import {getAllTable,tableDetail} from "@/api/table/table";
import {talkQuestion,queryPreviewData} from "@/api/table/query";
import {barDataItem, lineDataItem, TableVo} from "@/views/table/query/index";
import LineChart from "@/components/charts/LineChart.vue";
import ApplyModal from "@/components/Apply.vue";
import {checkAccessAuth} from "@/api/table/dataAuth"; // 确保导入的是正确的函数

const query = ref('');
const results = ref<barDataItem[]>([]); // 定义 results 的类型
const chartType = ref('');
const chartData = ref(null);
const CHART_TYPES = {
  TABLE: "table",
  BAR: "bar",
  PIE: "pie",
  LINE: "line"
};
//柱状图
const barChart = ref(null);
const barData = ref<barDataItem>(null);
//折线图
const lineChart = ref(null);
const lineData = ref<lineDataItem>(null);
const data = reactive({
    isShow: true,
    previewVisible: false,
    talkInfoList: JSON.parse(localStorage.getItem("talkInfoList")),
    tableInfoHeadLoading: false,
    previewDataLoading: false,
    currentTableName: "",
    currentTableDesc: "",
    tableDetail:[],
    activeKey: '1',
    tableInfoHead:[{title: '字段名称',dataIndex: 'columnName',width: 200},{title: '字段说明',dataIndex: 'columnDesc',width: 300}],
    previewDataHead:[],
    previewData:[],
    cardData:[]
})




onMounted(() => {
  changeView();
});

const removeNewline = (event) => {
  event.preventDefault();
}

const changeView = () =>{
  data.isShow = true;
  queryTableInfo()
}

const onClosePreview = () =>{
  data.previewVisible = false
  data.activeKey = '1'
}

const queryTableInfo = async () => {
  try {
    const res: { rows: TableVo[];} = await getAllTable()
    data.cardData = res;

  } catch (e) {}
}

const queryTableDetail = async () => {
  try {
    data.tableInfoHeadLoading = true;
    const res: { rows: TableVo[];} = await tableDetail()
    data.tableDetail = res;
    data.tableInfoHeadLoading = false;
  } catch (e) {}
}

const getPreviewData = async (obj) =>{
  if (data.activeKey == '2'){
    if ((data.previewData && data.previewData.length > 0) && data.currentTableName == obj.tableName){
      return;
    }
    data.previewDataLoading = true;
    try {
      const res: { rows: TalkVo[];} = await queryPreviewData({ tableName: obj.tableName, content: "查询所有数据" });
      let colums = new Array()
      let resultColumns = res.columnList
      if (!resultColumns || resultColumns.length == 0){
        data.previewDataHead = [];
        data.previewDataLoading = false
        return;
      }
      for(let i = 0; i < resultColumns.length; i ++){
          colums.push({title:resultColumns[i].columnDesc,dataIndex:resultColumns[i].columnName,width: 200})
      }
      data.previewDataHead = colums


      if (!res.dataList || res.dataList.length == 0){
        data.previewData = [];
        data.previewDataLoading = false
        return;
      }
      data.previewData = res.dataList
      data.previewDataLoading = false
    } catch (error) {
      data.previewDataLoading = false
      message.error(error)
    }
  }
}

const preview = (item) =>{
  data.currentTableName = item.tableName
  data.currentTableDesc = item.tableComment
  data.previewVisible = true
  queryTableDetail()
}

const question = (item) =>{
  data.isShow = false;
  data.currentTableName = item.tableName;
}

const checkAccessAuthRequest = async (item) => {
  try {
    console.log(item)
    let hasAccess = await checkAccessAuth({tableId: item.tableId});
    if (hasAccess === 1) {
      question(item);
    } else {
      if (hasAccess === 0) {
        message.error('您没有权限访问该表, 请申请访问！');
        openApplyModal(item);
      } else {
        message.error('您已经申请该表的访问权限，目前正在审批中，请耐心等待！');
      }
    }
  } catch (error) {
    console.error('检查权限失败:', error);
    message.error('检查权限失败，请稍后再试');
  }
};

const applyModal = ref(null);
const openApplyModal = (item) => {
  if (applyModal.value) {
    applyModal.value.openModal(item);
  }
};

const saveLocal = () =>{
  let talkInfo = {"id":new Date().getTime(),"tableName":data.currentTableName,"tableComment":query.value}
  let newTalkInfoList = new Array();

  let dataList = JSON.parse(localStorage.getItem("talkInfoList"));
  newTalkInfoList.push(talkInfo)
  for(let i = 0; i < dataList.length; i ++){
    if (i > 8){
      break;
    }
    if (dataList[i] != null && dataList[i] != "" && dataList[i] != "null" && dataList[i] != undefined && dataList[i] != "undefined"){
      newTalkInfoList.push(dataList[i])
    }
  }
  data.talkInfoList = newTalkInfoList
  localStorage.setItem("talkInfoList", JSON.stringify(newTalkInfoList))
}

const handleQuery = async () => {
  if (!query.value) {
    message.warning('请输入查询内容');
    return;
  }

  try {
    saveLocal()
    const res = await talkQuestion({ tableName: "t_disability_info", content: query.value });
    const chartType = res.chartType
    console.log("chartType", chartType)
    switch (chartType) {
      case CHART_TYPES.TABLE:
        break
      case CHART_TYPES.BAR:
        barData.value = res.barData;
        initChart(barChart.value, 'initBarChart');
        break
      case CHART_TYPES.PIE:
        break
      case CHART_TYPES.LINE:
        lineData.value = res.lineData;
        console.log("line", res.lineData);
        initChart(lineChart.value, 'initLineChart');
        break
      default:
        console.warn(`未知的图表类型: ${chartType}`);
        break
    }
  } catch (error) {
    message.error('请求失败，请稍后再试')
  }
}

const initChart = (chartInstance, methodName) => {
  if (chartInstance && typeof chartInstance[methodName] === 'function') {
    chartInstance[methodName]();
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
.talk-info{position: relative;width: 100%;height: 32px;line-height:32px;border-radius:5px;color:#818181;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}
.talk-info:hover{font-weight: bold;}
.talk-active{font-weight: bold;}
.container{margin-top: 16px;width: 100%; height: 600px; float: left;}
/*.left-card{width: 220px; height: 100%;float: left;border-color: #C5C5C5}
.right-card{margin-left: 10px;width: calc(100% - 230px); height: 100%;float: left;border-color: #C5C5C5}
.table-card{background-color: #f2f2f2;}*/

.left-card{width: 220px; height: 100%;float: left;border-color: #C5C5C5}
.right-card{margin-left: 10px;width: calc(100% - 230px); height: 100%;float: left;border-color: #C5C5C5}
.table-info{margin-top: 70px;}
.data-info{margin-top: 70px;}

::v-deep .ant-card-head{background-color: #D3C4E1;}
.table-desc{margin-top: -10px;}
.table-handle{margin-top: 20px;float: right};
::v-deep .ant-card .ant-card-body{background-color: #C5C5C5;}

::-webkit-scrollbar {width: 3px;height: 3px;}
::-webkit-scrollbar-track {background: #fff;border-radius: 3px;}
::-webkit-scrollbar-thumb {background: rgb(205, 206, 206);border-radius: 3px;}
::-webkit-scrollbar-thumb:hover {background: #333;}
::-webkit-scrollbar-corner {background: #fff;}
.results-container {
  margin-top: 20px;
  width: 80%;
  height: 500px;
}

.chart-container {
  margin-top: 20px;
  width: 80%;
}

.query-display {
  margin-top: 20px;
  //margin-left: 20%;
  width: 60%;
  //background-color: #f0f2f5;
  padding: 10px;
  border-radius: 4px;
  display: flex;
  align-items: center;
}

.container {
  margin-top: 16px;
  width: 100%;
  height: 500px;
  float: left;
}

.left-card {
  width: 220px;
  height: 100%;
  float: left;
  border-color: #C5C5C5
}

.right-card {
  margin-left: 10px;
  width: calc(100% - 230px);
  height: 100%;
  float: left;
  border-color: #C5C5C5
}

::-webkit-scrollbar {
  width: 3px;
  height: 3px;
}

::-webkit-scrollbar-track {
  background: #fff;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgb(205, 206, 206);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #333;
}

::-webkit-scrollbar-corner {
  background: #fff;
}
</style>
