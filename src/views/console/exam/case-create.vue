<!-- src/views/console/exam/case-create.vue -->
<template>
  <div class="case-create-container">
    <a-card title="创建案例题">
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
            v-model:value="formState.question.title"
            placeholder="请输入题目内容"
            :auto-size="{ minRows: 3, maxRows: 6 }"
          />
        </a-form-item>

        <a-form-item
          label="难度等级"
          name="difficulty"
          :rules="[{ required: true, message: '请选择难度等级' }]"
        >
          <a-select v-model:value="formState.question.difficulty" placeholder="请选择难度等级">
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
            v-model:value="formState.question.score"
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
            v-model:value="formState.caseDetail.background"
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
            v-model:value="formState.caseDetail.requirement"
            placeholder="请输入题目要求"
            :auto-size="{ minRows: 4, maxRows: 8 }"
          />
        </a-form-item>

        <a-form-item
          label="参考答案"
          name="referenceAnswer"
        >
          <a-textarea
            v-model:value="formState.caseDetail.referenceAnswer"
            placeholder="请输入参考答案"
            :auto-size="{ minRows: 4, maxRows: 8 }"
          />
        </a-form-item>

        <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" @click="handleSubmit" :loading="confirmLoading">提交</a-button>
          <a-button style="margin-left: 10px" @click="handleCancel">取消</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { createCaseQuestion } from  '../../../api/exam/exam.ts';

const router = useRouter();
const formRef = ref();

const formState = reactive({
  question: {
    title: '',
    difficulty: undefined as number | undefined,
    score: undefined as number | undefined,
    type: 'CASE'
  },
  caseDetail: {
    background: '',
    requirement: '',
    referenceAnswer: ''
  }
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
      question: formState.question,
      caseDetail: formState.caseDetail
    });

    message.success('创建案例题成功');
    router.push('/exam/question');
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
  router.push('/exam/question');
};
</script>

<style scoped>
.case-create-container {
  padding: 16px;
}
</style>
