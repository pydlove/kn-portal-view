<!-- src/components/CaseQuestion.vue -->
<template>
  <div class="question-content">
    <h3 class="question-title">{{ question.title }}</h3>

    <!-- 难度和得分显示 -->
    <div class="question-info">
      <div class="question-difficulty" v-if="question.difficulty">
        <span class="difficulty-label">难度：</span>
        <span class="difficulty-value" :class="difficultyClass">
          {{ getDifficultyText(question.difficulty) }}
        </span>
      </div>
      <div class="question-score" v-if="question.score">
        <span class="score-label">得分：</span>
        <span class="score-value">{{ question.score }} 分</span>
      </div>
    </div>

    <!-- 背景信息 -->
    <div class="question-section">
      <h4 class="section-title">背景信息</h4>
      <div class="question-desc" v-html="renderMarkdown(question.questionCase?.background)"></div>
    </div>

    <!-- 问题要求 -->
    <div class="question-section">
      <h4 class="section-title">问题要求</h4>
      <div class="question-desc" v-html="renderMarkdown(question.questionCase?.requirement)"></div>
    </div>

    <!-- 查看答案解析按钮 -->
    <div class="answer-toggle" @click="toggleAnswer">
      <span class="toggle-text">
        {{ showAnswer ? '隐藏做题技巧和答案解析' : '查看做题技巧和答案解析' }}
        <i :class="['toggle-icon', { 'rotated': showAnswer }]">▼</i>
      </span>
    </div>

    <!-- 答案解析 -->
    <div class="question-section answer-section" v-show="showAnswer">
      <h4 class="section-title">参考答案</h4>
      <div class="question-desc" v-html="renderMarkdown(question.questionCase?.referenceAnswer)"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface QuestionCase {
  id?: number
  title?: string
  background?: string
  requirement?: string
  referenceAnswer?: string
}

interface Question {
  id?: number
  title?: string
  type?: string
  score?: number
  difficulty?: number
  questionEssay?: any
  questionChoice?: any
  questionCase?: QuestionCase
  questionArticle?: any
}

const props = defineProps<{
  question: Question
  renderMarkdown: (content: string | undefined) => string
}>()

const emit = defineEmits<{
  (e: 'toggle-answer'): void
}>()

const showAnswer = ref(false)

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

// 切换答案显示
const toggleAnswer = () => {
  showAnswer.value = !showAnswer.value
  emit('toggle-answer')
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

/* 案例题部分样式 */
.question-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.question-desc {
  line-height: 1.7;
  color: #444;
  font-size: 16px;
}

/* 查看答案解析按钮 */
.answer-toggle {
  text-align: center;
  margin: 20px 0;
  cursor: pointer;
}

.toggle-text {
  display: inline-block;
  padding: 10px 20px;
  background: #f1f5f9;
  color: #4a5568;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s;
}

.toggle-text:hover {
  background: #e2e8f0;
}

.toggle-icon {
  display: inline-block;
  margin-left: 8px;
  transition: transform 0.3s;
}

.toggle-icon.rotated {
  transform: rotate(180deg);
}

.answer-section {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

@media (max-width: 768px) {
  .question-info {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
