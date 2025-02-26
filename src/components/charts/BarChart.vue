<template>
  <div class="chart-container">
    <div ref="barChart" class="chart"></div>
<!--    <button class="export-button" @click="exportData">导出数据</button>-->
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { ref, onMounted } from 'vue';

const props = defineProps({
  chartData: {
    type: Object,
    required: true
  }
});

// 定义一个颜色数组，用于动态分配颜色
const colors = [
  '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'
];

const barChart = ref(null);
let myChart = ref(null);
const initBarChart = () => {
  const option = {
    title: {
      text: '数量统计'
    },
    tooltip: {},
    legend: {
      data: ['数量']
    },
    xAxis: {
      name: props.chartData.xName,
      data: props.chartData.xAxis
    },
    yAxis: {
      name: props.chartData.yName
    },
    series: [
      {
        // name: '申请数量',
        type: 'bar',
        data: props.chartData.yAxis,
        itemStyle: {
          color: (params: any) => {
            return colors[params.dataIndex % colors.length];
          }
        }
      }
    ]
  };
  myChart.setOption(option)
};

onMounted(() => {
  myChart = echarts.init(barChart.value)
})

// 暴露 initChart 方法给父组件
defineExpose({
  initBarChart
});

// 导出数据的方法
// const exportData = () => {
//   const data = props.chartData;
//   const csvContent = [
//     `${data.xName},${data.yName}`,
//     ...data.xAxis.map((x: any, index: number) => `${x},${data.yAxis[index]}`)
//   ].join('\n');
//
//   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//   const link = document.createElement('a');
//   if (link.download !== undefined) {
//     const url = URL.createObjectURL(blob);
//     link.setAttribute('href', url);
//     link.setAttribute('download', 'chart_data.csv');
//     link.style.visibility = 'hidden';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   }
// };
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: 450px; /* 增加一些高度以容纳按钮 */
  background-color: white; /* 根据需要调整背景颜色 */
}

.chart {
  width: 100%;
  height: 400px;
}

.export-button {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}

.export-button:hover {
  background-color: #45a049;
}
</style>
