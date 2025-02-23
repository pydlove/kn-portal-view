<template>
  <div ref="chart" style="width: 100%; height: 400px;"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import {computed, defineComponent, onMounted, ref, watch} from 'vue';

const props = defineProps({
  chartData: {
    type: Object,
    required: true,
  },
});

const chart = ref(null);
let chartInstance: echarts.ECharts | null = null;
const updateChart = () => {
  console.log("chartData",props.chartData)

  if (!chartInstance) {
    chartInstance = echarts.init(chart.value);
  }

  const mockData = {
    categories: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    values: [120, 200, 150, 80, 70, 110, 130]
  };

  const option = {
    title: {
      text: '申请数量统计'
    },
    tooltip: {},
    legend: {
      data: ['申请数量']
    },
    xAxis: {
      data: props.chartData.xaxis
      // data: mockData.categories
    },
    yAxis: {},
    series: [
      {
        name: '申请数量',
        type: 'bar',
        data: props.chartData.yaxis
        // data: mockData.values
      }
    ]
  };
  // console.log("xAxis",props.chartData.xAxis)
  // console.log("yAxis",props.chartData.yAxis)
  console.log("option",option)
  chartInstance.setOption(option);
};

onMounted(() => {
  updateChart();
});

watch(
    () => props.chartData,
    (newData) => {
      if (newData) {
        updateChart();
      }
    },
    { deep: true }
);

</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: 400px;
}
</style>
