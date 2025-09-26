<!-- src/components/ChoiceQuestion.vue -->
<template>
  <div class="question-content">
    <h3 class="question-title">问题：{{ question.title }}</h3>
    <div class="question-difficulty">
      <span class="difficulty-label">难度：</span>
      <span class="difficulty-value" :class="difficultyClass">
        {{ getDifficultyText(question.difficulty) }}
      </span>
    </div>
    <div class="question-options">
      <div
        v-for="(option, index) in choiceOptions"
        :key="index"
        class="option-item"
        :class="{
          'selected': selectedChoice === option.key,
          'correct': showAnswer && isCorrect(option.key),
          'incorrect': showAnswer && selectedChoice === option.key && !isCorrect(option.key)
        }"
        @click="selectOption(option.key)"
      >
        <div class="option-content">
          <div class="option-radio">
            <div class="radio-outer">
              <div class="radio-inner" v-if="selectedChoice === option.key"></div>
            </div>
          </div>
          <div class="option-text-content">
            <span class="option-label">{{ option.key }}.</span>
            <span class="option-text">{{ option.value }}</span>
          </div>
        </div>
        <div class="option-feedback" v-if="showAnswer && isCorrect(option.key)">
          <i class="check-icon">✓</i> 正确答案
        </div>
      </div>
    </div>

    <!-- 问题解析 -->
    <div class="question-analysis" v-if="showAnswer && question.questionChoice?.analysis">
      <div class="analysis-title">解析：</div>
      <div class="analysis-content" v-html="renderMarkdown(question.questionChoice.analysis)"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'

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

interface Question {
  id?: number
  title?: string
  type?: string
  difficulty?: number
  questionEssay?: any
  questionChoice?: QuestionChoice
  questionCase?: any
  questionArticle?: any
}

const props = defineProps<{
  question: Question
  selectedChoice: string | null
  showAnswer: boolean
  renderMarkdown: (content: string | undefined) => string
}>()

const emit = defineEmits<{
  (e: 'select-option', key: string): void
}>()

// 添加获取难度文本的方法
const getDifficultyText = (difficulty: number | undefined) => {
  const difficultyMap: Record<number, string> = {
    1: '简单',
    2: '中等',
    3: '困难'
  }
  return difficulty ? difficultyMap[difficulty] : '未知'
}

// 难度样式类
const difficultyClass = computed(() => {
  const difficulty = props.question.difficulty
  if (difficulty === 1) return 'easy'
  if (difficulty === 2) return 'medium'
  if (difficulty === 3) return 'hard'
  return ''
})

// 选择题选项
const choiceOptions = computed<ChoiceOption[]>(() => {
  if (!props.question.questionChoice) return []

  const choice = props.question.questionChoice
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

// 是否为正确答案
const isCorrect = (optionKey: string) => {
  if (!props.question.questionChoice?.correctAnswers) return false
  return props.question.questionChoice.correctAnswers.includes(optionKey)
}

// 选择选项
const selectOption = (key: string) => {
  if (!props.showAnswer) {
    emit('select-option', key)
  }
}
</script>

<style scoped>
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

.question-difficulty {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  padding: 10px 16px;
  background: #f8f9fa;
  border-radius: 12px;
  width: fit-content;
}

.difficulty-label {
  font-weight: 500;
  color: #555;
  margin-right: 8px;
}

.difficulty-value {
  font-weight: 600;
  padding: 2px 10px;
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

.question-options {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 20px;
}

.option-item {
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.2s;
  cursor: pointer;
  overflow: hidden;
}

.option-item:hover {
  border-color: #cbd5e0;
}

.option-item.selected {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.option-item.correct {
  border-color: #4caf50;
  background-color: rgba(76, 175, 80, 0.05);
}

.option-item.incorrect {
  border-color: #f44336;
  background-color: rgba(244, 67, 54, 0.05);
}

.option-content {
  display: flex;
  align-items: flex-start;
  padding: 16px;
}

.option-radio {
  margin-right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.radio-outer {
  width: 22px;
  height: 22px;
  border: 2px solid #cbd5e0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.option-item.selected .radio-outer {
  border-color: #667eea;
}

.radio-inner {
  width: 12px;
  height: 12px;
  background: #667eea;
  border-radius: 50%;
}

.option-text-content {
  flex: 1;
  display: flex;
  gap: 8px;
}

.option-label {
  font-weight: 600;
  color: #2d3748;
}

.option-text {
  color: #4a5568;
  line-height: 1.5;
}

.option-feedback {
  padding: 8px 16px;
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}

.check-icon {
  font-weight: bold;
}

/* 问题解析样式 */
.question-analysis {
  margin-top: 24px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.analysis-title {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
  font-size: 16px;
}

.analysis-content {
  color: #555;
  line-height: 1.6;
}
</style>
