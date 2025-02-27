<template>
  <div class="apply-container">
    <a-modal
      :title="modalTitle"
      :visible="isModalVisible"
      @ok="handleSubmit"
      @cancel="handleCancel"
      :maskClosable="false"
      cancelText="取消"
      okText="确认"
      width="600px"
    >
      <a-form layout="vertical" class="modal-form apply-form">
        <a-form-item class="apply-form-item" label="申请单号" :label-col="{ span: 6 }" :wrapper-col="{ span: 40 }">
          <a-input v-model:value="applyNo" disabled placeholder="自动生成的申请单号" />
        </a-form-item>

        <a-form-item class="apply-form-item" label="数据表名称" :label-col="{ span: 6 }" :wrapper-col="{ span: 40 }">
          <a-input v-model:value="dataTableName" disabled placeholder="数据表名称" />
        </a-form-item>

        <a-form-item class="apply-form-item" label="申请用户" :label-col="{ span: 6 }" :wrapper-col="{ span: 40 }" required>
          <a-input v-model:value="applyUser" placeholder="请输入申请用户" required />
        </a-form-item>

        <a-form-item class="apply-form-item" label="申请用途" :label-col="{ span: 6 }" :wrapper-col="{ span: 40 }" required>
          <a-textarea v-model:value="purpose" placeholder="请输入申请用途" rows="4"  />
        </a-form-item>

        <a-form-item class="apply-form-item" label="申请理由" :label-col="{ span: 6 }" :wrapper-col="{ span: 40 }" required>
          <a-textarea v-model:value="applyReason" placeholder="请输入申请理由" rows="4" required />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { message } from 'ant-design-vue'; // 导入 message 组件
import { onSubmitApply } from '@/api/table/apply';

const dataTableName = ref("")
const dataTableId =  ref("")

const applyUser = ref('');
const applyReason = ref('');
const purpose = ref('');

// 自动生成申请单号
const generateApplyNo = () => {
  const timestamp = new Date().getTime();
  return `${timestamp}${Math.floor(Math.random() * 1000)}`;
};

const applyNo = ref(generateApplyNo());

const isModalVisible = ref(false);
const modalTitle = ref('权限申请');

const openModal = (item) => {
  isModalVisible.value = true;
  dataTableName.value=item.tableComment
  dataTableId.value=item.tableId
};

const handleSubmit = async () => {
  if (!applyUser.value || !applyReason.value || !purpose.value) {
    message.error('请填写所有必填项');
    return;
  }

  // 提交表单逻辑
  try {
    const response = await onSubmitApply({
      username: applyUser.value,
      tableId: dataTableId.value,
      applyReason: applyReason.value,
      purpose: purpose.value,
      applyNo: applyNo.value,
    });
    message.success('申请已成功提交');
    isModalVisible.value = false;

    // 清空表单值
    applyUser.value = '';
    applyReason.value = '';
    purpose.value = '';
    applyNo.value = generateApplyNo();

  } catch (error) {
    message.error('提交失败，请稍后重试');
  }
};

const handleCancel = () => {
  isModalVisible.value = false;
};

defineExpose({ openModal, handleSubmit, handleCancel });
</script>

<style scoped>
.apply-container {
  padding: 16px;
}

.modal-form {
  padding: 24px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.modal-form .ant-form-item {
  margin-bottom: 16px;
}

.modal-form .ant-form-item-label {
  font-size: 16px;
  color: #555;
}

.modal-form .ant-input,
.modal-form .ant-textarea {
  font-size: 14px;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  width: 100%;
}

.modal-form .ant-input-disabled {
  background-color: #f5f5f5;
  border-color: #d9d9d9;
}

.modal-form .ant-btn-primary {
  font-size: 16px;
  padding: 10px 20px;
  border-radius: 4px;
}
</style>
