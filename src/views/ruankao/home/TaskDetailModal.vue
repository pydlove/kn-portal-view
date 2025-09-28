<!-- src/views/ruankao/home/TaskDetailModal.vue -->
<template>
  <div v-if="visible" class="task-modal" @click="closeModal">
    <div class="modal-overlay"></div>
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <div class="header-content">
          <h2>{{ task?.planTitle }}</h2>
          <div class="progress-bar" v-if="totalQuestions > 0">
            <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
          </div>
        </div>
        <span class="close-btn" @click="closeModal">&times;</span>
      </div>

      <div class="modal-body-wrapper">
        <div class="modal-body">
          <div v-if="detailLoading" class="loading">
            <div class="spinner"></div>
            <p>加载中...</p>
          </div>

          <div v-else-if="currentQuestion" class="question-detail">
            <!-- 问题类型标签 -->
            <div class="question-type-tag" :class="questionTypeClass">
              {{ questionTypeName }}
            </div>

            <!-- 选择题 -->
            <ChoiceQuestion
              v-if="currentQuestion.questionChoice"
              :question="currentQuestion"
              :selected-choice="selectedChoice"
              :show-answer="showAnswer"
              :render-markdown="renderMarkdown"
              @select-option="selectOption"
            />

            <!-- 案例题 -->
            <CaseQuestion
              v-else-if="currentQuestion.questionCase"
              :question="currentQuestion"
              :render-markdown="renderMarkdown"
              @toggle-answer="toggleCaseAnswer"
            />

            <!-- 论文题 -->
            <EssayQuestion
              v-else-if="currentQuestion.questionEssay"
              :question="currentQuestion"
              :render-markdown="renderMarkdown"
              @toggle-answer="toggleEssayAnswer"
            />

            <!-- 文章 -->
            <ArticleQuestion
              v-else-if="currentQuestion.questionArticle"
              :question="currentQuestion"
              :render-markdown="renderMarkdown"
            />
          </div>

          <div v-else-if="!detailLoading && totalQuestions === 0" class="no-questions">
            <div class="empty-icon">📝</div>
            <p>暂无任务内容</p>
          </div>
        </div>

        <!-- 操作按钮固定在底部 -->
        <div class="question-actions">
          <div class="pagination-info">
            {{ currentIndex + 1 }} / {{ totalQuestions }}
          </div>
          <div class="action-buttons">
            <button
              v-if="currentIndex > 0"
              class="btn prev-btn"
              @click="prevQuestion"
            >
              <i class="arrow-icon left"></i>
              上一题
            </button>
            <button
              v-if="isArticleType && currentIndex < totalQuestions - 1"
              class="btn next-btn"
              @click="nextQuestion"
            >
              下一篇
              <i class="arrow-icon right"></i>
            </button>
            <button
              v-else-if="isArticleType && currentIndex === totalQuestions - 1"
              class="btn next-btn"
              @click="finishArticle"
            >
              完成
            </button>
            <button
              v-else-if="currentQuestion?.type === 'CHOICE' && !isAnswerSubmitted(currentQuestion.id)"
              class="btn submit-btn"
              @click="submitAnswer"
              :disabled="!selectedChoice"
            >
              确定
            </button>
            <button
              v-else-if="currentQuestion?.type === 'CHOICE' && isAnswerSubmitted(currentQuestion.id)"
              class="btn next-btn"
              @click="nextQuestion"
            >
              {{ currentIndex === totalQuestions - 1 ? '提交' : '下一题' }}
              <i class="arrow-icon right" v-if="currentIndex < totalQuestions - 1"></i>
            </button>
            <button
              v-else-if="currentQuestion?.type === 'CASE' || currentQuestion?.type === 'ESSAY'"
              class="btn next-btn"
              @click="nextQuestion"
            >
              {{ currentIndex === totalQuestions - 1 ? '提交' : '下一题' }}
              <i class="arrow-icon right"></i>
            </button>
            <button
              v-else
              class="btn next-btn"
              @click="nextQuestion"
            >
              {{ currentIndex === totalQuestions - 1 ? '提交' : '下一题' }}
              <i class="arrow-icon right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 选择题结果弹窗 -->
  <ResultModal
    v-if="showResult && isChoiceType"
    :score="score"
    :correct-count="correctCount"
    :total-questions="totalQuestions"
    @close="handleResultClose"
  />

  <!-- 案例题和论文题练习完成弹窗 -->
  <PracticeResultModal
    v-if="showResult && !isChoiceType && !isArticleType"
    @close="handlePracticeResultClose"
  />
