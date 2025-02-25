<template>
  <div class="ts-container">
    <a-card>
      <a-input-search
          addon-before="Wiwid"
          class="search-input"
          v-model:value="searchValue"
          placeholder="Please input wiwid"
          :loading="isSearchLoading"
          style="display: block"
          @search="getSearchList"
      />

      <!-- 添加申请权限按钮 -->
      <a-button type="primary" @click="openApplyModal">申请权限</a-button>

      <a-table
          :columns="TestTableColumns"
          :data-source="dataSource"
          :loading="isLoading"
          :pagination="pagination"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a>编辑</a>
            <a-divider type="vertical"/>
            <a>删除</a>
          </template>
        </template>
      </a-table>
      <div class="chart-container">
        <BarChart ref="barChart" :chartData="mockBarData"/>
      </div>
      <!-- 引入 LineChart 组件 -->
      <div class="chart-container">
        <LineChart ref="lineChart" :chartData="mockLineData"/>
      </div>
      <div class="chart-container">
        <PieChart ref="pieChart" :chartData="mockPieData"/>
      </div>
      <!--      &lt;!&ndash; 引入 ListChart 组件 &ndash;&gt;-->
      <!--      <div class="chart-container">-->
      <!--        <h3>列表展示</h3>-->
      <!--        <ListChart :tableData="listData" :columns="listColumns" />-->
      <!--      </div>-->
    </a-card>

    <!-- 引入 Apply 组件 -->
    <apply-modal ref="applyModal" :dataTableName="dataTableName" :dataTableId="dataTableId" @submit="handleApplySubmit"
                 @cancel="handleApplyCancel"></apply-modal>
  </div>
</template>

<script lang="ts" setup>
import {ref, onMounted} from 'vue';
import {getTestPage} from '@/api/test/test';
import {TestTableColumns, DataItem} from './index';
import ApplyModal from '@/components/Apply.vue';
import LineChart from '@/components/charts/LineChart.vue';
import ListChart from '@/components/charts/TableChart.vue';
import PieChart from '@/components/charts/PieChart.vue';
import BarChart from '@/components/charts/BarChart.vue';

const searchValue = ref('');
const dataSource = ref<DataItem[]>([]);
const isLoading = ref<boolean>(false);
const isSearchLoading = ref<boolean>(false);

const dataTableName = ref("残疾人基础信息表");
const dataTableId = ref(1);

const pagination = ref({
  current: 1,
  pageSize: 15,
  total: 0,
  showTotal: (total: number) => `共 ${total} 条`,
  onChange: (page: number, pageSize: number) => {
    fetchData(page, pageSize);
  },
});

const getSearchList = () => {
  isSearchLoading.value = true;
  fetchData(1, 15);
};

const fetchData = async (current?: number, pageSize?: number) => {
  isLoading.value = true;
  const res: { rows: DataItem[]; total: number } = await getTestPage({
    name: searchValue.value,
    page: current || pagination.value.current,
    rows: pageSize || pagination.value.pageSize,
  });
  console.log(res);

  isLoading.value = false;
  isSearchLoading.value = false;
  pagination.value.total = res.total;
  current && (pagination.value.current = current);
  pageSize && (pagination.value.pageSize = pageSize);
  dataSource.value = Array.isArray(res.rows) ? res.rows : [];
};

const barChart = ref(null);
const lineChart = ref(null);
const pieChart = ref(null);

const mockBarData = {
  xName: "星期",
  yName: "数值",
  xAxis: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  yAxis: [120, 932, 901, 934, 1290, 1330, 1320]
};
const mockLineData = {
  xAxis: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  yAxis: [120, 932, 901, 934, 1290, 1330, 1320]
};
const mockPieData = {
  data: [
    { value: 335, name: '直接访问' },
    { value: 310, name: '邮件营销' },
    { value: 234, name: '联盟广告' },
    { value: 135, name: '视频广告' },
    { value: 1548, name: '搜索引擎' }
  ]
}

onMounted(() => {
  fetchData();
  if (barChart.value) {
    barChart.value.initBarChart();
  }
  if (lineChart.value) {
    lineChart.value.initLineChart();
  }
  if (pieChart.value) {
    pieChart.value.initPieChart();
  }
});

// 引入 Apply 组件
const applyModal = ref(null);

const openApplyModal = () => {
  if (applyModal.value) {
    applyModal.value.openModal();
  }
};

const handleApplySubmit = async (dataTableId: string, dataTableName: string) => {
  // 处理提交逻辑
  console.log('数据表ID:', dataTableId);
  console.log('数据表名称:', dataTableName);
  // 可以在这里调用 onSubmitApply 方法
};

const handleApplyCancel = () => {
  // 处理取消逻辑
  console.log('申请已取消');
};

</script>

<style scoped>
.ts-container {
  padding: 16px;
}

.search-input {
  min-width: 100px;
  max-width: 300px;
  margin-bottom: 20px;
}

.chart-container {
  margin-top: 20px;
  //background-color: red;
  width: 100%;
  height: 400px; /* 确保有足够的高度 */
  position: relative; /* 确保子元素能够正确定位 */
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
