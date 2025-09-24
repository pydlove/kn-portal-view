<template>
  <a-modal
    v-model:open="modalVisible"
    :title="modalTitle"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirm-loading="confirmLoading"
    width="90%"
    :maskClosable="false"
    :keyboard="false"
    class="edit-question-modal"
  >
    <a-form
      :model="questionForm"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      ref="formRef"
      class="edit-question-form"
    >
      <!-- 题目标题和难度等级 -->
      <a-row :gutter="24" style="margin-bottom: 24px;">
        <a-col :span="12">
          <a-form-item
            label="题目标题"
            name="questionTitle"
            :rules="[{ required: true, message: '请输入题目标题' }]"
            class="form-item"
          >
            <a-input
              v-model:value="questionForm.questionTitle"
              placeholder="请输入题目标题"
              class="input-field"
              style="width: 100%; padding: 8px 12px;"
            />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item
            label="难度等级"
            name="difficultyLevel"
            :rules="[{ required: true, message: '请选择难度等级' }]"
            class="form-item"
          >
            <a-select
              v-model:value="questionForm.difficultyLevel"
              placeholder="请选择难度等级"
              style="width: 100%; padding: 8px 12px;"
              class="select-field"
            >
              <a-select-option value="简单">简单</a-select-option>
              <a-select-option value="中等">中等</a-select-option>
              <a-select-option value="困难">困难</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <!-- 分类名称 -->
      <a-row :gutter="24" style="margin-bottom: 24px;">
        <a-col :span="12">
          <a-form-item
            label="分类名称"
            name="categoryName"
            :rules="[{ required: true, message: '请输入分类名称' }]"
            class="form-item"
          >
            <a-input
              v-model:value="questionForm.categoryName"
              placeholder="请输入分类名称"
              class="input-field"
              style="width: 100%; padding: 8px 12px;"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <!-- 题目内容 -->
      <a-row :gutter="24" style="margin-bottom: 24px;">
        <a-col :span="24">
          <a-form-item
            label="题目内容"
            name="questionText"
            :rules="[{ required: true, message: '请输入题目内容' }]"
            class="form-item"
          >
            <markdown-editor
              v-model:value="questionForm.questionText"
              :height="'250px'"
              style="width: 100%; border: 1px solid #d9d9d9; border-radius: 4px; overflow: auto;"
              class="markdown-editor"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <!-- 答题提示 -->
      <a-row :gutter="24" style="margin-bottom: 24px;">
        <a-col :span="24">
          <a-form-item
            label="答题提示"
            name="answerHint"
            class="form-item"
          >
            <a-textarea
              v-model:value="questionForm.answerHint"
              placeholder="请输入答题提示"
              :rows="3"
              style="width: 100%; padding: 8px 12px; border: 1px solid #d9d9d9; border-radius: 4px; height: 100px;"
              class="textarea-field"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <!-- 参考答案 -->
      <a-row :gutter="24">
        <a-col :span="24">
          <a-form-item
            label="参考答案"
            name="referenceAnswer"
            class="form-item"
          >
            <markdown-editor
              v-model:value="questionForm.referenceAnswer"
              :height="'250px'"
              style="width: 100%; border: 1px solid #d9d9d9; border-radius: 4px; overflow: auto;"
              class="markdown-editor"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import MarkdownEditor from '@/components/MarkdownEditor.vue'
import { updateQuestion } from '@/api/question/question'
import { QuestionVO, QuestionForm } from './type'
import { IdNameVO } from "@/domain/commonType";

// 模态框可见性
const modalVisible = ref(false)
const confirmLoading = ref(false)
const formRef = ref()

// 模态框标题
const modalTitle = ref('编辑面试题')

// 表单数据
const questionForm = reactive<QuestionForm>({
  id: undefined,
  templateId: undefined,
  questionTitle: '',
  questionText: '',
  difficultyLevel: '中等',
  answerHint: '',
  referenceAnswer: '',
  categoryName: ''
})

// 模板选项
const templateOptions = ref<IdNameVO[]>([])

// 表单布局
const labelCol = { span: 4 }
const wrapperCol = { span: 20 }

// 打开编辑模态框
const openModal = async (question: QuestionVO, templates: IdNameVO[]) => {
  modalVisible.value = true
  modalTitle.value = '编辑面试题'

  templateOptions.value = templates

  // 填充表单数据
  questionForm.id = question.id
  questionForm.templateId = question.templateId
  questionForm.questionTitle = question.questionTitle
  questionForm.questionText = question.questionText
  questionForm.difficultyLevel = question.difficultyLevel
  questionForm.answerHint = question.answerHint
  questionForm.referenceAnswer = question.referenceAnswer
  questionForm.categoryName = question.categoryName
}

// 提交表单
const handleSubmit = async () => {
  confirmLoading.value = true
  try {
    // 表单验证
    await formRef.value.validate()

    // 更新面试题
    if (questionForm.id) {
      await updateQuestion(questionForm.id, {
        templateId: questionForm.templateId,
        questionTitle: questionForm.questionTitle,
        questionText: questionForm.questionText,
        difficultyLevel: questionForm.difficultyLevel,
        answerHint: questionForm.answerHint,
        referenceAnswer: questionForm.referenceAnswer,
        categoryName: questionForm.categoryName
      })

      message.success('更新面试题成功')
      emit('fetchQuestionList')
      modalVisible.value = false
    }
  } catch (error: any) {
    console.error('更新面试题失败', error)
    if (error?.errorFields) {
      console.log('表单验证失败')
    } else {
      message.error('更新面试题失败')
    }
  } finally {
    confirmLoading.value = false
  }
}

// 处理取消
const handleCancel = () => {
  modalVisible.value = false
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
