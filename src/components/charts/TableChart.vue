<template>
  <a-table :columns="columns" :data-source="tableData" :loading="isLoading">
    <template #operation="{ record }">
      <a-button type="link" @click="handleView(record)">查看</a-button>
    </template>
  </a-table>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Table, Button } from 'ant-design-vue';

// 定义 props 来接收 columns 和 tableData
const props = defineProps({
  columns: {
    type: Array,
    required: true
  },
  tableData: {
    type: Array,
    required: true
  }
});

// 加载状态
const isLoading = ref(false);

// 查看操作的处理函数，可根据业务需求完善
const handleView = (record) => {
  console.log('查看记录', record);
};

// 页面挂载时初始化
onMounted(() => {
  // 初始化加载状态
  isLoading.value = false;
});
</script>

<style scoped>
/* 列表组件样式自定义 */
</style>
