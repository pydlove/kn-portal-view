<template>
  <a-modal
    v-model:open="visible"
    title="新增面试题"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirm-loading="confirmLoading"
    width="80%"
    :maskClosable="false"
    :keyboard="false"
  >
    <a-form
      :model="formState"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      ref="formRef"
    >
      <a-row :gutter="24" style="align-items: center;justify-content: left">
        <a-col :span="12">
          <a-form-item
            label="题目标题"
            name="questionTitle"
            :rules="[{ required: true, message: '请输入题目标题' }]"
          >
            <a-input v-model:value="formState.questionTitle" placeholder="请输入题目标题" />
          </a-form-item>
        </a-col>

        <a-col :span="8">
          <a-form-item
            label="难度等级"
            name="difficultyLevel"
            :rules="[{ required: true, message: '请选择难度等级' }]"
          >
            <a-select
              v-model:value="formState.difficultyLevel"
              placeholder="请选择难度等级"
              style="width: 100%"
            >
              <a-select-option value="简单">简单</a-select-option>
              <a-select-option value="中等">中等</a-select-option>
              <a-select-option value="困难">困难</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

        <!-- 添加分类名称输入框 -->
        <a-col :span="12">
          <a-form-item
            label="分类名称"
            name="categoryName"
            :rules="[{ required: true, message: '请输入分类名称' }]"
          >
            <a-input v-model:value="formState.categoryName" placeholder="请输入分类名称" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-form-item
        label="题目内容"
        name="questionText"
        :rules="[{ required: true, message: '请输入题目内容' }]"
        style="justify-content: left"
      >
        <markdown-editor
          v-model:value="formState.questionText"
          :height="'200px'"
          style="width: 100%"
        />
      </a-form-item>

      <a-form-item
        label="答题提示"
        name="answerHint"
      >
        <a-textarea
          v-model:value="formState.answerHint"
          placeholder="请输入答题提示"
          :rows="3"
        />
      </a-form-item>

      <a-form-item
        label="参考答案"
        name="referenceAnswer"
      >
        <markdown-editor
          v-model:value="formState.referenceAnswer"
          :height="'200px'"
          style="width: 100%"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import MarkdownEditor from '@/components/MarkdownEditor.vue'
import { createQuestion } from '@/api/kn/question/question'
import { IdNameVO } from '@/domain/commonType'
import { QuestionForm } from './type'

const visible = ref(false)
const confirmLoading = ref(false)
const formRef = ref()

const formState = reactive<QuestionForm>({
  questionTitle: '',
  questionText: '',
  difficultyLevel: '中等',
  answerHint: '',
  referenceAnswer: '',
  categoryName: ''  // 添加分类名称字段
})

const templateOptions = ref<IdNameVO[]>([])

const labelCol = { span: 4 }
const wrapperCol = { span: 20 }

// 打开模态框
const openModal = async (templates: IdNameVO[]) => {
  visible.value = true
  templateOptions.value = templates
  resetForm()
}

// 重置表单
const resetForm = () => {
  formState.templateId = undefined
  formState.questionTitle = ''
  formState.questionText = ''
  formState.difficultyLevel = '中等'
  formState.answerHint = ''
  formState.referenceAnswer = ''
  formState.categoryName = ''  // 重置分类名称
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

    await createQuestion({
      templateId: formState.templateId,
      questionTitle: formState.questionTitle,
      questionText: formState.questionText,
      difficultyLevel: formState.difficultyLevel,
      answerHint: formState.answerHint,
      referenceAnswer: formState.referenceAnswer,
      categoryName: formState.categoryName
    })

    message.success('新增面试题成功')
    emit('fetchQuestionList')
    visible.value = false
  } catch (error) {
    console.error('新增面试题失败', error)
    message.error('新增面试题失败')
  } finally {
    confirmLoading.value = false
  }
}

const handleCancel = () => {
  visible.value = false
}

const emit = defineEmits(['fetchQuestionList'])

defineExpose({
  openModal
})
</script>

<style scoped>
.edit-question-modal {
  .ant-modal-body {
    padding: 24px;
  }

  .ant-modal-footer {
    padding: 24px;
  }
}

.edit-question-form {
  .form-item {
    margin-bottom: 24px;

    .ant-form-item-label {
      font-weight: 500;
      color: #333;
    }

    .ant-form-item-control {
      .ant-form-item-control-input {
        .ant-form-item-control-input-content {
          display: flex;
          align-items: center;
        }
      }
    }
  }

  .input-field {
    border-radius: 4px;
    border: 1px solid #d9d9d9;
    transition: all 0.2s ease;

    &:focus {
      border-color: #1890ff;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    }
  }

  .select-field {
    border-radius: 4px;
    border: 1px solid #d9d9d9;
    transition: all 0.2s ease;

    &:focus {
      border-color: #1890ff;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    }
  }

  .textarea-field {
    border-radius: 4px;
    border: 1px solid #d9d9d9;
    transition: all 0.2s ease;

    &:focus {
      border-color: #1890ff;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    }
  }

  .markdown-editor {
    border-radius: 4px;
    border: 1px solid #d9d9d9;
    transition: all 0.2s ease;

    &:focus {
      border-color: #1890ff;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    }
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .edit-question-modal {
    width: 95%;
  }

  .edit-question-form {
    .form-item {
      margin-bottom: 16px;
    }
  }
}
</style>
