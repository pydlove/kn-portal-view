<template>
  <Line :data="chartData" :options="chartOptions"/>
</template>

<script setup>
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale } from 'chart.js';
import { ref, defineProps } from 'vue';

// 注册图表相关元素和配置
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale);

const props = defineProps({
  chartData: {
    type: Object,
    required: true
  },
  chartOptions: {
    type: Object,
    default: () => ({})
  }
});
</script>
