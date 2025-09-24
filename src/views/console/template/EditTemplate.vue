<!-- src/views/kn/console/template/EditTemplate.vue -->
<template>
  <!-- 修改模态框组件属性 -->
  <a-modal
    v-model:open="modalVisible"
    :title="modalTitle"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirm-loading="confirmLoading"
    width="50%"
    :maskClosable="false"
    :keyboard="false"
  >
    <a-form
      :model="templateForm"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      ref="formRef"
    >
      <a-form-item
        label="模板名称"
        name="templateName"
        :rules="[{ required: true, message: '请输入模板名称' }]"
      >
        <a-input v-model:value="templateForm.templateName" placeholder="请输入模板名称"/>
      </a-form-item>

      <a-form-item
        label="模板描述"
        name="templateDesc"
        :rules="[{ required: true, message: '请输入模板描述' }]"
      >
        <a-textarea
          v-model:value="templateForm.templateDesc"
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
          v-model:value="templateForm.templateLevel"
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

<script lang="ts" setup>
import {ref, reactive} from 'vue'
import {message} from 'ant-design-vue'
import {updateTemplate} from '@/api/template/template'
import {TemplateVO, TemplateForm} from './type'

// 模态框可见性
const modalVisible = ref(false)
const confirmLoading = ref(false)
const formRef = ref()

// 模态框标题
const modalTitle = ref('编辑面试模板')

// 表单数据
const templateForm = reactive<TemplateForm>({
  id: undefined,
  templateName: '',
  templateDesc: '',
  templateLevel: 1 // 默认值
})

// 表单布局
const labelCol = {span: 6}
const wrapperCol = {span: 18}

// 打开编辑模态框
const openModal = async (template: TemplateVO) => {
  modalVisible.value = true
  modalTitle.value = '编辑面试模板'

  // 填充表单数据
  templateForm.id = template.id
  templateForm.templateName = template.templateName
  templateForm.templateDesc = template.templateDesc
  templateForm.templateLevel = template.templateLevel // 新增字段
}

// 提交表单
const handleSubmit = async () => {
  confirmLoading.value = true
  try {
    // 表单验证
    await formRef.value.validate()

    // 更新面试模板
    if (templateForm.id) {
      await updateTemplate(templateForm.id, {
        templateName: templateForm.templateName,
        templateDesc: templateForm.templateDesc,
        templateLevel: templateForm.templateLevel
      })

      message.success('更新面试模板成功')
      emit('fetchTemplateList')
      modalVisible.value = false
    }
  } catch (error: any) {
    console.error('更新面试模板失败', error)
    if (error?.errorFields) {
      // 表单验证失败
      console.log('表单验证失败')
    } else {
      message.error('更新面试模板失败')
    }
  } finally {
    confirmLoading.value = false
  }
}

// 处理取消
const handleCancel = () => {
  modalVisible.value = false
}

const emit = defineEmits(['fetchTemplateList'])

defineExpose({
  openModal
})
</script>
