<template>
  <div class="ts-container">
    <a-card>
      <a-input-search
        addon-before="用户名"
        class="search-input"
        v-model:value="searchValue"
        placeholder="请输入用户名"
        :loading="isSearchLoading"
        style="display: block"
        @search="getSearchList"
      />

      <!-- 添加申请权限按钮 -->
      <a-button class="mb-20" type="primary" @click="openAddUserModal">新增用户</a-button>

      <a-table
        :columns="UserColumns"
        :data-source="dataSource"
        :loading="isLoading"
        :pagination="pagination"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a @click="openEditUserModal(record)">编辑</a>
            <a-divider type="vertical" />
            <a @click="showDeleteConfirm(record.id)">删除</a>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 引入 AddUser 组件 -->
    <add-user-modal ref="addUserModal" @submit="handleAddUserSubmit" @cancel="handleAddUserCancel" :propRoles="roles" :propTables="tables"></add-user-modal>

    <!-- 引入 EditUser 组件 -->
    <edit-user-modal ref="editUserModal" :user="editingUser" @submit="handleEditUserSubmit" @cancel="handleEditUserCancel" :propRoles="roles" :propTables="tables"></edit-user-modal>

    <!-- 删除确认框 -->
    <a-modal v-model:visible="deleteConfirmVisible" title="确认删除" @ok="confirmDelete" @cancel="cancelDelete">
      <p>确定要删除该用户吗？</p>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { getUserPage, addUser, updateUser, deleteUser as deleteUserApi } from '@/api/sys/user';
import { UserColumns, UserDataItem } from './index';
import AddUserModal from './AddUser.vue';
import EditUserModal from './EditUser.vue';
import { message } from 'ant-design-vue';
import {getAllRole} from "@/api/sys/role";
import {getAllTable} from "@/api/table/table";

const searchValue = ref('');
const dataSource = ref<UserDataItem[]>([]);
const isLoading = ref<boolean>(false);
const isSearchLoading = ref<boolean>(false);

const roles = ref([]);
const tables = ref([]);

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
  const res: { rows: UserDataItem[]; total: number } = await getUserPage({
    name: searchValue.value,
    page: current || pagination.value.current,
    rows: pageSize || pagination.value.pageSize,
  });
  console.log(res);

  isLoading.value = false;
  isSearchLoading.value = false;
  pagination.value.total = res.total;
  current && (pagination.value.current = current);
  pageSize && (pagination.value.pageSize = pageSize);
  dataSource.value = Array.isArray(res.rows) ? res.rows : [];
};

onMounted(() => {
  fetchData();
  fetchRoles();
  fetchTables();
});

const fetchRoles = async () => {
  roles.value = await getAllRole({});
};

const fetchTables = async () => {
  tables.value = await getAllTable({});
};

// 引入 AddUser 组件
const addUserModal = ref(null);

const openAddUserModal = () => {
  if (addUserModal.value) {
    addUserModal.value.openModal();
  }
};

const handleAddUserSubmit = async () => {
  fetchData(); // 刷新用户列表
};

const handleAddUserCancel = () => {
  // 处理取消逻辑
  console.log('新增用户已取消');
};

// 引入 EditUser 组件
const editUserModal = ref(null);
const editingUser = ref<UserDataItem | null>(null);

const openEditUserModal = (user: UserDataItem) => {
  editingUser.value = user;
  if (editUserModal.value) {
    editUserModal.value.openModal();
  }
};

const handleEditUserSubmit = async () => {
  fetchData(); // 刷新用户列表
};

const handleEditUserCancel = () => {
  // 处理取消逻辑
  console.log('编辑用户已取消');
};

// 删除确认框
const deleteConfirmVisible = ref(false);
const userIdToDelete = ref<number | null>(null);

const showDeleteConfirm = (id: number) => {
  deleteConfirmVisible.value = true;
  userIdToDelete.value = id;
};

const confirmDelete = async () => {
  if (userIdToDelete.value !== null) {
    try {
      isLoading.value = true;
      await deleteUserApi({ id: userIdToDelete.value });
      isLoading.value = false;
      message.success('删除用户成功');
      fetchData(); // 刷新用户列表
    } catch (error) {
      console.error('删除用户失败', error);
      message.error('删除用户失败');
    }
  }
  deleteConfirmVisible.value = false;
};

const cancelDelete = () => {
  deleteConfirmVisible.value = false;
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