</template>

<script setup lang="ts">
import {ref, computed, watch} from 'vue'
import {
  finishTask,
  getCalendarDateQuestionDetail
} from '@/api/ruankao/calendar/calendarDate'
import { marked } from 'marked'
import ResultModal from './ResultModal.vue'
import PracticeResultModal from './PracticeResultModal.vue'
import ChoiceQuestion from './ChoiceQuestion.vue'
import CaseQuestion from './CaseQuestion.vue'
import EssayQuestion from './EssayQuestion.vue'
import ArticleQuestion from './ArticleQuestion.vue'

interface Task {
  id: number
  planTitle: string
  planDescription: string
}

interface QuestionChoice {
  id?: number
  questionId?: number
  choiceType?: number
  options?: string
  correctAnswers?: string
  analysis?: string
}

interface QuestionCase {
  id?: number
  title?: string
  background?: string
  requirement?: string
  referenceAnswer?: string
}

interface QuestionEssay {
  id?: number
  title?: string
  requirement?: string
  wordLimitMin?: number
  wordLimitMax?: number
  referenceAnswer?: string
  scoringCriteria?: string
}

interface QuestionArticle {
  id?: number
  title?: string
  content?: string
}

interface RkExamQuestionDetailPageVO {
  id?: number
  title?: string
  type?: string
  score?: number
  difficulty?: number
  questionEssay?: QuestionEssay
  questionChoice?: QuestionChoice
  questionCase?: QuestionCase
  questionArticle?: QuestionArticle
}

