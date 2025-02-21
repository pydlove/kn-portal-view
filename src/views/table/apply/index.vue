<template>
  <div class="ts-container">
    <a-card>
      <a-input-search
        addon-before="申请人"
        class="search-input"
        v-model:value="username"
        placeholder="请输出申请人的姓名"
        :loading="isSearchLoading"
        style="display: block"
        @search="getSearchList"
      />

      <!-- 添加申请权限按钮 -->
      <div class="batch-actions">
<!--        <a-button class="mr-20 mb-20" type="primary" @click="batchAgree">批量同意-->
<!--        </a-button>-->
<!--        <a-button class="mr-20 mb-20" type="primary" :danger="true" @click="batchReject">-->
<!--          批量拒绝-->
<!--        </a-button>-->
        <a-button class="mr-20 mb-20" type="primary" @click="openApplyModal">申请权限
        </a-button>
        <a-button class="mr-20 mb-20" type="primary" @click="checkAccessAuthRequest">检测是否有权限访问表
        </a-button>
      </div>
      <a-table
        :columns="applyTableColumns"
        :data-source="applyData"
        :loading="isLoading"
        :pagination="pagination"
      >
<!--        :row-selection="rowSelection"-->
        <template #headerCell="{ column }">
          <template v-if="column.key === 'action'">
            <a-checkbox :checked="allSelected" @change="toggleAllSelection" />
          </template>
          <span style="text-align: center;">{{ column.title }}</span>
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-checkbox :checked="record.isChecked" @change="handleCheckboxChange(record, $event)" />
          </template>
          <template v-if="column.dataIndex === 'operation'">
            <div class="editable-row-operations" v-if="record.applyStatus == 0">
              <span>
                <a-typography-link @click="confirmAgree(record.id, 1)"
                                   style="margin-right: 8px">同意</a-typography-link>
              </span>
              <span>
                <a-typography-link @click="confirmReject(record.id, 2)"
                                   style="margin-right: 8px">拒绝</a-typography-link>
              </span>
            </div>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 引入 Apply 组件 -->
    <apply-modal ref="applyModal" :dataTableName="dataTableName"
                 :dataTableId="dataTableId"></apply-modal>
  </div>
</template>

<script lang="ts" setup>
import {computed, defineComponent, onMounted, ref} from 'vue';
import {applyTableColumns, DataItem} from './index';
import ApplyModal from '../../../components/Apply.vue';
import {batchUpdateApply, getApplyPage, updateApply} from "@/api/table/apply";
import {message, Modal} from "ant-design-vue";
import { checkAccessAuth } from '@/api/table/dataAuth';

const allSelected = ref(false);

const toggleAllSelection = (event: any) => {
  allSelected.value = event.target.checked;
  if (allSelected.value) {
    selectedRowKeys.value = applyData.value.map(item => item.id);
    selectedRows.value = applyData.value;
    applyData.value.forEach(item => item.isChecked = true);
  } else {
    selectedRowKeys.value = [];
    selectedRows.value = [];
    applyData.value.forEach(item => item.isChecked = false);
  }
};

const username = ref('');
const applyNo = ref('');
const applyData = ref<DataItem[]>([]);
const isLoading = ref<boolean>(false);
const isSearchLoading = ref<boolean>(false);

const dataTableName = ref("残疾人基础信息表")
const dataTableId = ref(1)

const selectedRowKeys = ref<number[]>([]);
const selectedRows = ref<DataItem[]>([]);

const rowSelection = {
  selectedRowKeys: selectedRowKeys,
  onChange: (selectedKeys: number[], selectedItems: DataItem[]) => {
    selectedRowKeys.value = selectedKeys;
    selectedRows.value = selectedItems;
  },
};

const pagination = ref({
  current: 1,
  pageSize: 15,
  total: 0,
  showTotal: (total: number) => `共 ${total} 条`,
  onChange: (page: number, pageSize: number) => {
    fetchData(page, pageSize);
  },
});

