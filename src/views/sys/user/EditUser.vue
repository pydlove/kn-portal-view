<template>
  <a-modal v-model:visible="visible" title="编辑用户" @ok="handleSubmit" @cancel="handleCancel">
    <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol" @finish="handleSubmit">
      <a-form-item label="用户名" required>
        <a-input v-model:value="formState.userName" />
      </a-form-item>
      <a-form-item label="密码" name="userPwd" :rules="[{ required: false, message: '请输入密码' }, { min: 8, message: '密码至少8位' }]">
        <a-input-password v-model:value="formState.userPwd" placeholder="不填则不修改密码" />
      </a-form-item>
      <a-form-item label="确认密码" name="confirmPassword" :rules="[{ required: false, message: '请确认密码' }, { validator: validateConfirmPassword }]">
        <a-input-password v-model:value="formState.confirmPassword" placeholder="不填则不修改密码" />
      </a-form-item>
      <a-form-item label="角色" required>
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
import { onMounted, reactive, ref, watch } from 'vue';
import { UserDataItem } from './index';
import { getAllRole } from '@/api/sys/role';
import { getAllTable } from '@/api/table/table';
import { updateUser } from '@/api/sys/user';
import { getRandomCode } from '@/api/login/login';
import { encrypt } from '@/utils';
import { message } from 'ant-design-vue';

const visible = ref(false);
const formState = reactive<UserDataItem>({
  id: 0,
  userName: '',
  roleId: 0,
  roleName: '',
  tableNames: '',
  createTime: '',
  updateTime: '',
  tableIds: [] as number[],
  userPwd: '',
  confirmPassword: ''
});

const props = defineProps<{
  user: UserDataItem | null;
  // propRoles: {
  //   type: Array,
  //   required: true,
  // },
  // propTables: {
  //   type: Array,
  //   required: true,
  // },
}>();
//
// const roles = props.propRoles
// const tables = props.propTables

const roles = ref([]);
const tables = ref([]);

const labelCol = { span: 6 };
const wrapperCol = { span: 18 };

watch(
  () => props.user,
  (newVal) => {
    if (newVal) {
      Object.assign(formState, newVal);
      formState.userPwd = ''; // 清空密码字段
      formState.confirmPassword = ''; // 清空确认密码字段
    }
  },
  { immediate: true }
);

const openModal = (rolesValue, tableValue, tableIds) => {
  visible.value = true;
  roles.value = rolesValue;
  tables.value = tableValue;
  formState.tableIds = tableIds;
};

const handleSubmit = async () => {
  try {
    let userData: any = {
      userId: formState.id,
      userName: formState.userName,
      roleId: formState.roleId,
      tableIds: formState.tableIds,
    };

    if (formState.userPwd && formState.confirmPassword) {
      // 获取随机码
      const { randomCode, randomId } = await getRandomCode();
      const encryptedPassword = encrypt(formState.userPwd, randomCode);

      // 添加加密后的密码和 randomId
      userData.userPwd = encryptedPassword;
      userData.randomId = randomId;
    }

    // 调用 updateUser 接口
    await updateUser(userData);

    // 提交成功后的处理
    message.success('编辑用户成功');
    emit('submit', formState);
    visible.value = false;
  } catch (error) {
    console.error('编辑用户失败', error);
    message.error('编辑用户失败');
  }
};

const handleCancel = () => {
  emit('cancel');
  visible.value = false;
};

const validateConfirmPassword = (rule: any, value: string) => {
  if (value && value !== formState.userPwd) {
    return Promise.reject('两次输入的密码不一致');
  }
  return Promise.resolve();
};

const emit = defineEmits(['submit', 'cancel']);

defineExpose({
  openModal,
});

</script>