const props = defineProps<{
  visible: boolean
  task: Task | null
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const detailLoading = ref(false)
const questionList = ref<RkExamQuestionDetailPageVO[]>([])
const currentIndex = ref(0)
const selectedChoice = ref<string | null>(null)
const showAnswer = ref(false)
const showCaseAnswer = ref(false) // 控制案例题答案显示
const showEssayAnswer = ref(false) // 控制论文题答案显示
const totalQuestions = ref(0)
const showResult = ref(false)
const score = ref(0)
const correctCount = ref(0)
const userAnswers = ref<{ [key: number]: string }>({})
const submittedQuestions = ref<Set<number>>(new Set()) // 记录已提交答案的题目ID

// 预加载相关
const preloadCache = ref<{[pageNum: number]: RkExamQuestionDetailPageVO[]}>({})
const currentPreloadPage = ref(1)
const totalRecords = ref(0)

// 配置marked
marked.setOptions({
  breaks: true, // 转换段落中的换行符为<br>
  gfm: true, // 启用GitHub Flavored Markdown
})

// Markdown渲染函数
const renderMarkdown = (content: string | undefined) => {
  if (!content) return ''
  return marked.parse(content)
}

// 当前问题
const currentQuestion = computed(() => {
  return questionList.value[currentIndex.value] || null
})

// 进度百分比
const progressPercentage = computed(() => {
  if (totalQuestions.value === 0) return 0
  return ((currentIndex.value + 1) / totalQuestions.value) * 100
})

// 是否为文章类型
const isArticleType = computed(() => {
  return currentQuestion.value?.type === 'ARTICLE'
})

// 是否为选择题类型
const isChoiceType = computed(() => {
  return currentQuestion.value?.type === 'CHOICE'
})

// 问题类型名称
const questionTypeName = computed(() => {
  const typeMap: Record<string, string> = {
    'CHOICE': '选择题',
    'CASE': '案例题',
    'ESSAY': '论文题',
    'ARTICLE': '文章'
  }
  return typeMap[currentQuestion.value?.type || ''] || ''
})

// 问题类型样式类
const questionTypeClass = computed(() => {
  const classMap: Record<string, string> = {
    'CHOICE': 'choice-type',
    'CASE': 'case-type',
    'ESSAY': 'essay-type',
    'ARTICLE': 'article-type'
  }
  return classMap[currentQuestion.value?.type || ''] || ''
})

// 检查题目答案是否已提交
const isAnswerSubmitted = (questionId?: number) => {
  if (!questionId) return false
  return submittedQuestions.value.has(questionId) || showAnswer.value
}

// 是否为正确答案
const isCorrect = (optionKey: string) => {
  if (!currentQuestion.value?.questionChoice?.correctAnswers) return false
  return currentQuestion.value.questionChoice.correctAnswers.includes(optionKey)
}

// 选择选项
const selectOption = (key: string) => {
  if (currentQuestion.value?.type === 'CHOICE' && !isAnswerSubmitted(currentQuestion.value.id)) {
    selectedChoice.value = key
  }
}

// 切换案例题答案显示
const toggleCaseAnswer = () => {
  showCaseAnswer.value = !showCaseAnswer.value
}

// 切换论文题答案显示
const toggleEssayAnswer = () => {
  showEssayAnswer.value = !showEssayAnswer.value
}

const finish = async () => {

  // 获取完成的任务id，也就是calendar_id
  const calendarId = props.task?.id;
  console.log('calendarId', calendarId)

  await finishTask({calendarId: calendarId});
}

// 完成文章阅读
const finishArticle = () => {
  closeModal()
  finish()
}

// 提交答案
const submitAnswer = async () => {
  // 如果没有选择答案，不执行任何操作
  if (!selectedChoice.value) {
    return;
  }

  // 保存用户答案
  if (currentQuestion.value?.id && selectedChoice.value) {
    userAnswers.value[currentQuestion.value.id] = selectedChoice.value;
    submittedQuestions.value.add(currentQuestion.value.id); // 标记为已提交

    // 检查答案是否正确
    if (isCorrect(selectedChoice.value)) {
      correctCount.value++;
    }
  }

  // 显示答案反馈和解析
  showAnswer.value = true;
}

// 预加载下一批题目
const preloadNextBatch = async (pageNum: number) => {
  if (preloadCache.value[pageNum]) {
    return; // 已经预加载过
  }

  try {
    const response = await getCalendarDateQuestionDetail(props.task!.id, {
      pageNum: pageNum,
      pageSize: 5
    });

    preloadCache.value[pageNum] = response.records || [];
    totalRecords.value = response.total || 0;
  } catch (error) {
    console.error('预加载题目失败:', error);
  }
}

// 加载下一题
const loadNextQuestion = async () => {
  // 检查是否需要预加载下一批题目
  const nextIndex = currentIndex.value + 1;
  const nextPage = Math.floor(nextIndex / 5) + 1;

  // 如果是当前批次的最后一题，预加载下一批
  if ((nextIndex + 1) % 5 === 0) {
    preloadNextBatch(nextPage + 1);
  }

  // 如果下一道题已经在缓存中，直接使用
  if (nextIndex < questionList.value.length) {
    currentIndex.value++;
    selectedChoice.value = null;
    showAnswer.value = false;
    showCaseAnswer.value = false;
    showEssayAnswer.value = false;

    // 检查是否之前答过这题
    const nextQuestion = questionList.value[nextIndex];
    if (nextQuestion.id) {
      if (userAnswers.value[nextQuestion.id]) {
        selectedChoice.value = userAnswers.value[nextQuestion.id];
      }
      // 如果题目已提交，显示答案
      if (submittedQuestions.value.has(nextQuestion.id)) {
        showAnswer.value = true;
      }
    }
    return;
  }

  // 如果需要从服务器加载新题目
  const currentPage = Math.floor(nextIndex / 5) + 1;

  // 检查缓存中是否有该页数据
  if (preloadCache.value[currentPage]) {
    // 从缓存中获取数据
    const cachedQuestions = preloadCache.value[currentPage];
    const questionIndexInPage = nextIndex % 5;

    if (questionIndexInPage < cachedQuestions.length) {
      questionList.value.push(cachedQuestions[questionIndexInPage]);
      currentIndex.value++;
      selectedChoice.value = null;
      showAnswer.value = false;
      showCaseAnswer.value = false;
      showEssayAnswer.value = false;

      // 检查是否之前答过这题
      const nextQuestion = cachedQuestions[questionIndexInPage];
      if (nextQuestion.id) {
        if (userAnswers.value[nextQuestion.id]) {
          selectedChoice.value = userAnswers.value[nextQuestion.id];
        }
        // 如果题目已提交，显示答案
        if (submittedQuestions.value.has(nextQuestion.id)) {
          showAnswer.value = true;
        }
      }
      return;
    }
  }

  // 如果缓存中没有，从服务器加载
  try {
    detailLoading.value = true;
    const response = await getCalendarDateQuestionDetail(props.task!.id, {
      pageNum: currentPage,
      pageSize: 5
    });

    if (response.records && response.records.length > 0) {
      // 缓存这一页的数据
      preloadCache.value[currentPage] = response.records;
      totalRecords.value = response.total || 0;

      const questionIndexInPage = nextIndex % 5;
      if (questionIndexInPage < response.records.length) {
        questionList.value.push(response.records[questionIndexInPage]);
        currentIndex.value++;
        selectedChoice.value = null;
        showAnswer.value = false;
        showCaseAnswer.value = false;
        showEssayAnswer.value = false;

        // 检查是否之前答过这题
        const nextQuestion = response.records[questionIndexInPage];
        if (nextQuestion.id) {
          if (userAnswers.value[nextQuestion.id]) {
            selectedChoice.value = userAnswers.value[nextQuestion.id];
          }
          // 如果题目已提交，显示答案
          if (submittedQuestions.value.has(nextQuestion.id)) {
            showAnswer.value = true;
          }
        }
      }
    }
  } catch (error) {
    console.error('加载下一题失败:', error);
  } finally {
    detailLoading.value = false;
  }
}

// 获取任务详情
const fetchTaskDetail = async () => {
  if (!props.task) return

  try {
    detailLoading.value = true
    const response = await getCalendarDateQuestionDetail(props.task.id, {pageNum: 1, pageSize: 5})

    questionList.value = response.records || []
    totalQuestions.value = response.total || 0
    totalRecords.value = response.total || 0
    currentIndex.value = 0
    selectedChoice.value = null
    showAnswer.value = false
    showCaseAnswer.value = false
    showEssayAnswer.value = false
    showResult.value = false
    score.value = 0
    correctCount.value = 0
    userAnswers.value = {}
    submittedQuestions.value = new Set() // 重置已提交题目记录

    // 缓存第一页数据
    preloadCache.value[1] = response.records || [];

    // 预加载第二页数据
    if (response.total && response.total > 5) {
      preloadNextBatch(2);
    }

    // 检查第一题是否已答过
    if (questionList.value.length > 0 && questionList.value[0].id) {
      const firstQuestion = questionList.value[0];
      if (userAnswers.value[firstQuestion.id]) {
        selectedChoice.value = userAnswers.value[firstQuestion.id];
      }
      if (submittedQuestions.value.has(firstQuestion.id)) {
        showAnswer.value = true;
      }
    }
  } catch (error) {
    console.error('获取任务详情失败:', error)
  } finally {
    detailLoading.value = false
  }
}

// 上一题
const prevQuestion = async () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    selectedChoice.value = null
    showAnswer.value = false
    showCaseAnswer.value = false
    showEssayAnswer.value = false

    // 检查是否之前答过这题
    const currentQ = questionList.value[currentIndex.value];
    if (currentQ.id) {
      if (userAnswers.value[currentQ.id]) {
        selectedChoice.value = userAnswers.value[currentQ.id];
      }
      // 如果题目已提交，显示答案
      if (submittedQuestions.value.has(currentQ.id)) {
        showAnswer.value = true;
      }
    }
  }
}

