<!-- src/views/ruankao/home/TaskDetailModal.vue -->
<template>
  <div v-if="visible" class="task-modal" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>{{ task?.planTitle }}</h2>
        <span class="close-btn" @click="closeModal">&times;</span>
      </div>

      <div class="modal-body">
        <div v-if="detailLoading" class="loading">
          加载中...
        </div>

        <div v-else-if="currentQuestion" class="question-detail">
          <!-- 问题类型标签 -->
          <div class="question-type-tag" :class="questionTypeClass">
            {{ questionTypeName }}
          </div>

          <!-- 选择题 -->
          <div v-if="currentQuestion.questionChoice" class="question-content">
            <h3>问题：{{ currentQuestion.title }}</h3>
            <div class="question-difficulty">
              难度：{{ getDifficultyText(currentQuestion.difficulty) }}
            </div>
            <div class="question-options">
              <div
                v-for="(option, index) in choiceOptions"
                :key="index"
                class="option-item"
                :class="{ 'selected': selectedChoice === option.key }"
              >
                <label>
                  <input
                    type="radio"
                    :name="`question-${currentQuestion.id}`"
                    :value="option.key"
                    v-model="selectedChoice"
                    @change="handleOptionChange"
                  />
                  <span class="option-label">{{ option.key }}.</span>
                  <span class="option-text">{{ option.value }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- 案例题 -->
          <div v-else-if="currentQuestion.questionCase" class="question-content">
            <h3>{{ currentQuestion.title }}</h3>
            <div class="question-desc"
                 v-html="currentQuestion.questionCase.description"></div>
          </div>

          <!-- 论文题 -->
          <div v-else-if="currentQuestion.questionEssay" class="question-content">
            <h3>{{ currentQuestion.title }}</h3>
            <div class="question-desc"
                 v-html="currentQuestion.questionEssay.description"></div>
          </div>

          <!-- 文章 -->
          <div v-else-if="currentQuestion.questionArticle" class="question-content">
            <h3>{{ currentQuestion.title }}</h3>
            <div class="article-content"
                 v-html="currentQuestion.questionArticle.content"></div>
          </div>

          <!-- 操作按钮 -->
          <div class="question-actions">
            <div class="pagination-info">
              {{ currentIndex + 1 }} / {{ questionList.length }}
            </div>
            <div class="action-buttons">
              <button
                v-if="currentIndex > 0"
                class="prev-btn"
                @click="prevQuestion"
              >
                上一题
              </button>
              <button
                v-if="isArticleType"
                class="next-btn"
                @click="nextQuestion"
              >
                下一篇
              </button>
              <button
                v-else
                class="next-btn"
                @click="nextQuestion"
                :disabled="!canGoNext"
              >
                下一题
              </button>
            </div>
          </div>
        </div>

        <div v-else-if="!detailLoading && questionList.length === 0" class="no-questions">
          暂无任务内容
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, watch} from 'vue'
import {getCalendarDateQuestionDetail} from '@/api/calendar/calendarDate'

interface Task {
  id: number
  planTitle: string
  planDescription: string
}

interface ChoiceOption {
  key: string
  value: string
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
  description?: string
}

