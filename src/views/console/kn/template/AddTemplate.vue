<!-- src/views/kn/console/template/AddTemplate.vue -->
<template>
  <a-modal
    v-model:open="visible"
    title="新增面试模板"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirm-loading="confirmLoading"
    width="50%"
    :maskClosable="false"
    :keyboard="false"
  >
    <a-form
      :model="formState"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      ref="formRef"
    >
      <a-form-item
        label="模板名称"
        name="templateName"
        :rules="[{ required: true, message: '请输入模板名称' }]"
      >
        <a-input v-model:value="formState.templateName" placeholder="请输入模板名称" />
      </a-form-item>

      <a-form-item
        label="模板描述"
        name="templateDesc"
        :rules="[{ required: true, message: '请输入模板描述' }]"
      >
        <a-textarea
          v-model:value="formState.templateDesc"
          placeholder="请输入模板描述"
          :rows="4"
        />
      </a-form-item>

      <!-- 新增模板等级字段 -->
      <a-form-item
        label="模板等级"
        name="templateLevel"
        :rules="[{ required: true, message: '请选择模板等级' }]"
      >
        <a-select
          v-model:value="formState.templateLevel"
          placeholder="请选择模板等级"
        >
          <a-select-option :value="4">应届生</a-select-option>
          <a-select-option :value="1">初级</a-select-option>
          <a-select-option :value="2">中级</a-select-option>
          <a-select-option :value="3">高级</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { createTemplate } from '@/api/kn/template/template'
import { TemplateForm } from './type'

const visible = ref(false)
const confirmLoading = ref(false)
const formRef = ref()

const formState = reactive<TemplateForm>({
  templateName: '',
  templateDesc: '',
  templateLevel: 1 // 默认值
})

const labelCol = { span: 6 }
const wrapperCol = { span: 18 }

// 打开模态框
const openModal = async () => {
  visible.value = true
  resetForm()
}

// 重置表单
const resetForm = () => {
  formState.templateName = ''
  formState.templateDesc = ''
  formState.templateLevel = 1
}

// 提交表单
const handleSubmit = async () => {
  confirmLoading.value = true
  try {
    try {
      await formRef.value.validate()
    } catch (error) {
      confirmLoading.value = false
      return
    }

    await createTemplate({
      templateName: formState.templateName,
      templateDesc: formState.templateDesc,
      templateLevel: formState.templateLevel
    })

    message.success('新增面试模板成功')
    emit('fetchTemplateList')
    visible.value = false
  } catch (error) {
    console.error('新增面试模板失败', error)
    message.error('新增面试模板失败')
  } finally {
    confirmLoading.value = false
  }
}

const handleCancel = () => {
  visible.value = false
}

const emit = defineEmits(['fetchTemplateList'])

defineExpose({
  openModal
})
</script>