// 下一题
const nextQuestion = async () => {
  // 如果是选择题且没有提交答案，则先保存当前答案再进入下一题
  if (currentQuestion.value?.type === 'CHOICE' && !isAnswerSubmitted(currentQuestion.value.id)) {
    // 保存用户答案（如果有的话）
    if (currentQuestion.value?.id && selectedChoice.value) {
      userAnswers.value[currentQuestion.value.id] = selectedChoice.value;
      submittedQuestions.value.add(currentQuestion.value.id); // 标记为已提交

      // 检查答案是否正确
      if (isCorrect(selectedChoice.value)) {
        correctCount.value++;
      }
    }
  }

  // 如果是最后一题，显示结果或提交
  if (currentIndex.value === totalQuestions.value - 1) {
    // 如果是选择题且还没提交答案，先提交答案
    if (currentQuestion.value?.type === 'CHOICE' && !isAnswerSubmitted(currentQuestion.value.id)) {
      if (selectedChoice.value) {
        submitAnswer();
      } else {
        // 没有选择答案，直接完成
        score.value = Math.round((correctCount.value / totalQuestions.value) * 100);
        showResult.value = true;

        finish();
      }

      return;
    }

    // 已经显示答案，计算得分并显示结果
    if (currentQuestion.value?.type === 'CHOICE') {
      score.value = Math.round((correctCount.value / totalQuestions.value) * 100);
    }

    showResult.value = true;
    finish();
    return;
  }

  // 如果是选择题且已经提交答案，或者不是选择题，直接加载下一题
  if ((currentQuestion.value?.type === 'CHOICE' && isAnswerSubmitted(currentQuestion.value.id)) || currentQuestion.value?.type !== 'CHOICE') {
    await loadNextQuestion();
  } else {
    // 如果是选择题但还没提交答案，先提交答案
    if (currentQuestion.value?.type === 'CHOICE' && selectedChoice.value) {
      submitAnswer();
    } else {
      // 没有选择答案，直接进入下一题
      await loadNextQuestion();
    }
  }
}