interface QuestionEssay {
  id?: number
  title?: string
  description?: string
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

const handleOptionChange = () => {
  // 可以在这里添加选项变化时的逻辑
}

// 添加获取难度文本的方法
const getDifficultyText = (difficulty: number | undefined) => {
  const difficultyMap: Record<number, string> = {
    1: '简单',
    2: '中等',
    3: '困难'
  }
  return difficulty ? difficultyMap[difficulty] : '未知'
}

// 当前问题
const currentQuestion = computed(() => {
  return questionList.value[currentIndex.value] || null
})

// 是否为文章类型
const isArticleType = computed(() => {
  return currentQuestion.value?.type === 'ARTICLE'
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

// 选择题选项
const choiceOptions = computed<ChoiceOption[]>(() => {
  if (!currentQuestion.value?.questionChoice) return []

  const choice = currentQuestion.value.questionChoice
  const options: ChoiceOption[] = []

  // 解析 options 字段（JSON 字符串）
  try {
    const parsedOptions = JSON.parse(choice.options || '[]')
    if (Array.isArray(parsedOptions)) {
      parsedOptions.forEach((item: any) => {
        if (item.label && item.content) {
          options.push({
            key: item.label,
            value: item.content
          })
        }
      })
    }
  } catch (error) {
    console.error('解析 options 失败:', error)
  }

  return options
})

// 是否可以进入下一题（对于非文章类型）
const canGoNext = computed(() => {
  if (isArticleType.value) return true
  if (currentQuestion.value?.type === 'CHOICE') {
    return !!selectedChoice.value
  }
  return true
})

// 获取任务详情
const fetchTaskDetail = async () => {
  if (!props.task) return

  try {
    detailLoading.value = true
    const response = await getCalendarDateQuestionDetail(props.task.id, 1, 100)

    questionList.value = response.records || []
    console.log('questionList', questionList)
    currentIndex.value = 0
    selectedChoice.value = null
  } catch (error) {
    console.error('获取任务详情失败:', error)
  } finally {
    detailLoading.value = false
  }
}

// 上一题
const prevQuestion = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    selectedChoice.value = null
  }
}

// 下一题
const nextQuestion = () => {
  if (currentIndex.value < questionList.value.length - 1) {
    currentIndex.value++
    selectedChoice.value = null
  }
}

// 关闭弹框
const closeModal = () => {
  emit('close')
}

// 监听任务变化
watch(() => props.task, (newTask) => {
  if (newTask) {
    fetchTaskDetail()
  } else {
    questionList.value = []
    currentIndex.value = 0
    selectedChoice.value = null
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
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
  animation: fadeIn 0.3s ease-out;
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
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  animation: slideIn 0.3s ease-out;
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
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  color: #333;
  font-size: 20px;
}

.close-btn {
  font-size: 28px;
  cursor: pointer;
  color: #999;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.close-btn:hover {
  color: #333;
  background: #f5f5f5;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.loading, .no-questions {
  text-align: center;
  padding: 50px 20px;
  color: #666;
}

.question-detail {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.question-type-tag {
  align-self: flex-start;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 20px;
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
}

.question-content h3 {
  margin: 0 0 20px 0;
  color: #333;
  line-height: 1.4;
}

.question-desc, .article-content {
  line-height: 1.6;
  color: #555;
  white-space: pre-wrap;
}

.question-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
}

.option-item label {
  display: flex;
  align-items: flex-start;
  cursor: pointer;
  padding: 12px;
  border-radius: 8px;
  transition: all 0.2s;
}

.option-item label:hover {
  background: #f5f5f5;
}

.option-item input[type="radio"] {
  margin-top: 3px;
  margin-right: 10px;
}

.option-label {
  font-weight: bold;
  margin-right: 5px;
}

.option-text {
  flex: 1;
}

.question-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.pagination-info {
  color: #666;
  font-size: 14px;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.prev-btn, .next-btn {
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
}

.prev-btn {
  background: #f5f5f5;
  color: #333;
}

.prev-btn:hover {
  background: #e0e0e0;
}

.next-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.next-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.next-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.option-item label {
  display: flex;
  align-items: flex-start;
  cursor: pointer;
  padding: 12px;
  border-radius: 8px;
  transition: all 0.2s;
  color: #333;
}

.option-item label:hover {
  background: #f5f5f5;
  color: #000;
}

.option-item input[type="radio"]:checked + .option-label,
.option-item input[type="radio"]:checked ~ .option-text {
  color: #0066cc;
}

.option-label {
  font-weight: bold;
  margin-right: 5px;
  color: #333;
}

.option-text {
  flex: 1;
  color: #555;
}

/* 新增的样式 */
.question-content {
  flex: 1;
  padding: 20px 0;
}

.question-content h3 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 16px;
  font-weight: 500;
}

.question-difficulty {
  margin-bottom: 20px;
  color: #999;
  font-size: 14px;
}

.question-options {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
}

.option-item {
  transition: all 0.2s;
}

.option-item:last-child {
  border-bottom: none;
}

.option-item.selected {
  background-color: #f8f9fa;
}

.option-item label {
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 0;
  padding: 5px;
}

.option-item input[type="radio"] {
  margin-right: 10px;
  width: 16px;
  height: 16px;
  border: 1px solid #ccc;
  border-radius: 50%;
  appearance: none;
  -webkit-appearance: none;
  background: white;
}

.option-item input[type="radio"]:checked {
  background-color: #007bff;
  border-color: #007bff;
}

.option-item input[type="radio"]:checked::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background-color: white;
  border-radius: 50%;
}

.option-label {
  font-weight: normal;
  margin-right: 5px;
  color: #333;
}

.option-text {
  flex: 1;
  color: #555;
}

/* 按钮样式调整 */
.next-btn {
  background: #f0f0f0;
  color: #666;
  border: 1px solid #ddd;
  box-shadow: none;
  padding: 8px 16px;
  font-size: 14px;
}

.next-btn:hover:not(:disabled) {
  background: #e0e0e0;
  transform: none;
}

.next-btn:disabled {
  background: #f8f9fa;
  color: #ccc;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    max-height: 95vh;
  }

  .modal-header h2 {
    font-size: 18px;
  }

  .modal-body {
    padding: 15px;
  }

  .question-actions {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }

  .action-buttons {
    justify-content: space-between;
  }

  .prev-btn, .next-btn {
    flex: 1;
    padding: 12px;
  }
}
</style>
