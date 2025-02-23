<template>
  <a-modal v-model:visible="visible" title="新增用户" @ok="handleSubmit" @cancel="handleCancel">
    <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol" @finish="handleSubmit">
      <a-form-item label="用户名">
        <a-input v-model:value="formState.userName" />
      </a-form-item>
      <a-form-item label="密码" name="userPwd" :rules="[{ required: true, message: '请输入密码' }, { min: 8, message: '密码至少8位' }]">
        <a-input-password v-model:value="formState.userPwd" />
      </a-form-item>
      <a-form-item label="确认密码" name="confirmPassword" :rules="[{ required: true, message: '请确认密码' }, { validator: validateConfirmPassword }, { min: 8, message: '密码至少8位' }]">
        <a-input-password v-model:value="formState.confirmPassword" />
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
import { onMounted, reactive, ref } from 'vue';
import { UserAddDataItem } from './index';
import { getRandomCode } from '@/api/login/login';
import { addUser } from '@/api/sys/user';
import { encrypt } from '@/utils';
import { message } from 'ant-design-vue';

const visible = ref(false);
const formState = reactive<UserAddDataItem>({
  userPwd: '',
  confirmPassword: '',
  userName: '',
  roleId: null,
  tableIds: []
});

const props = defineProps({
  propRoles: {
    type: Array,
    required: true,
  },
  propTables: {
    type: Array,
    required: true,
  },
});

const roles = props.propRoles
const tables = props.propTables

const labelCol = { span: 6 };
const wrapperCol = { span: 18 };

const openModal = () => {
  visible.value = true;
};

const handleSubmit = async () => {
  try {
    // 获取随机码
    const { randomCode, randomId } = await getRandomCode();
    const encryptedPassword = encrypt(formState.userPwd, randomCode);

    // 构建请求参数
    const userData = {
      userName: formState.userName,
      userPwd: encryptedPassword,
      roleId: formState.roleId,
      tableIds: formState.tableIds,
      randomId: randomId
    };

    // 调用 addUser 接口
    await addUser(userData);

    // 提交成功后的处理
    message.success('新增用户成功');
    emit('submit', formState);
    visible.value = false;
  } catch (error) {
    console.error('新增用户失败', error);
    message.error('新增用户失败');
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
