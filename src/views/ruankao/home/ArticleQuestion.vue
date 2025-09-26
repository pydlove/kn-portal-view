<!-- src/components/ArticleQuestion.vue -->
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

    <div class="article-content" v-html="renderMarkdown(question.questionArticle?.content)"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface QuestionArticle {
  id?: number
  title?: string
  content?: string
}

interface Question {
  id?: number
  title?: string
  type?: string
  score?: number
  difficulty?: number
  questionEssay?: any
  questionChoice?: any
  questionCase?: any
  questionArticle?: QuestionArticle
}

const props = defineProps<{
  question: Question
  renderMarkdown: (content: string | undefined) => string
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

.article-content {
  line-height: 1.7;
  color: #444;
  font-size: 16px;
}

@media (max-width: 768px) {
  .question-info {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
