<template>
  <a-modal v-model:visible="visible" title="新增用户" @ok="handleSubmit" @cancel="handleCancel">
    <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item label="用户名">
        <a-input v-model:value="formState.userName" />
      </a-form-item>
      <a-form-item label="角色">
        <a-select v-model:value="formState.roleId" placeholder="请选择角色">
          <a-select-option v-for="role in roles" :key="role.roleId" :value="role.roleId">
            {{ role.roleName }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="表名">
        <a-select
          mode="multiple"
          v-model:value="formState.tableIds"
          placeholder="请选择表名"
          style="width: 100%"
        >
          <a-select-option v-for="table in tables" :key="table.tableId" :value="table.tableId">
            {{ table.tableComment }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref} from 'vue';
import {UserAddDataItem} from './index';
import {getAllRole} from '@/api/sys/role';
import {getAllTable} from '@/api/table/table';

const visible = ref(false);
const formState = reactive<UserAddDataItem>({
  userPwd: '',
  userName: '',
  roleId: null,
  tableIds: []
});

const roles = ref([]);
const tables = ref([]);

const labelCol = { span: 6 };
const wrapperCol = { span: 18 };

const fetchRoles = async () => {
  roles.value = await getAllRole({});
};

const fetchTables = async () => {
  tables.value = await getAllTable({});
};

const openModal = () => {
  visible.value = true;
};

const handleSubmit = () => {
  emit('submit', formState);
  visible.value = false;
};

const handleCancel = () => {
  emit('cancel');
  visible.value = false;
};

const emit = defineEmits(['submit', 'cancel']);

defineExpose({
  openModal,
});

onMounted(() => {
  fetchRoles();
  fetchTables();
});
</script>
