<template>
  <div ref="pieChart" style="width: 100%; height: 400px;"></div>
</template>

<script setup>
import * as echarts from 'echarts';
import { ref, onMounted, defineProps } from 'vue';

const props = defineProps({
  chartData: {
    type: Object,
    required: true
  }
});

const pieChart = ref(null);
let myChart = ref(null);

const initPieChart = () => {
  const option = {
    series: [
      {
        type: 'pie',
        data: props.chartData.data,
        label: {
          formatter: '{b}: {c} ({d}%)'
        }
      }
    ]
  }
  myChart.setOption(option);
};
onMounted(() => {
  myChart = echarts.init(pieChart.value);
});
// 暴露 initChart 方法给父组件
defineExpose({
  initPieChart
});
</script>
