<!-- src/views/console/exam/create.vue -->
<template>
  <div class="question-create-container">
    <a-card :title="`创建${questionTypeText}题`">
      <div v-if="questionType === 'choice'">
        <ChoiceQuestionCreate @submit="handleSubmit" @cancel="handleCancel" />
      </div>
      <div v-else-if="questionType === 'case'">
        <CaseQuestionCreate @submit="handleSubmit" @cancel="handleCancel" />
      </div>
      <div v-else-if="questionType === 'essay'">
        <EssayQuestionCreate @submit="handleSubmit" @cancel="handleCancel" />
      </div>
      <div v-else-if="questionType === 'article'">
        <ArticleQuestionCreate @submit="handleSubmit" @cancel="handleCancel" />
      </div>
      <div v-else>
        <a-empty description="请选择题目类型" />
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message } from 'ant-design-vue';

import ChoiceQuestionCreate from './ChoiceQuestionCreate.vue';
import CaseQuestionCreate from './CaseQuestionCreate.vue';
import EssayQuestionCreate from './EssayQuestionCreate.vue';
import ArticleQuestionCreate from './ArticleQuestionCreate.vue';

const route = useRoute();
const router = useRouter();

// 题目类型 - 从查询参数获取
const questionType = computed(() => route.query.type as string | undefined);

const questionTypeText = computed(() => {
  switch (questionType.value) {
    case 'choice':
      return '选择';
    case 'case':
      return '案例';
    case 'essay':
      return '论文';
    case 'article':
      return '文章';
    default:
      return '';
  }
});

// 处理提交成功
const handleSubmit = () => {
  message.success(`创建${questionTypeText.value}题成功`);
  router.push('/exam/question');
};

// 取消
const handleCancel = () => {
  router.push('/exam/question');
};
</script>

<style scoped>
.question-create-container {
  padding: 16px;
  overflow: auto;
  height: calc(100vh);
}
</style>
