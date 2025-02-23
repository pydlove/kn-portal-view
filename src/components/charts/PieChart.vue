<template>
  <Pie :data="chartData"/>
</template>

<script setup>
import { Pie } from 'vue-chartjs';
import { ref, defineProps } from 'vue';

const props = defineProps({
  chartData: {
    type: Object,
    required: true
  }
});
</script>
