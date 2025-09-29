<!-- src/views/ruankao/home/index.vue -->
<template>
  <div class="home-container">
    <!-- 添加建设中提示弹窗 -->
    <div v-if="showConstructionModal" class="construction-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>🏗️ 网站建设中</h2>
        </div>
        <div class="modal-body">
          <p>本网站暂时不支持手机端，内容正在紧张建设中...</p>
          <p>预计开放时间：国庆节后第一天</p>
          <p>敬请期待！</p>
        </div>
        <div class="modal-footer">
          <button class="confirm-btn" @click="closeModal">我知道了</button>
        </div>
      </div>
    </div>

    <div class="cross-promotion-banner">
      <div class="promotion-content">
        <div class="promotion-text">
          <h3>🚀 想要深入学习Java全栈技术？</h3>
          <p>访问我们的Java技术小窝，获取完整的知识体系和实战经验</p>
        </div>
        <div class="promotion-actions">
          <button class="btn btn-primary" @click="goToJavaSite">
            前往Java技术小窝
            <span class="external-icon">↗</span>
          </button>
        </div>
      </div>
    </div>

    <div class="rk-home-header">
      <!-- 头部横幅 -->
      <div class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">软考30天冲刺计划</h1>
          <p class="hero-subtitle">高效备考，轻松通过软考</p>
          <div class="countdown">
            <div class="countdown-item">
              <span class="countdown-number">{{ daysUntilExam }}</span>
              <span class="countdown-label">天</span>
            </div>
            <div class="countdown-item">
              <span class="countdown-number">{{ hoursUntilExam }}</span>
              <span class="countdown-label">时</span>
            </div>
            <div class="countdown-item">
              <span class="countdown-number">{{ minutesUntilExam }}</span>
              <span class="countdown-label">分</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 核心功能介绍 -->
      <div class="core-feature-section">
        <div class="card">
          <div class="core-feature-content">
            <div class="feature-highlight">
              <h2 class="feature-title">📅 智能学习日历</h2>
              <p class="feature-description">点击日期查看每日学习任务，科学规划30天备考路径</p>
            </div>
            <div class="feature-steps">
              <div class="step-item">
                <div class="step-number">1</div>
                <div class="step-content">
                  <h3>选择日期</h3>
                  <p>点击日历上的任意日期</p>
                </div>
              </div>
              <div class="step-arrow">→</div>
              <div class="step-item">
                <div class="step-number">2</div>
                <div class="step-content">
                  <h3>查看任务</h3>
                  <p>获取该日期的学习内容</p>
                </div>
              </div>
              <div class="step-arrow">→</div>
              <div class="step-item">
                <div class="step-number">3</div>
                <div class="step-content">
                  <h3>完成学习</h3>
                  <p>按计划完成每日任务</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <div class="content-wrapper">
        <!-- 右侧内容 -->
        <div class="right-column">
          <div class="banner-content">
            <h2 class="chinese-glow-text">全力以赴</h2>
            <p class="subtitle">坚持到底，胜利就在前方！</p>
          </div>

          <div class="ad-box">
            <MainBanner/>

            <!-- 广告横幅 -->
            <div class="card banner-card">
              <div class="banner-content">
                <div class="banner-header">
                  <h2>🔥 限时福利</h2>
                  <div class="banner-tag">限时免费</div>
                </div>
                <p class="banner-description">现在加入30天冲刺计划，免费学习备考资料！</p>
                <div class="banner-features">
                  <div class="feature-item">
                    <span class="feature-icon">📚</span>
                    <span>1000+高频考点</span>
                  </div>
                  <div class="feature-item">
                    <span class="feature-icon">📝</span>
                    <span>1000+精选试题</span>
                  </div>
                  <div class="feature-item">
                    <span class="feature-icon">📊</span>
                    <span>智能学习计划</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 学习计划说明 -->
          <div class="card study-plan-card">
            <h2 class="card-title">30天冲刺计划</h2>
            <div class="study-plan-description">
              <div class="plan-section">
                <h3>🎯 计划目的</h3>
                <p>
                  通过科学规划的30天学习路径，帮助考生系统性地复习软考知识点，全面提升应试能力，确保在考试中取得优异成绩。</p>
              </div>

              <div class="plan-section">
                <h3>📚 核心动作</h3>
                <ul>
                  <li><strong>每日任务</strong>：根据个人基础定制每日学习内容</li>
                  <li><strong>专项训练</strong>：针对薄弱环节进行强化练习</li>
                  <li><strong>模拟考试</strong>：全真模拟环境，熟悉考试节奏</li>
                  <li><strong>错题回顾</strong>：智能分析错题，避免重复犯错</li>
                </ul>
              </div>

              <div class="plan-section">
                <h3>💎 计划意义</h3>
                <p>
                  30天冲刺计划不仅帮助考生通过考试，更重要的是建立扎实的理论基础和实践能力，为未来的职业发展奠定坚实基础。</p>
              </div>
            </div>
          </div>

        </div>

        <!-- 左侧日历 -->
        <div class="left-column">
          <div class="card calendar-card">
            <div class="calendar-header-section">
              <h2 class="calendar-title">🎯 30天学习日历</h2>
              <p class="calendar-subtitle">点击日期查看学习任务</p>
            </div>
            <ExamCalendar :end-date="examEndDate"/>
          </div>
        </div>
      </div>
    </div>

    <!-- 特色功能区域 -->
    <div class="features-section">
      <div class="features-wrapper">
        <div class="feature-card">
          <div class="feature-icon">🎯</div>
          <h3>精准预测</h3>
          <p>基于历年真题的大数据分析，精准预测考点分布</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🧠</div>
          <h3>智能练习</h3>
          <p>个性化题目推荐系统，针对性提升薄弱环节</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📈</div>
          <h3>学习报告</h3>
          <p>实时追踪学习进度和效果，可视化展示成长轨迹</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">👥</div>
          <h3>学习社区</h3>
          <p>与万千考生一起交流学习，互相激励共同进步</p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <Footer/>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted, onUnmounted} from 'vue'
