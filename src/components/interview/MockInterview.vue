<!-- src/components/interview/MockInterview.vue -->
<template>
  <div class="mock-interview-modal">
    <a-modal
      v-model:open="visible"
      :title="showCompletion ? '面试完成' : (currentQuestion ? '模拟面试' : '选择面试等级')"
      :footer="null"
      :width="showCompletion ? '500px' : (currentQuestion ? '80%' : '400px')"
      :z-index="showCompletion ? 3000 : undefined"
      @cancel="handleClose"
      :maskClosable="false"
      :keyboard="false"
    >
      <!-- 选择等级界面 -->
      <div v-if="!currentQuestion && !showCompletion" class="level-selection">
        <h3>请选择面试等级</h3>
        <a-spin :spinning="loading">
          <div class="level-buttons">
            <a-button
              v-for="level in levels"
              :key="level.value"
              @click="startInterview(level.value)"
              class="level-button"
              :type="level.value === selectedLevel ? 'primary' : 'default'"
              size="large"
            >
              {{ level.label }}
            </a-button>
          </div>
          <a-button
            type="primary"
            @click="confirmStart"
            :disabled="!selectedLevel"
            class="start-button"
            size="large"
            :loading="loading"
          >
            {{ loading ? '加载中...' : '我已经准备好，开始面试' }}
          </a-button>
        </a-spin>
      </div>

      <!-- 面试界面 -->
      <div v-else-if="currentQuestion && !showCompletion" class="interview-container">
        <div class="question-progress">
          <span>问题 {{ currentQuestionIndex + 1 }} / {{ questions.length }}</span>
          <a-progress :percent="((currentQuestionIndex + 1) / questions.length * 100).toFixed(1)"/>
        </div>

        <div class="question-content">
          <div class="question-header">
            <h3>{{ currentQuestion.title }}</h3>
            <a-tag :color="getDifficultyColor(currentQuestion.difficultyLevel)" class="difficulty-tag">
              {{ currentQuestion.difficultyLevel }}
            </a-tag>
          </div>
          <div class="question-text ms-md-content"
               v-html="renderMarkdown(currentQuestion.content)"></div>
        </div>

        <div class="question-actions">
          <div class="action-buttons">
            <a-button @click="showHint" v-if="!showHintContent">
              <template #icon>
                <QuestionCircleOutlined/>
              </template>
              问题提示
            </a-button>
            <a-button @click="showAnswer" v-if="!showAnswerContent">
              <template #icon>
                <EyeOutlined/>
              </template>
              查看参考答案
            </a-button>
          </div>

          <div v-if="showHintContent" class="hint-content">
            <h4>提示：</h4>
            <div class="ms-md-content"
                 v-html="renderMarkdown(currentQuestion.hint)"></div>
          </div>

          <div v-if="showAnswerContent" class="answer-content">
            <h4>参考答案：</h4>
            <div class="ms-md-content"
                 v-html="renderMarkdown(currentQuestion.answer)"></div>
          </div>
        </div>

        <div class="navigation-buttons">
          <a-button @click="prevQuestion" :disabled="currentQuestionIndex === 0">
            <template #icon>
              <LeftOutlined/>
            </template>
            上一题
          </a-button>
          <a-button
            v-if="currentQuestionIndex < questions.length - 1"
            @click="nextQuestion"
            type="primary"
          >
            下一题
            <template #icon>
              <RightOutlined/>
            </template>
          </a-button>
          <a-button
            v-else
            @click="finishInterview"
            type="primary"
          >
            完成面试
            <template #icon>
              <CheckOutlined/>
            </template>
          </a-button>
        </div>
      </div>

      <!-- 完成面试界面（在 Modal 内部） -->
      <div v-else-if="showCompletion" class="completion-modal-content">
        <div style="position: relative; text-align: center; padding: 40px 20px;">
          <ConfettiComponent/>
          <h2>🎉 恭喜你走完这次模拟面试之旅 ✨</h2>
          <p>你的认真准备值得肯定，相信好机会一定会与优秀的你相遇</p>
          <div class="completion-actions">
            <a-button @click="reviewInterview" type="default" size="large">
              <template #icon>
                <EyeOutlined/>
              </template>
              回顾面试
            </a-button>
            <a-button @click="resetInterview" type="primary" size="large">
              重新开始
            </a-button>
          </div>
        </div>
      </div>
    </a-modal>

    <!-- 回顾面试界面 -->
    <a-modal
      v-model:open="showReview"
      title="面试回顾"
      :width="'80%'"
      @cancel="closeReview"
    >
      <div v-if="showReview" class="review-container">
        <div class="review-navigation">
          <a-button @click="prevReviewQuestion" :disabled="reviewQuestionIndex === 0">
            <template #icon>
              <LeftOutlined/>
            </template>
            上一题
          </a-button>
          <span class="question-counter">
            问题 {{ reviewQuestionIndex + 1 }} / {{ questions.length }}
          </span>
          <a-button @click="nextReviewQuestion"
                    :disabled="reviewQuestionIndex === questions.length - 1">
            下一题
            <template #icon>
              <RightOutlined/>
            </template>
          </a-button>
        </div>

        <div class="review-content" v-if="questions.length > 0">
          <div class="question-content">
            <div class="question-header">
              <h3>{{ reviewQuestion.title }}</h3>
              <a-tag :color="getDifficultyColor(reviewQuestion.difficultyLevel)" class="difficulty-tag">
                {{ reviewQuestion.difficultyLevel }}
              </a-tag>
            </div>
            <div class="question-text ms-md-content"
                 v-html="renderMarkdown(reviewQuestion.content)"></div>
          </div>

          <a-collapse v-model:activeKey="reviewActiveKeys">
            <a-collapse-panel key="hint" header="问题提示">
              <div class="ms-md-content"
                   v-html="renderMarkdown(reviewQuestion.hint)"></div>
            </a-collapse-panel>
            <a-collapse-panel key="answer" header="参考答案">
              <div class="ms-md-content"
                   v-html="renderMarkdown(reviewQuestion.answer)"></div>
            </a-collapse-panel>
          </a-collapse>
        </div>
      </div>

      <template #footer>
        <a-button @click="closeReview">关闭</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script setup>
