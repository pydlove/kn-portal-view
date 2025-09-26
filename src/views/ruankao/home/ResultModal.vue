<!-- src/components/ResultModal.vue -->
<template>
  <div class="result-modal-overlay" @click="onClose">
    <div class="result-modal-content" @click.stop>
      <div class="result-header">
        <h2>{{ isPassed ? '🎉 恭喜您通过考试!' : '💪 继续努力!' }}</h2>
        <button class="close-btn" @click="onClose">&times;</button>
      </div>

      <div class="result-body">
        <div class="score-circle">
          <div class="score-value">{{ score }}</div>
          <div class="score-label">得分</div>
        </div>

        <div class="result-details">
          <div class="detail-item">
            <span class="label">答对题数:</span>
            <span class="value correct">{{ correctCount }}</span>
          </div>
          <div class="detail-item">
            <span class="label">总题数:</span>
            <span class="value">{{ totalQuestions }}</span>
          </div>
          <div class="detail-item">
            <span class="label">正确率:</span>
            <span class="value" :class="{ 'passed': isPassed, 'failed': !isPassed }">
              {{ accuracy }}%
            </span>
          </div>
        </div>

        <div class="result-message">
          <p v-if="isPassed" class="passed-message">
            🎉 恭喜您成功通过本次测试！您的努力得到了回报，继续保持！
          </p>
          <p v-else class="failed-message">
            💪 很遗憾，您没有通过本次测试。请继续学习，查漏补缺，相信您下次一定能取得更好的成绩！
          </p>
        </div>
      </div>

      <div class="result-footer">
        <button class="btn primary-btn" @click="onClose">完成</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  score: number
  correctCount: number
  totalQuestions: number
  onClose: () => void
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const accuracy = computed(() => {
  if (props.totalQuestions === 0) return 0
  return Math.round((props.correctCount / props.totalQuestions) * 100)
})

const isPassed = computed(() => {
  return props.score >= 45
})

const onClose = () => {
  emit('close')
}
</script>

<style scoped>
.result-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
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

.result-modal-content {
  background: white;
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  animation: slideIn 0.3s ease-out;
  position: relative;
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

.result-header {
  padding: 25px 30px 15px;
  background: linear-gradient(120deg, #667eea, #764ba2);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.result-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 32px;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.result-body {
  padding: 30px;
  text-align: center;
}

.score-circle {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto 30px;
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
}

.score-value {
  font-size: 48px;
  font-weight: 700;
  color: white;
  line-height: 1;
}

.score-label {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 5px;
}

.result-details {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 20px;
  background: #f8f9ff;
  border-radius: 12px;
  font-size: 18px;
}

.label {
  font-weight: 500;
  color: #555;
}

.value {
  font-weight: 600;
}

.value.correct {
  color: #4caf50;
}

.value.passed {
  color: #4caf50;
}

.value.failed {
  color: #f44336;
}

.result-message {
  margin-bottom: 30px;
}

.result-message p {
  font-size: 18px;
  line-height: 1.6;
  margin: 0;
  padding: 20px;
  border-radius: 12px;
}

.passed-message {
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

.failed-message {
  background: rgba(244, 67, 54, 0.1);
  color: #f44336;
}

.result-footer {
  padding: 0 30px 30px;
  text-align: center;
}

.btn {
  padding: 14px 30px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.2s;
  min-width: 150px;
}

.primary-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

@media (max-width: 768px) {
  .result-modal-content {
    width: 95%;
    border-radius: 16px;
  }

  .result-header {
    padding: 20px;
  }

  .result-header h2 {
    font-size: 20px;
  }

  .result-body {
    padding: 20px;
  }

  .score-circle {
    width: 120px;
    height: 120px;
  }

  .score-value {
    font-size: 36px;
  }

  .detail-item {
    font-size: 16px;
    padding: 10px 15px;
  }

  .result-message p {
    font-size: 16px;
    padding: 15px;
  }
}
</style>