const getSearchList = () => {
  isSearchLoading.value = true;
  fetchData(1, 15);
};

const fetchData = async (current?: number, pageSize?: number) => {
  isLoading.value = true;
  const res: { rows: DataItem[]; total: number } = await getApplyPage({
    username: username.value,
    applyNo: applyNo.value,
    page: current || pagination.value.current,
    rows: pageSize || pagination.value.pageSize,
  });

  isLoading.value = false;
  isSearchLoading.value = false;
  pagination.value.total = res.total;
  current && (pagination.value.current = current);
  pageSize && (pagination.value.pageSize = pageSize);
  applyData.value = Array.isArray(res.rows)
    ? res.rows.map(row => ({ ...row, isChecked: false }))
    : [];

  console.log(applyData.value)
};

const confirmAgree = (id: number, status: number) => {
  Modal.confirm({
    title: '申请同意确认',
    content: '您确定要通过此申请吗？',
    okText: '同意',
    cancelText: '取消',
    onOk() {
      update(id, status);
    },
  });
};

const confirmReject = (id: number, status: number) => {
  Modal.confirm({
    title: '申请拒绝确认',
    content: '您确定要拒绝此申请吗？',
    okText: '拒绝',
    cancelText: '取消',
    onOk() {
      update(id, status);
    },
  });
};

const update = async (id: number, status: number) => {
  try {
    await updateApply({id: id, applyStatus: status});
    message.success('审批成功');
    fetchData(); // 刷新数据
  } catch (error) {
    message.error('审批失败，请重试');
  }
};

const batchAgree = () => {
  if (selectedRows.value.length === 0) {
    message.warning('请选择要同意的申请');
    return;
  }
  Modal.confirm({
    title: '申请同意确认',
    content: `您确定要同意这 ${selectedRows.value.length} 个申请吗？`,
    okText: '同意',
    cancelText: '取消',
    onOk() {
      batchUpdate(1);
    },
  });
};

const batchReject = () => {
  if (selectedRows.value.length === 0) {
    message.warning('请选择要拒绝的申请');
    return;
  }
  Modal.confirm({
    title: '申请拒绝确认',
    content: `您确定要拒绝这 ${selectedRows.value.length} 个申请吗？`,
    okText: '拒绝',
    cancelText: '取消',
    onOk() {
      batchUpdate(2);
    },
  });
};

const batchUpdate = async (status: number) => {
  try {
    await batchUpdateApply({
      ids: selectedRowKeys.value,
      applyStatus: status,
    });
    message.success('审批成功');
    fetchData(); // 刷新数据
    selectedRowKeys.value = []; // 清空选中项
  } catch (error) {
    message.error('审批失败，请重试');
  }
};


const handleCheckboxChange = (record: DataItem, event: any) => {
  record.isChecked = event.target.checked;
  if (record.isChecked) {
    selectedRowKeys.value.push(record.id);
    selectedRows.value.push(record);
  } else {
    selectedRowKeys.value = selectedRowKeys.value.filter(key => key !== record.id);
    selectedRows.value = selectedRows.value.filter(row => row.id !== record.id);
  }
  allSelected.value = selectedRowKeys.value.length === applyData.value.length;
};

const checkAccessAuthRequest = async () => {
  try {
    const hasAccess = await checkAccessAuth({tableId: 1});
    if (hasAccess) {
      message.success('您可以访问该表');
    } else {
      message.error('您没有权限访问该表');
    }
  } catch (error) {
    console.error('检查权限失败:', error);
    message.error('检查权限失败，请稍后再试');
  }
};


onMounted(() => {
  fetchData();
});

// 引入 Apply 组件
const applyModal = ref(null);

const openApplyModal = () => {
  if (applyModal.value) {
    applyModal.value.openModal();
  }
};

</script>

<style scoped>
.ts-container {
  padding: 16px;
}

.search-input {
  min-width: 100px;
  max-width: 300px;
  margin-bottom: 40px;
}
</style>