import {ref, computed, nextTick, watch} from 'vue';
import {
  QuestionCircleOutlined,
  EyeOutlined,
  LeftOutlined,
  RightOutlined,
  CheckOutlined
} from '@ant-design/icons-vue';
import ConfettiComponent from '../interview/ConfettiComponent.vue';
import { getInterviewQuestions } from '../../api/interview/interview.ts';
// 导入 marked
import { marked } from 'marked';

const visible = defineModel('visible', { type: Boolean, default: false });

import Prism from 'prismjs';
import 'prismjs/themes/prism.css'; // 或其他主题
import 'prismjs/themes/prism-tomorrow.css'
// 引入需要的语言支持
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-xml-doc'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-properties'

// 修改 highlightCode 函数
const highlightCode = () => {
  nextTick(() => {
    // 使用 setTimeout 确保 DOM 已更新
    setTimeout(() => {
      try {
        Prism.highlightAll();
      } catch (error) {
        console.error('Prism 高亮错误:', error);
      }
    }, 0);
  });
};

// 在组件更新时也触发高亮
watch(visible, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      highlightCode();
    }, 100);
  }
});

const renderer = new marked.Renderer();

// 修改 renderer.code 函数
renderer.code = function(code, language) {
  const lang = language || 'text';
  return `<pre class="language-${code.lang}"><code class="language-${code.lang}">${code.text}</code></pre>`;
};

marked.setOptions({
  breaks: true,
  gfm: true,
  renderer: renderer
});

// 修改 renderMarkdown 函数
const renderMarkdown = (content) => {
  if (!content) return '';
  const rendered = marked.parse(content);
  nextTick(() => {
    // 使用 setTimeout 确保 DOM 已更新
    setTimeout(() => {
      Prism.highlightAll();
    }, 0);
  });
  return rendered;
};

