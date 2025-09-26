<!-- src/components/PracticeResultModal.vue -->
<template>
  <div class="result-modal-overlay" @click="onClose">
    <div class="result-modal-content" @click.stop>
      <div class="result-header">
        <h2>🎉 完成练习</h2>
        <button class="close-btn" @click="onClose">&times;</button>
      </div>

      <div class="result-body">
        <div class="result-icon">✅</div>

        <div class="result-message">
          <h3>恭喜您完成本题练习！</h3>
          <p class="encouragement">
            案例分析题和论文题主要考察您的综合分析能力和实践经验，
            没有标准答案，重在思考过程和解决问题的思路。
          </p>

          <div class="tips-section">
            <h4>📝 答题技巧提示</h4>
            <ul>
              <li>仔细阅读背景信息，理解问题核心</li>
              <li>结合实际工作经验，给出具体可行的解决方案</li>
              <li>条理清晰，逻辑严谨，突出重点</li>
              <li>注意时间分配，合理安排答题节奏</li>
            </ul>
          </div>

          <div class="encouragement-section">
            <h4>💪 继续加油</h4>
            <p>
              每一次练习都是进步的机会，继续保持学习的热情，
              相信您会在考试中取得优异的成绩！
            </p>
          </div>
        </div>
      </div>

      <div class="result-footer">
        <button class="btn primary-btn" @click="onClose">继续练习</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'close'): void
}>()

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

.result-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.result-message h3 {
  color: #2c3e50;
  margin: 0 0 15px 0;
  font-size: 20px;
}

.encouragement {
  color: #555;
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 25px;
}

.tips-section, .encouragement-section {
  text-align: left;
  margin-bottom: 25px;
}

.tips-section h4, .encouragement-section h4 {
  color: #2c3e50;
  margin: 0 0 12px 0;
  font-size: 18px;
}

.tips-section ul {
  padding-left: 20px;
  margin: 0;
}

.tips-section li {
  margin-bottom: 8px;
  color: #555;
  line-height: 1.5;
}

.encouragement-section p {
  color: #555;
  line-height: 1.6;
  margin: 0;
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

  .result-message h3 {
    font-size: 18px;
  }

  .tips-section h4, .encouragement-section h4 {
    font-size: 16px;
  }
}
</style>
