<template>
  <div class="container" :style="data.containerStyle">
    <div class="table-info">
      <a-spin style="margin-top: 200px" :spinning="data.loading">
        <a-row :gutter="[16, 16]">
          <a-col :span="7" v-for="item in data.cardData" :key="item.tableId" style="height: 54px; background-color: #f4f4f4;margin-left: 16px;margin-top: 20px;border-radius: 6px;">
            <div style="font-weight: bold;color:#585858;width: 192px;line-height: 52px;float: left;">{{ item.tableComment }}</div>
            <div style="float: left;margin-top: 11px;margin-left: 20px">
              <a-button class="handle" type="dashed" shape="round" @click="preview(item)" >预览</a-button>
              <a-button class="handle" style="color: #409EFF" type="dashed" shape="round" @click="checkAccessAuthRequest(item)" >提问</a-button>
            </div>
          </a-col>
        </a-row>
      </a-spin>
    </div>

    <a-drawer :title="data.tableInfo.tableComment" placement="right" @close="onClosePreview" :closable="false" v-model:visible="data.previewVisible" width="45%" >
      <a-tabs v-model:activeKey="data.activeKey">
        <a-tab-pane key="1" tab="字段详情">
          <a-spin :spinning="data.loading">
            <a-table
              :columns="data.tableInfoHead"
              :data-source="data.tableDetail.columnList"
              :pagination="false"
              :scroll="{ x: 500, y: 400 }"
            />
          </a-spin>
        </a-tab-pane>
        <a-tab-pane key="2" tab="数据预览" :click="getPreviewData(data.tableDetail)">
          <a-spin :spinning="data.loading">
            <a-table
              :columns="data.previewDataHead"
              :data-source="data.previewData"
              :pagination="false"
              :scroll="{ x: 500, y: 400 }"
            />
          </a-spin>
        </a-tab-pane>
      </a-tabs>
    </a-drawer>

    <!-- 引入 Apply 组件 -->
    <apply-modal ref="applyModal"></apply-modal>
  </div>
</template>

<script lang="ts" setup>
import {ref, computed, reactive, onMounted, inject } from 'vue';
import {message} from 'ant-design-vue';
import {getAllTable,tableDetail} from "@/api/table/table";
import {talkQuestion,queryPreviewData} from "@/api/table/query";
import {TableVo} from "@/views/table/query/index";
import ApplyModal from "@/components/Apply.vue";
import {checkAccessAuth} from "@/api/table/dataAuth"; // 确保导入的是正确的函数

const data = reactive({
    containerStyle: "",
    previewVisible: false,
    loading: false,
    tableInfo: [],
    tableDetail:[],
    activeKey: '1',
    tableInfoHead:[{title: '字段名称',dataIndex: 'columnName',width: 200},{title: '字段说明',dataIndex: 'columnDesc',width: 300}],
    previewDataHead:[],
    previewData:[],
    cardData:[]
})

const changeView = inject('changeView');

onMounted(() => {
  let winHeight = `${window.innerHeight}`;
  data.containerStyle = "width:100%;height: " + (winHeight - 100) + "px;max-height:" + (winHeight - 100) + "px;";
  queryTableInfo();
});


const onClosePreview = () =>{
  data.previewVisible = false
  data.activeKey = '1'
}

const queryTableInfo = async () => {
  data.loading = true;
  try {
    const res: { rows: TableVo[];} = await getAllTable()
    data.cardData = res;
  } catch (e) {
    data.loading = false;
    message.error(e)
  }
  data.loading = false;
}

const queryTableDetail = async () => {
  try {
    data.loading = true;
    const res: { rows: TableVo[];} = await tableDetail()
    data.tableDetail = res;
  } catch (e) {
    data.loading = false;
    message.error(e)
  }
  data.loading = false;
}


const getPreviewData = async (obj) =>{
  if (data.activeKey == '2'){
    if ((data.previewData && data.previewData.length > 0) && data.tableInfo.tableName == obj.tableName){
      return;
    }
    data.loading = true;
    try {
      const res: { rows: TalkVo[];} = await queryPreviewData({ tableName: obj.tableName, content: "查询所有数据" });
      let colums = new Array()
      let resultColumns = res.columnList
      if (!resultColumns || resultColumns.length == 0){
        data.previewDataHead = [];
        ata.loading = false
        return;
      }
      for(let i = 0; i < resultColumns.length; i ++){
          colums.push({title:resultColumns[i].columnDesc,dataIndex:resultColumns[i].columnName,width: 200})
      }
      data.previewDataHead = colums
      if (!res.dataList || res.dataList.length == 0){
        data.previewData = [];
        data.loading = false
        return;
      }
      data.previewData = res.dataList
    } catch (error) {
      data.loading = false;
      message.error(error)
    }
    data.loading = false
  }
}

const preview = (item) =>{
  data.tableInfo = item
  data.previewVisible = true
  queryTableDetail()
}


const checkAccessAuthRequest = async (item) => {
  data.loading = true
  try {
    let hasAccess = await checkAccessAuth({tableId: item.tableId});
    if (hasAccess === 1) {
      changeView(false, item);
    } else {
      if (hasAccess === 0) {
        message.error('您没有权限访问该表, 请申请访问！');
        openApplyModal(item);
      } else {
        message.error('您已经申请该表的访问权限，目前正在审批中，请耐心等待！');
      }
    }
  } catch (error) {
    data.loading = false;
    message.error('检查权限失败，请稍后再试');
  }
  data.loading = false
};

const applyModal = ref(null);
const openApplyModal = (item) => {
  if (applyModal.value) {
    applyModal.value.openModal(item);
  }
};
</script>