const levels = [
  { value: 4, label: '应届生' },
  { value: 1, label: '初级（适合3年以内）' },
  { value: 2, label: '中级（适合3~5年）' },
  { value: 3, label: '高级（适合5年以上）' }
];

const selectedLevel = ref('');
const questions = ref([]);
const currentQuestionIndex = ref(0);
const showHintContent = ref(false);
const showAnswerContent = ref(false);
const showCompletion = ref(false);
const showReview = ref(false);
const reviewQuestionIndex = ref(0);
const reviewActiveKeys = ref([]);
const loading = ref(false);

const currentQuestion = computed(() => {
  return questions.value[currentQuestionIndex.value];
});

const reviewQuestion = computed(() => {
  return questions.value[reviewQuestionIndex.value];
});

// 获取难度等级颜色
const getDifficultyColor = (level) => {
  switch (level) {
    case '简单':
      return 'green';
    case '中等':
      return 'orange';
    case '困难':
      return 'red';
    default:
      return 'blue';
  }
};

const startInterview = (level) => {
  selectedLevel.value = level;
};

const confirmStart = async () => {
  if (!selectedLevel.value) return;

  try {
    loading.value = true;
    // 获取面试问题，适配后端返回的数据结构
    const response = await getInterviewQuestions({ level: selectedLevel.value });

    console.log('response', response)
    questions.value = response.map((item, index) => ({
      id: item.id || index,
      title: item.title || item.questionTitle,
      content: item.content || item.questionText,
      hint: item.hint || item.answerHint,
      answer: item.answer || item.referenceAnswer,
      difficultyLevel: item.difficultyLevel || '中等' // 添加难度等级
    }));

    currentQuestionIndex.value = 0;
    showHintContent.value = false;
    showAnswerContent.value = false;
  } catch (error) {
    console.error('加载面试问题失败:', error);
    // 可以添加错误提示
  } finally {
    loading.value = false;
  }
};

const prevQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
    resetQuestionState();
  }
};

// 在 nextQuestion、prevQuestion、showHint、showAnswer 等方法中添加
const nextQuestion = () => {
  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++;
    resetQuestionState();
    nextTick(() => {
      Prism.highlightAll();
    });
  }
};

const showHint = () => {
  showHintContent.value = true;
  nextTick(() => {
    Prism.highlightAll();
  });
};

const showAnswer = () => {
  showAnswerContent.value = true;
  nextTick(() => {
    Prism.highlightAll();
  });
};

const resetQuestionState = () => {
  showHintContent.value = false;
  showAnswerContent.value = false;
};

const finishInterview = () => {
  showCompletion.value = true;
};

const reviewInterview = () => {
  showCompletion.value = false;
  showReview.value = true;
  reviewQuestionIndex.value = 0;
  reviewActiveKeys.value = [];
};

const closeReview = () => {
  showReview.value = false;
  showCompletion.value = true;
};

const prevReviewQuestion = () => {
  if (reviewQuestionIndex.value > 0) {
    reviewQuestionIndex.value--;
    reviewActiveKeys.value = [];
  }
};

const nextReviewQuestion = () => {
  if (reviewQuestionIndex.value < questions.value.length - 1) {
    reviewQuestionIndex.value++;
    reviewActiveKeys.value = [];
  }
};

const resetInterview = () => {
  showCompletion.value = false;
  showReview.value = false;
  questions.value = [];
  currentQuestionIndex.value = 0;
  selectedLevel.value = '';
  reviewQuestionIndex.value = 0;
  reviewActiveKeys.value = [];
  resetQuestionState();
};

const handleClose = () => {
  visible.value = false;
  resetInterview();
};

</script>

<style scoped>
pre[class*="language-"] {
  background-color: #2d3748 !important;
  border: 1px solid #4a5568 !important;
  padding: 1em !important;
  border-radius: 0.5em !important;
  overflow: auto !important;
}

pre[class*="language-"] code[class*="language-"] {
  color: #d4d4d4 !important;
  font-family: 'JetBrains Mono', 'Fira Code', Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace !important;
  text-shadow: none !important;
  direction: ltr !important;
  text-align: left !important;
  white-space: pre !important;
  word-spacing: normal !important;
  word-break: normal !important;
  line-height: 1.5 !important;
  tab-size: 4 !important;
  hyphens: none !important;
}

