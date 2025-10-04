<!-- src/views/console/exam/edit.vue -->
<template>
  <div class="question-edit-container">
    <a-card :title="`编辑${questionTypeText}题`">
      <div v-if="loading" class="loading-container">
        <a-spin size="large"/>
      </div>
      <div v-else>
        <!-- 选择题编辑 -->
        <ChoiceQuestionEdit
          v-if="questionType === 'CHOICE'"
          :question-id="questionId"
          @submit="handleSuccess"
          @cancel="handleCancel"
          ref="choiceQuestionRef"
        />

        <!-- 案例题编辑 -->
        <CaseQuestionEdit
          v-else-if="questionType === 'CASE'"
          :question-id="questionId"
          @submit="handleSuccess"
          @cancel="handleCancel"
          ref="caseQuestionRef"
        />

        <!-- 论文题编辑 -->
        <EssayQuestionEdit
          v-else-if="questionType === 'ESSAY'"
          :question-id="questionId"
          @submit="handleSuccess"
          @cancel="handleCancel"
          ref="essayQuestionRef"
        />

        <!-- 文章题编辑 -->
        <ArticleQuestionEdit
          v-else-if="questionType === 'ARTICLE'"
          :question-id="questionId"
          @submit="handleSuccess"
          @cancel="handleCancel"
          ref="articleQuestionRef"
        />
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message } from 'ant-design-vue';

import ChoiceQuestionEdit from './ChoiceQuestionEdit.vue';
import CaseQuestionEdit from './CaseQuestionEdit.vue';
import EssayQuestionEdit from './EssayQuestionEdit.vue';
import ArticleQuestionEdit from './ArticleQuestionEdit.vue';
import {getQuestion} from "@/api/ruankao/exam/exam";

const route = useRoute();
const router = useRouter();

// 组件引用
const choiceQuestionRef = ref();
const caseQuestionRef = ref();
const essayQuestionRef = ref();
const articleQuestionRef = ref();

// 加载状态
const loading = ref(true);

// 题目ID
const questionId = computed(() => route.params.id as string);

// 题目类型
const questionType = ref('');

const questionTypeText = computed(() => {
  switch (questionType.value) {
    case 'CHOICE':
      return '选择';
    case 'CASE':
      return '案例';
    case 'ESSAY':
      return '论文';
    case 'ARTICLE':
      return '文章';
    default:
      return '';
  }
});

// 获取题目详情
const fetchQuestionDetail = async () => {
  try {
    loading.value = true;
    // 获取题目基本信息
    const question = await getQuestion(Number(questionId.value));
    questionType.value = question.type;
  } catch (error) {
    console.error('获取题目详情失败', error);
    message.error('获取题目详情失败');
  } finally {
    loading.value = false;
  }
};

// 处理提交成功
const handleSuccess = () => {
  router.push('/exam/question');
};

// 取消
const handleCancel = () => {
  router.push('/exam/question');
};

onMounted(() => {
  fetchQuestionDetail();
});
</script>

<style scoped>
.question-edit-container {
  padding: 16px;
  overflow: auto;
  height: calc(100vh);
}

.loading-container {
  text-align: center;
  padding: 50px 0;
}
</style>
