<!-- src/views/console/exam/components/EssayQuestionCreate.vue -->
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
    </a-form-item>

    <a-form-item
      label="难度等级"
      name="difficulty"
      :rules="[{ required: true, message: '请选择难度等级' }]"
    >
      <a-select v-model:value="formState.difficulty"
                placeholder="请选择难度等级">
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
      label="字数限制"
    >
      <a-input-group compact>
        <a-input
          v-model:value="formState.wordLimitMin"
          placeholder="最小字数"
          style="width: 40%"
        />
        <a-input
          style="width: 20%; border-left: 0; pointer-events: none; text-align: center"
          placeholder="~"
          disabled
        />
        <a-input
          v-model:value="formState.wordLimitMax"
          placeholder="最大字数"
          style="width: 40%; border-left: 0"
        />
      </a-input-group>
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
    </a-form-item>

    <a-form-item
      label="评分标准"
      name="scoringCriteria"
    >
      <a-textarea
        v-model:value="formState.scoringCriteria"
        placeholder="请输入评分标准"
        :auto-size="{ minRows: 4, maxRows: 8 }"
      />
    </a-form-item>

    <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="handleSubmit" :loading="confirmLoading">
        提交
      </a-button>
      <a-button style="margin-left: 10px" @click="handleCancel">取消</a-button>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { message } from 'ant-design-vue';
import { createEssayQuestion } from '@/api/exam/exam.ts';

const emit = defineEmits<{
  (e: 'submit'): void;
  (e: 'cancel'): void;
}>();

const formRef = ref();

const formState = reactive({
  title: '',
  difficulty: undefined as number | undefined,
  score: undefined as number | undefined,
  type: 'ESSAY',
  requirement: '',
  wordLimitMin: undefined as number | undefined,
  wordLimitMax: undefined as number | undefined,
  referenceAnswer: '',
  scoringCriteria: ''
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
    await createEssayQuestion({
      question: {
        title: formState.title,
        difficulty: formState.difficulty,
        score: formState.score,
        type: 'ESSAY'
      },
      essayDetail: {
        requirement: formState.requirement,
        wordLimitMin: formState.wordLimitMin,
        wordLimitMax: formState.wordLimitMax,
        referenceAnswer: formState.referenceAnswer,
        scoringCriteria: formState.scoringCriteria
      }
    });

    emit('submit');
  } catch (error: any) {
    if (error?.errorFields) {
      // 表单验证失败
      console.log('表单验证失败');
    } else {
      console.error('创建论文题失败', error);
      message.error('创建论文题失败');
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
