<!-- src/views/console/exam/components/CaseQuestionCreate.vue -->
<template>
  <a-form
    :model="formState"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    ref="formRef"
  >
    <a-form-item
      label="题目内容"
      name="title"
      :rules="[{ required: true, message: '请输入题目内容' }]"
    >
      <a-textarea
        v-model:value="formState.title"
        placeholder="请输入题目内容"
        :auto-size="{ minRows: 3, maxRows: 6 }"
      />
      <div class="toolbar-buttons" style="margin-top: 5px;">
        <a-button size="small" @click="insertMarkdownTemplate('title', 'red', formState)">红色文字</a-button>
        <a-button size="small" @click="insertMarkdownTemplate('title', 'bold', formState)" style="margin-left: 8px">粗体</a-button>
        <a-button size="small" @click="insertMarkdownTemplate('title', 'code', formState)" style="margin-left: 8px">代码</a-button>
        <a-button size="small" @click="insertMarkdownTemplate('title', 'image', formState)" style="margin-left: 5px">图片</a-button>
        <a-button size="small" @click="insertMarkdownTemplate('title', 'hdck', formState)" style="margin-left: 5px">回答此空</a-button>
      </div>
    </a-form-item>

    <a-form-item
      label="题目分类"
      name="categoryName"
      :rules="[{ required: true, message: '请输入题目分类' }]"
    >
      <a-input v-model:value="formState.categoryName" placeholder="请输入题目分类" />
    </a-form-item>

    <a-form-item
      label="难度等级"
      name="difficulty"
      :rules="[{ required: true, message: '请选择难度等级' }]"
    >
      <a-select v-model:value="formState.difficulty" placeholder="请选择难度等级">
        <a-select-option :value="1">简单</a-select-option>
        <a-select-option :value="2">中等</a-select-option>
        <a-select-option :value="3">困难</a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item
      label="题目分数"
      name="score"
      :rules="[{ required: true, message: '请输入题目分数' }]"
    >
      <a-input-number
        v-model:value="formState.score"
        placeholder="请输入题目分数"
        :min="0"
        :step="0.5"
      />
    </a-form-item>

    <a-form-item
      label="案例背景"
      name="background"
      :rules="[{ required: true, message: '请输入案例背景' }]"
    >
      <a-textarea
        v-model:value="formState.background"
        placeholder="请输入案例背景"
        :auto-size="{ minRows: 4, maxRows: 8 }"
      />
    </a-form-item>

    <a-form-item
      label="题目要求"
      name="requirement"
      :rules="[{ required: true, message: '请输入题目要求' }]"
    >
      <a-textarea
        v-model:value="formState.requirement"
        placeholder="请输入题目要求"
        :auto-size="{ minRows: 4, maxRows: 8 }"
      />
    </a-form-item>

    <a-form-item
      label="参考答案"
      name="referenceAnswer"
    >
      <a-textarea
        v-model:value="formState.referenceAnswer"
        placeholder="请输入参考答案"
        :auto-size="{ minRows: 4, maxRows: 8 }"
      />
      <div class="toolbar-buttons" style="margin-top: 5px;">
        <a-button size="small" @click="insertMarkdownTemplate('referenceAnswer', 'red', formState)">红色文字</a-button>
        <a-button size="small" @click="insertMarkdownTemplate('referenceAnswer', 'bold', formState)" style="margin-left: 8px">粗体</a-button>
        <a-button size="small" @click="insertMarkdownTemplate('referenceAnswer', 'code', formState)" style="margin-left: 8px">代码</a-button>
        <a-button size="small" @click="insertMarkdownTemplate('referenceAnswer', 'image', formState)" style="margin-left: 5px">图片</a-button>
      </div>
    </a-form-item>

    <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="handleSubmit" :loading="confirmLoading">提交</a-button>
      <a-button style="margin-left: 10px" @click="handleCancel">取消</a-button>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { message } from 'ant-design-vue';
import { createCaseQuestion } from '@/api/ruankao/exam/exam.ts';
import {insertMarkdownTemplate} from "@/utils/markdownUtils";

const emit = defineEmits<{
  (e: 'submit'): void;
  (e: 'cancel'): void;
}>();

const formRef = ref();

const formState = reactive({
  title: '',
  difficulty: undefined as number | undefined,
  score: undefined as number | undefined,
  type: 'CASE',
  background: '',
  categoryName: '',
  requirement: '',
  referenceAnswer: ''
});

const confirmLoading = ref(false);
const labelCol = { span: 4 };
const wrapperCol = { span: 14 };

// 提交表单
const handleSubmit = async () => {
  confirmLoading.value = true;
  try {
    // 表单验证
    await formRef.value.validate();

    // 提交数据
    await createCaseQuestion({
      question: {
        title: formState.title,
        difficulty: formState.difficulty,
        score: formState.score,
        categoryName: formState.categoryName,
        type: 'CASE'
      },
      caseDetail: {
        background: formState.background,
        requirement: formState.requirement,
        referenceAnswer: formState.referenceAnswer
      }
    });

    emit('submit');
  } catch (error: any) {
    if (error?.errorFields) {
      // 表单验证失败
      console.log('表单验证失败');
    } else {
      console.error('创建案例题失败', error);
      message.error('创建案例题失败');
    }
  } finally {
    confirmLoading.value = false;
  }
};

// 取消
const handleCancel = () => {
  emit('cancel');
};
</script>
