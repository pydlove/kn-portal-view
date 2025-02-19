<template>
  <div class="ts-container">
    <a-card>
      <a-input-search
        addon-before="申请人"
        class="search-input"
        v-model:value="username"
        placeholder="Please input wiwid"
        :loading="isSearchLoading"
        style="display: block"
        @search="getSearchList"
      />

      <a-input-search
        addon-before="申请单号"
        class="search-input"
        v-model:value="applyNo"
        placeholder="Please input wiwid"
        :loading="isSearchLoading"
        style="display: block"
        @search="getSearchList"
      />


      <!-- 添加申请权限按钮 -->
      <a-button type="primary" @click="openApplyModal">申请权限</a-button>

      <a-table
        :columns="applyTableColumns"
        :data-source="applyData"
        :loading="isLoading"
        :pagination="pagination"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a>编辑</a>
            <a-divider type="vertical"/>
            <a>删除</a>
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
import {getApplyPage} from "@/api/table/apply";

const username = ref('');
const applyNo = ref('');
const applyData = ref<DataItem[]>([]);
const isLoading = ref<boolean>(false);
const isSearchLoading = ref<boolean>(false);

const dataTableName = ref("残疾人基础信息表")
const dataTableId = ref(1)

const pagination = ref({
  current: 1,
  pageSize: 15,
  total: 0,
  showTotal: (total: number) => `Total ${total} items`,
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
  applyData.value = Array.isArray(res.rows) ? res.rows : [];
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
  margin-bottom: 20px;
}
</style>