import ExamCalendar from '../../../components/ruankao/ExamCalendar.vue'
import Footer from "@/components/Footer.vue"
import MainBanner from "@/components/advertisement/MainBanner.vue"
import router from "@/router";

// 设置考试截止日期
const examEndDate = ref(new Date('2025-11-10'))

// 倒计时数据
const currentTime = ref(new Date())

let timer: number | null = null

// 添加跳转到软考网站的方法
const goToJavaSite = () => {
  router.push('/home')
}

const showConstructionModal = ref(true)

// 关闭弹窗方法
const closeModal = () => {
  showConstructionModal.value = false
}

// 检查是否已经显示过弹窗（可选功能）
onMounted(() => {
  const hasSeenModal = localStorage.getItem('constructionModalShown')
  if (hasSeenModal) {
    showConstructionModal.value = false
  }
})

// 标记已显示弹窗（可选功能）
const closeConstructionModal = () => {
  showConstructionModal.value = false
  localStorage.setItem('constructionModalShown', 'true')
}

onMounted(() => {
  timer = setInterval(() => {
    currentTime.value = new Date()
  }, 60000) // 每分钟更新一次
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

// 计算倒计时
const timeDiff = computed(() => {
  return examEndDate.value.getTime() - currentTime.value.getTime()
})

const daysUntilExam = computed(() => {
  return Math.max(0, Math.floor(timeDiff.value / (1000 * 60 * 60 * 24)))
})

const hoursUntilExam = computed(() => {
  return Math.max(0, Math.floor((timeDiff.value % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))
})

const minutesUntilExam = computed(() => {
  return Math.max(0, Math.floor((timeDiff.value % (1000 * 60 * 60)) / (1000 * 60)))
})
</script>

<style scoped>

.construction-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 15px;
  padding: 30px;
  text-align: center;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: modalAppear 0.3s ease-out;
}

@keyframes modalAppear {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header h2 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 1.8rem;
}

.modal-body p {
  margin: 10px 0;
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
}

.confirm-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 20px;
  transition: all 0.3s ease;
}

.confirm-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

/* 产品互推横幅 */
.cross-promotion-banner {
  background: linear-gradient(135deg, #ffd8a6 0%, #ff6b6b 100%);
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 20px;
  box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.promotion-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.promotion-text h3 {
  color: #8b4513;
  margin: 0 0 10px 0;
  font-size: 1.4rem;
}

.promotion-text p {
  color: #a0522d;
  margin: 0;
  font-size: 1rem;
  opacity: 0.9;
}

.promotion-actions .btn-primary {
  background: linear-gradient(135deg, #8b4513, #a0522d);
  border: none;
  padding: 12px 24px;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 24px;
  color: #ffffff;
}

.promotion-actions .btn-primary:hover {
  background: linear-gradient(135deg, #a0522d, #d56312);
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(139, 69, 19, 0.4);
}

.external-icon {
  font-size: 1.2rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .promotion-content {
    flex-direction: column;
    text-align: center;
  }

  .promotion-text h3 {
    font-size: 1.2rem;
  }

  .cross-promotion-banner {
    padding: 20px;
    margin: 20px 0;
  }
}

.chinese-glow-text {
  font-size: 4rem;
  font-family: 'KaiTi', 'SimSun', 'STSong', serif;
  color: white;
  text-shadow:
    0 0 15px #667eea,
    0 0 30px #764ba2,
    0 0 45px #ff6b6b,
    0 0 60px #ff6b6b;
  animation: pulse 2s infinite alternate;
  font-weight: bold;
  text-align: center;
  margin: 0;
  padding: 20px;
  line-height: 1.2;
  font-style: italic;        /* 斜体 */
}

.banner-content {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 40px;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.glow-text {
  font-size: 3rem;           /* 更大字号 */
  font-style: italic;        /* 斜体 */
  color: white;
  text-shadow:
    0 0 15px #667eea,
    0 0 30px #764ba2,
    0 0 45px #ff6b6b,
    0 0 60px #ff6b6b;
  animation: pulse 2s infinite alternate;
  font-weight: bold;
}

@keyframes pulse {
  from {
    text-shadow: 0 0 15px #667eea, 0 0 30px #764ba2;
  }
  to {
    text-shadow: 0 0 20px #667eea, 0 0 40px #764ba2, 0 0 60px #ff6b6b;
  }
}

.rk-home-header {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  grid-template-columns: 1fr 1fr;
}

.home-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  overflow: auto;
  height: calc(100vh - 120px);
  padding: 90px 20px 20px;
}

/* 头部横幅样式 */
.hero-section {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 20px;
  text-align: center;
  margin-bottom: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: calc(100% - 940px);
}

.hero-title {
  color: white;
  font-size: 2.5rem;
  margin-bottom: 10px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
  margin-bottom: 30px;
}

.countdown {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.countdown-item {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 15px;
  min-width: 80px;
  backdrop-filter: blur(5px);
}

.countdown-number {
  display: block;
  font-size: 2rem;
  font-weight: bold;
  color: white;
}

.countdown-label {
  display: block;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

/* 核心功能介绍 */
.core-feature-section {
  margin-bottom: 30px;
  width: 920px;
}

.core-feature-content {
  text-align: center;
}

.feature-highlight {
  margin-bottom: 30px;
}

.feature-title {
  font-size: 2rem;
  color: #333;
  margin-bottom: 15px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.feature-description {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 30px;
}

.feature-steps {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  min-width: 150px;
}

.step-number {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
}

.step-content h3 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 1.2rem;
}

.step-content p {
  margin: 0;
  color: #666;
  font-size: 1rem;
}

.step-arrow {
  font-size: 2rem;
  color: #667eea;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
}

/* 主要内容区域 */
.main-content {
  margin-bottom: 30px;
}

.content-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.left-column, .right-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 日历标题 */
.calendar-header-section {
  text-align: center;
  margin-bottom: 20px;
}

.calendar-title {
  font-size: 1.5rem;
  color: #333;
  margin: 0 0 10px 0;
}

.calendar-subtitle {
  font-size: 1rem;
  color: #667eea;
  font-weight: 500;
  margin: 0;
}

.ad-box {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  grid-template-columns: 1fr 1fr;
}

.ad-box .banner-card {
  width: calc(100% - 280px);
  height: 230px;
}

.ad-box .cloud-banner-wrapper {
  min-width: 260px;
  margin: 0 !important;
  height: 230px;
}

/* 卡片样式 */
.card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.card-title {
  color: #333;
  margin-top: 0;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
  font-size: 1.5rem;
}

/* 日历卡片 */
.calendar-card {
  padding: 20px;
}

/* 广告横幅卡片 */
.banner-card {
  text-align: center;
}

.banner-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.banner-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
}

.banner-tag {
  background: linear-gradient(135deg, #ff6b6b, #ff8e53);
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.banner-description {
  color: #666;
  font-size: 1rem;
  margin: 10px 0 15px;
  line-height: 1.4;
}

.banner-features {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 15px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
  color: #555;
}

.feature-icon {
  font-size: 1.1rem;
}

/* 学习计划说明 */
.study-plan-description {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.plan-section h3 {
  color: #333;
  margin: 0 0 10px 0;
  font-size: 1.2rem;
}

.plan-section p {
  color: #666;
  line-height: 1.6;
  margin: 0 0 10px 0;
}

.plan-section ul {
  padding-left: 20px;
  margin: 10px 0;
}

.plan-section li {
  margin-bottom: 8px;
  color: #666;
  line-height: 1.5;
}

.plan-section strong {
  color: #667eea;
}

/* 特色功能区域 */
.features-section {
  margin-top: 20px;
  margin-bottom: 20px;
}

.features-wrapper {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 25px;
  text-align: center;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  background: white;
}

.feature-icon {
  font-size: 2rem;
  margin-bottom: 15px;
}

.feature-card h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.feature-card p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
}

.fullstack-page .footer {
  border: 0;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .content-wrapper {
    grid-template-columns: 1fr;
  }

  .features-wrapper {
    grid-template-columns: repeat(2, 1fr);
  }

  .feature-steps {
    gap: 15px;
  }

  .step-item {
    min-width: 120px;
  }
}

@media (max-width: 768px) {
  .home-container {
    padding: 80px 15px 15px;
  }

  .hero-section {
    padding: 20px;
  }

  .hero-title {
    font-size: 2rem;
  }

  .countdown {
    flex-wrap: wrap;
  }

  .features-wrapper {
    grid-template-columns: 1fr;
  }

  .card {
    padding: 20px;
  }

  .card-title {
    font-size: 1.3rem;
  }

  .plan-section h3 {
    font-size: 1.1rem;
  }

  .ad-box {
    flex-direction: column;
  }

  .ad-box .banner-card {
    width: 100%;
    height: auto;
  }

  .banner-features {
    flex-direction: column;
    gap: 8px;
  }

  .feature-steps {
    flex-direction: column;
    gap: 20px;
  }

  .step-item {
    flex-direction: row;
    justify-content: flex-start;
    gap: 15px;
    min-width: auto;
    width: 100%;
    text-align: left;
  }

  .step-arrow {
    transform: rotate(90deg);
    height: auto;
    width: 50px;
    justify-content: center;
  }

  .step-number {
    min-width: 50px;
  }

  .step-content {
    text-align: left;
  }
}
</style>
