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

// 模拟表格列配置，可根据实际情况从后端获取
const columns = [
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
  },
  {
    title: '操作',
    key: 'operation',
    slots: { customRender: 'operation' }
  }
];

// 表格数据
const tableData = ref([]);
// 加载状态
const isLoading = ref(false);

// 获取表格数据的方法，这里模拟从后端获取，实际需替换接口地址
const fetchTableData = async () => {
  // isLoading.value = true;
  try {
    const response = await fetch('/talk/question');
    const result = await response.json();
    tableData.value = result.data;
  } catch (error) {
    console.error('获取数据失败', error);
  } finally {
    isLoading.value = false;
  }
};

// 查看操作的处理函数，可根据业务需求完善
const handleView = (record) => {
  console.log('查看记录', record);
};

// 页面挂载时获取一次数据
onMounted(() => {
  fetchTableData();
});
</script>

<style scoped>
/* 列表组件样式自定义 */
</style>
