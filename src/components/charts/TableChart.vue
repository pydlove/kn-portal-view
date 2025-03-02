<template>
  <a-spin :spinning="data.loading">
    <a-table
      :columns="data.tableHead"
      :data-source="data.tableData"
      :pagination="pagination"
      :scroll="{ x: data.tableWidth, y: data.tableHeight}"
      :customRow="()=>({style:{height:'8px',lineHeight:'8px'}})"
      :customHeaderRow="()=>({style:{height:'12px',lineHeight:'12px'}})"
    >
      <template #name="{ text }">{{ text.first }} {{ text.last }}</template>
    </a-table>
  </a-spin>
</template>

<script setup>
import { ref, defineProps, onMounted, reactive } from 'vue';

const data = reactive({
    loading: false,
    tableWidth: 5000,
    tableHeight: 300,
    tableHead: [],
    tableData: []
})

const props = defineProps({
  chartData: {
    type: Object,
    required: true
  }
});


onMounted(() => {
  let winHeight = `${window.innerHeight}`;
  data.tableHeight = winHeight - 430
  initData();
  if (!data.tableHead || data.tableHead == null || data.tableHead == undefined){
    return;
  }
  if (data.tableHead.length > 50){
    data.tableWidth = 24000
  } else if (data.tableHead.length > 40){
    data.tableWidth = 16000
  } else if (data.tableHead.length > 30){
    data.tableWidth = 8000
  } else if (data.tableHead.length > 20){
    data.tableWidth = 5000
  }
});


function initData(){
  if (!props || !props.chartData || !props.chartData.columns || !props.chartData.data){
    return;
  }
  data.loading = true;
  try {
    let headInfos = new Array()
    let resultColumns = props.chartData.columns
    if (!resultColumns || resultColumns.length == 0){
      data.tableHead = [];
      data.loading = false
      return;
    }
    for(let i = 0; i < resultColumns.length; i ++){
        headInfos.push({title:resultColumns[i].columnDesc,dataIndex:resultColumns[i].columnName})
    }
    data.tableHead = headInfos
    data.tableData = props.chartData.data
    data.loading = false
  } catch (error) {
    data.loading = false;
    message.error(error)
  }
  data.loading = false
}

</script>

<style scoped>
/* 列表组件样式自定义 */
</style>
