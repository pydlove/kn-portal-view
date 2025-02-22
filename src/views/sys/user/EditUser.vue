<template>
  <a-modal v-model:visible="visible" title="编辑用户" @ok="handleSubmit" @cancel="handleCancel">
    <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item label="用户名">
        <a-input v-model:value="formState.userName" />
      </a-form-item>
      <a-form-item label="角色ID">
        <a-input v-model:value="formState.roleId" />
      </a-form-item>
      <a-form-item label="表名">
        <a-input v-model:value="formState.tableNames" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { defineComponent, reactive, ref, watch } from 'vue';
import { UserDataItem } from './index';

const visible = ref(false);
const formState = reactive<UserDataItem>({
  id: 0,
  userName: '',
  roleId: 0,
  roleName: '',
  tableNames: '',
  createTime: '',
  updateTime: '',
});

const labelCol = { span: 6 };
const wrapperCol = { span: 18 };

const props = defineProps<{
  user: UserDataItem | null;
}>();

watch(
  () => props.user,
  (newVal) => {
    if (newVal) {
      Object.assign(formState, newVal);
    }
  },
  { immediate: true }
);

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
</script>
