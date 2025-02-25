<template>
  <div ref="lineChart" style="width: 100%; height: 400px;"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
    chartData: {
        type: Object,
        required: true
    }
});
const lineChart = ref(null);

let myChart = ref(null);
const initLineChart = () => {
  // chartInstance.setOption(props.chartOptions);
  const option = {
    xAxis: {
      type: 'category',
      data: props.chartData.xAxis
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: props.chartData.yAxis,
        type: 'line'
      }
    ]
  }
  myChart.setOption(option)
};

onMounted(() => {
  myChart = echarts.init(lineChart.value);
})

// 暴露 initChart 方法给父组件
defineExpose({
  initLineChart
});
</script>

<style scoped>
</style>