/* 确保 Prism.js 样式优先级 */
pre[class*="language-"] {
  background-color: #2d3748 !important;
  border: 1px solid #4a5568 !important;
}

pre[class*="language-"] code[class*="language-"] {
  color: #d4d4d4 !important;
}


.level-selection {
  text-align: center;
  padding: 20px;
}

.level-buttons {
  margin: 30px 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.level-button {
  height: 50px;
  font-size: 16px;
}

.start-button {
  width: 100%;
  height: 50px;
  font-size: 16px;
}

.interview-container {
  padding: 20px;
}

.question-progress {
  margin-bottom: 20px;
}

.question-progress span {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
}

.question-content {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.question-content h3 {
  margin-top: 0;
  color: #1890ff;
  margin-bottom: 0;
}

.difficulty-tag {
  font-size: 14px;
  font-weight: bold;
}

.question-text {
  font-size: 16px;
  line-height: 1.6;
}

.question-actions {
  margin-bottom: 30px;
}

.action-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.action-buttons button {
  margin-bottom: 10px;
}

.hint-content, .answer-content {
  margin-top: 15px;
  padding: 15px;
  background-color: #e6f7ff;
  border-radius: 4px;
  border-left: 4px solid #1890ff;
}

.hint-content h4, .answer-content h4 {
  margin-top: 0;
  color: #1890ff;
}

.answer-content div {
  white-space: pre-wrap;
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
}

.completion-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

.review-container {
  padding: 20px;
}

.review-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.question-counter {
  font-weight: bold;
  font-size: 16px;
}

.review-content .question-content {
  margin-bottom: 20px;
}

/* Markdown 内容样式 */
.ms-md-content {
  line-height: 24px;
}

.ms-md-content :deep(h1),
.ms-md-content :deep(h2),
.ms-md-content :deep(h3),
.ms-md-content :deep(h4),
.ms-md-content :deep(h5),
.ms-md-content :deep(h6) {
  margin: 16px 0 8px 0;
  color: #1890ff;
}

.ms-md-content :deep(p) {
  margin: 8px 0;
}

.ms-md-content :deep(ul),
.ms-md-content :deep(ol) {
  padding-left: 20px;
  margin: 8px 0;
}

.ms-md-content :deep(li) {
  margin: 4px 0;
}

.ms-md-content :deep(code) {
  padding: 2px 4px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
}

.ms-md-content :deep(pre) {
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
}

.ms-md-content :deep(pre code) {
  background-color: transparent;
  padding: 0;
}

.ms-md-content :deep(blockquote) {
  border-left: 4px solid #1890ff;
  padding: 8px 16px;
  margin: 8px 0;
  background-color: #e6f7ff;
}

.ms-md-content :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 16px 0;
}

.ms-md-content :deep(th),
.ms-md-content :deep(td) {
  border: 1px solid #d9d9d9;
  padding: 8px 12px;
  text-align: left;
}

.ms-md-content :deep(th) {
  background-color: #f5f5f5;
  font-weight: bold;
}

.ms-md-content :deep(tr:nth-child(even)) {
  background-color: #fafafa;
}

.ms-md-content p {
  color: #262626;
}

/* 优化文章内容样式 */
.ms-md-content {
  font-size: 17px;
  padding: 10px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

/* 优化标题样式 */
.ms-md-content h1,
.ms-md-content h2,
.ms-md-content h3,
.ms-md-content h4,
.ms-md-content h5,
.ms-md-content h6 {
  margin-top: 10px;
  margin-bottom: 10px;
  font-weight: 600;
  line-height: 32px;
  scroll-margin-top: 80px;
  padding-left: 8px;
  color: #ffffff; /* 暗色模式下的标题颜色 */
  letter-spacing: 1pt;
}

.fullstack-page.light-theme .ms-md-content h1,
.fullstack-page.light-theme .ms-md-content h2,
.fullstack-page.light-theme .ms-md-content h3,
.fullstack-page.light-theme .ms-md-content h4,
.fullstack-page.light-theme .ms-md-content h5,
.fullstack-page.light-theme .ms-md-content h6 {
  color: #2d3748; /* 亮色模式下的标题颜色 */
}

.ms-md-content h1 {
  font-size: 22px;
  padding-bottom: 10px;
}

.ms-md-content h2 {
  font-size: 20px;
  padding-bottom: 8px;
}

.ms-md-content h3 {
  font-size: 20px;
}

.ms-md-content h4 {
  font-size: 18px;
}

.ms-md-content h5 {
  font-size: 18px;
}

.ms-md-content h6 {
  font-size: 18px;
  color: #b3b3b3; /* 暗色模式下的小标题颜色 */
}

.fullstack-page.light-theme .ms-md-content h6 {
  color: #9aa5b1; /* 亮色模式下的小标题颜色 */
}

/* 优化段落样式 */
.ms-md-content p {
  margin-top: 0;
  margin-bottom: 10px;
  line-height: 32px;
  color: #e0e0e0; /* 暗色模式下的段落颜色 */
  font-size: 16px;
}

.fullstack-page.light-theme .ms-md-content p {
  color: #333; /* 亮色模式下的小标题颜色 */
}

.fullstack-page.light-theme .mermaid p {
  color: #ffffff; /* 亮色模式下的小标题颜色 */
}

/* 优化列表样式 */
.ms-md-content ul,
.ms-md-content ol {
  padding-left: 36px;
  margin-top: 18px;
  margin-bottom: 22px;
}

.ms-md-content li {
  margin-bottom: 10px;
}

.ms-md-content li p {
  margin-bottom: 8px;
}

.fullstack-page.light-theme .ms-md-content li {
  color: #333; /* 亮色模式下的段落颜色 */
}

.fullstack-page .ms-md-content li {
  color: #e0e0e0; /* 暗色模式下的段落颜色 */
}

.fullstack-page.light-theme .ms-md-content hr {
  border: 4px solid #bfbfbf;
}

.fullstack-page .ms-md-content hr {
  border: 4px solid rgba(255, 255, 255, 0.1);
}

/* Markdown 表格样式 */
.ms-md-content table {
  width: 100%;
  border-collapse: collapse;
  margin: 24px 0;
  font-size: 16px;
  line-height: 1.5;
  background-color: #2d3748;
  border-radius: 8px;
  overflow: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  table-layout: auto;
  //display: block;
}

.fullstack-page .ms-md-content table {
  background-color: #2d3748;
}

.ms-md-content th,
.ms-md-content td {
  padding: 14px 16px;
  text-align: left;
  border-bottom: 1px solid #4a5568;
}

.fullstack-page .ms-md-content th,
.fullstack-page .ms-md-content td {
  border-bottom: 1px solid #4a5568;
}

.ms-md-content th {
  background-color: #4a5568;
  font-weight: 600;
  color: #e2e8f0;
}

.fullstack-page .ms-md-content th {
  background-color: #4a5568;
  color: #e2e8f0;
}

.ms-md-content tr:last-child td {
  border-bottom: none;
}

.ms-md-content tr:hover {
  background-color: #4a5568;
}

.fullstack-page .ms-md-content tr:hover {
  background-color: #4a5568;
}

/* IDEA风格代码块样式 - 使用 Prism.js 的主题 */
.ms-md-content pre[class*="language-"] {
  padding: 24px;
  overflow: auto;
  font-size: 15px;
  line-height: 1.5;
  border-radius: 6px;
  margin: 26px 0;
  position: relative;
  background-color: #2d3748;
  border: 1px solid #4a5568;
}

.fullstack-page .ms-md-content pre[class*="language-"] {
  background-color: #2d3748;
  border: 1px solid #4a5568;
}

.ms-md-content code[class*="language-"] {
  font-family: 'JetBrains Mono', 'Fira Code', Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace !important;
  text-shadow: none;
}

.ms-md-content code:not([class*="language-"]) {
  padding: 0.25em 0.5em;
  font-size: 0.95em;
  background-color: rgba(99, 110, 123, 0.4);
  border-radius: 6px;
  font-family: 'JetBrains Mono', 'Fira Code', Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace !important;
}

.fullstack-page .ms-md-content code:not([class*="language-"]) {
  background-color: rgba(99, 110, 123, 0.4);
}

/* 优化引用样式 */
.ms-md-content blockquote {
  margin: 10px 0;
  padding: 10px;
  border-left: 5px solid #4a90e2;
  background-color: rgba(99, 110, 123, 0.2);
  border-radius: 4px;
  color: #9aa5b1;
  font-style: italic;
}

.fullstack-page .ms-md-content blockquote {
  background-color: rgba(99, 110, 123, 0.2);
  color: #9aa5b1;
}

.fullstack-page.light-theme blockquote p {
  color: #333 !important;
}

.fullstack-page.light-theme strong {
  color: #333 !important;
}

/* 链接样式 */
.ms-md-content a {
  color: #4a90e2;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: all 0.3s ease;
}

.ms-md-content a:hover {
  color: #40a9ff;
  border-bottom: 1px solid #40a9ff;
}

.fullstack-page .ms-md-content a {
  color: #539bf5;
}

.fullstack-page .ms-md-content a:hover {
  color: #6cb6ff;
  border-bottom: 1px solid #6cb6ff;
}

/* 图片样式 */
.ms-md-content img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
}

/* IDEA 风格的 Mermaid 图表样式 */
.ms-md-content .mermaid {
  display: block;
  text-align: center;
  margin: 30px 0;
  overflow: visible;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  background-color: #2d3748;
  padding: 20px;
  border: 1px solid #3a3a3a;
}

.ms-md-content .mermaid svg {
  max-width: 100%;
  height: auto;
  display: inline-block;
  vertical-align: top;
  background-color: #2d3748;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 流程图节点样式 - IDEA 风格 */
.ms-md-content .mermaid .node {
  border-radius: 6px;
  border: 1px solid #5c5c5c;
  background-color: #2d2d2d;
  color: #d4d4d4;
  font-size: 14px;
  line-height: 1.5;
  padding: 12px 16px;
  transition: all 0.2s ease;
  fill: #d4d4d4;
}

.fullstack-page.light-theme  .ms-md-content .mermaid .node {
  color: #ffffff;
}

.ms-md-content .mermaid .node:hover {
  background-color: #3a3a3a;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 决策节点（菱形）样式 - IDEA 风格 */
.ms-md-content .mermaid .diamond {
  border-radius: 0;
  background-color: #3a3a3a;
  border: 1px solid #7c7c7c;
  color: #a0a0a0;
  font-weight: 500;
  fill: #a0a0a0;
}

/* 连接线样式 - IDEA 风格 */
.ms-md-content .mermaid .edge {
  stroke: #7c7c7c;
  stroke-width: 2px;
  marker-end: url(#arrowhead);
}

/* 箭头样式 - IDEA 风格 */
.ms-md-content .mermaid .arrowhead {
  fill: #7c7c7c;
}

/* 文本样式 - IDEA 风格 */
.ms-md-content .mermaid text {
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 14px;
  fill: #d4d4d4;
  word-wrap: break-word;
}

/* 定义箭头标记 - IDEA 风格 */
.ms-md-content .mermaid svg defs {
  position: absolute;
  left: -10000px;
}

.ms-md-content .mermaid svg defs marker {
  markerWidth: 10;
  markerHeight: 10;
  refX: 5;
  refY: 5;
}

.ms-md-content .mermaid svg defs marker path {
  fill: #7c7c7c;
  d: "M0,0 L10,5 L0,10 Z";
}

/* IDEA风格代码块样式 - 使用 Prism.js 的主题 */
.ms-md-content pre[class*="language-"] {
  padding: 24px;
  overflow: auto;
  font-size: 15px;
  line-height: 1.5;
  border-radius: 6px;
  margin: 26px 0;
  position: relative;
  background-color: #2d3748;
  border: 1px solid #4a5568;
}

.ms-md-content code[class*="language-"] {
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
  text-shadow: none;
}
</style>