// 关闭弹框
const closeModal = () => {
  emit('close')
}

// 处理选择题结果弹窗关闭
const handleResultClose = () => {
  showResult.value = false
  emit('close')
}

// 处理案例题和论文题练习完成弹窗关闭
const handlePracticeResultClose = () => {
  showResult.value = false
  // 继续加载下一题
  loadNextQuestion()
}

// 监听任务变化
watch(() => props.task, (newTask) => {
  if (newTask) {
    fetchTaskDetail()
  } else {
    questionList.value = []
    currentIndex.value = 0
    selectedChoice.value = null
    showAnswer.value = false
    showCaseAnswer.value = false
    showEssayAnswer.value = false
    totalQuestions.value = 0
    showResult.value = false
    score.value = 0
    correctCount.value = 0
    userAnswers.value = {}
    submittedQuestions.value = new Set()
    preloadCache.value = {}
    currentPreloadPage.value = 1
    totalRecords.value = 0
  }
}, {immediate: true})
</script>

<style scoped>
.task-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  animation: slideIn 0.3s ease-out;
  position: relative;
  z-index: 1;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: linear-gradient(120deg, #f8f9ff, #f0f4ff);
}

.header-content {
  flex: 1;
}

.modal-header h2 {
  margin: 0 0 12px 0;
  color: #2c3e50;
  font-size: 22px;
  font-weight: 600;
}

.progress-bar {
  height: 6px;
  background-color: #e0e7ff;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.close-btn {
  font-size: 28px;
  cursor: pointer;
  color: #999;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
  margin-top: -5px;
}

.close-btn:hover {
  color: #333;
  background: #f5f5f5;
}

/* 新增的包装器，用于分离可滚动内容和固定按钮 */
.modal-body-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.modal-body {
  overflow-y: auto;
  padding: 24px;
  max-height: 600px;
}

.loading {
  text-align: center;
  padding: 60px 20px;
  color: #666;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(102, 126, 234, 0.2);
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.no-questions {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.question-detail {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.question-type-tag {
  align-self: flex-start;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 24px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.choice-type {
  background: #e3f2fd;
  color: #1976d2;
}

.case-type {
  background: #f3e5f5;
  color: #7b1fa2;
}

.essay-type {
  background: #e8f5e9;
  color: #388e3c;
}

.article-type {
  background: #fff3e0;
  color: #ef6c00;
}

.question-content {
  flex: 1;
  padding-bottom: 20px;
}

.question-title {
  margin: 0 0 20px 0;
  color: #2c3e50;
  line-height: 1.5;
  font-size: 18px;
  font-weight: 600;
}

/* 难度和得分显示样式 */
.question-info {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
}

.question-difficulty {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 12px;
}

.difficulty-label {
  font-weight: 500;
  color: #555;
  margin-right: 8px;
}

.difficulty-value {
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 12px;
  color: #fff;
}

.difficulty-value.easy {
  background: #4caf50;
}

.difficulty-value.medium {
  background: #ff9800;
}

.difficulty-value.hard {
  background: #f44336;
}

.question-score {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 12px;
}

.score-label {
  font-weight: 500;
  color: #555;
  margin-right: 8px;
}

.score-value {
  font-weight: 600;
  color: #667eea;
}

.question-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-top: 1px solid #edf2f7;
  background: white;
  flex-shrink: 0; /* 防止按钮区域被压缩 */
}

.pagination-info {
  color: #718096;
  font-size: 14px;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.btn {
  padding: 10px 20px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
}

.prev-btn {
  background: #f1f5f9;
  color: #4a5568;
}

.prev-btn:hover {
  background: #e2e8f0;
}

.next-btn, .submit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.next-btn:hover:not(:disabled), .submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.submit-btn:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.arrow-icon {
  display: inline-block;
  width: 0;
  height: 0;
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
}

.arrow-icon.left {
  border-right: 6px solid currentColor;
  margin-right: 4px;
}

.arrow-icon.right {
  border-left: 6px solid currentColor;
  margin-left: 4px;
}

@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    max-height: 95vh;
    border-radius: 12px;
  }

  .modal-header {
    padding: 16px 20px;
  }

  .modal-header h2 {
    font-size: 20px;
  }

  .modal-body {
    padding: 20px;
  }

  .question-actions {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
    padding: 20px;
  }

  .action-buttons {
    justify-content: space-between;
  }

  .btn {
    flex: 1;
    padding: 12px;
    justify-content: center;
  }

  .question-title {
    font-size: 16px;
  }

  .question-info {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
