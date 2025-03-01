<template>
  <div class="container" :style="data.containerStyle">
    <!-- 左侧栏 -->
    <a-card class="left-card">
      <a-button @click="newTalk" style="margin-left: 4px;width: 160px;border-color: #409EFF;color: #409EFF">新建对话</a-button>
      <div style="margin-top: 20px"></div>
      <a-row :gutter="[6, 6]" v-for="item in data.talkInfoList" :key="item.id">
        <div class="talk-info" @click="resumTalk(item)">{{item.content}}</div>
      </a-row>
    </a-card>

    <!-- 右侧内容 -->
    <a-card class="right-card">
      <!-- 表信息 -->
      <TableInfo v-if="data.isShow"/>
      <!-- 查询结果展示 -->
      <Talk v-if="!data.isShow" ref="talkRef" :tableInfo='{"tableName":data.currentTableName,"tableDesc":data.currentTableDesc}'/>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import {ref, computed, reactive, onMounted, provide, inject, nextTick } from 'vue';
import Talk from '@/views/table/query/Talk.vue';
import TableInfo from '@/views/table/query/TableInfo.vue';

const data = reactive({
    containerStyle: "",
    isShow: true,
    talkInfoList: JSON.parse(localStorage.getItem("talkInfoList")),
    currentTableName: "",
    currentTableDesc: "",
})

onMounted(() => {
  let winHeight = `${window.innerHeight}`;
  data.containerStyle = "width:100%;height: " + (winHeight - 100) + "px;max-height:" + (winHeight - 100) + "px;";
});

provide('changeView', changeView);
provide('updateTalkInfoList', updateTalkInfoList);
const talkRef = ref(null);

function newTalk(){
  changeView(true,{"tableName":"","tableComment":""})
}

function changeView(showStatus, tableInfo){
  data.currentTableName = tableInfo.tableName
  data.currentTableDesc = tableInfo.tableComment
  data.isShow = showStatus;
}

function updateTalkInfoList(){
  data.talkInfoList = JSON.parse(localStorage.getItem("talkInfoList"))
}

const resumTalk = (item) =>{
  data.currentTableName = item.tableName
  data.currentTableDesc = item.tableDesc
  data.isShow = false;
  nextTick(() => {
    if (talkRef.value){
      talkRef.value.resumTalk(item);
    }
  });
  // resumTalk(item)
}

</script>

<style scoped>
.container{margin-top: 16px;width: 100%; height: 100%; float: left;}
.talk-info{position: relative;width: 100%;height: 32px;line-height:32px;border-radius:5px;color:#818181;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}
.talk-info:hover{font-weight: bold;}
.talk-active{font-weight: bold;}
/*.table-card{background-color: #f2f2f2;}*/
.left-card{width: 220px; height: 100%;float: left;border-color: #C5C5C5}
.right-card{margin-left: 10px;width: calc(100% - 230px); height: 100%;float: left;border-color: #C5C5C5}
.table-info{margin-top: 40px;}

::v-deep .ant-card-head{background-color: #D3C4E1;}
.table-desc{margin-top: -10px;}
.table-handle{margin-top: 20px;float: right};
::v-deep .ant-card .ant-card-body{background-color: #C5C5C5;}
/*::v-deep .ant-input{border-radius: 20px;background:rgba(0, 0, 0, 0);};*/



::-webkit-scrollbar {width: 3px;height: 3px;}
::-webkit-scrollbar-track {background: #fff;border-radius: 3px;}
::-webkit-scrollbar-thumb {background: rgb(205, 206, 206);border-radius: 3px;}
::-webkit-scrollbar-thumb:hover {background: #333;}
::-webkit-scrollbar-corner {background: #fff;}

</style>
