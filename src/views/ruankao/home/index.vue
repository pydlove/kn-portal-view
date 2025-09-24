<template>
  <div class="home-container">
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

    <!-- 移动端优先显示日历 -->
    <div class="mobile-calendar">
      <div class="card calendar-card">
        <ExamCalendar :end-date="examEndDate"/>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <div class="content-wrapper">
        <!-- 左侧内容 -->
        <div class="left-column">
          <div class="card">
            <h2 class="card-title">学习计划</h2>
            <div class="study-plan">
              <div class="plan-item" v-for="item in studyPlan" :key="item.id">
                <div class="plan-icon">
                  <i :class="item.icon"></i>
                </div>
                <div class="plan-content">
                  <h3>{{ item.title }}</h3>
                  <p>{{ item.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <h2 class="card-title">最新资讯</h2>
            <div class="news-list">
              <div class="news-item" v-for="news in latestNews" :key="news.id">
                <div class="news-date">{{ news.date }}</div>
                <div class="news-content">
                  <h3>{{ news.title }}</h3>
                  <p>{{ news.summary }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 桌面端右侧日历 (移动端隐藏) -->
        <div class="right-column">
          <div class="card calendar-card">
            <ExamCalendar :end-date="examEndDate"/>
          </div>
        </div>
      </div>
    </div>

    <!-- 特色功能区域 -->
    <div class="features-section">
      <div class="features-wrapper">
        <div class="feature-card" v-for="feature in features" :key="feature.title">
          <div class="feature-icon">
            <i :class="feature.icon"></i>
          </div>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
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
import Footer from "@/components/Footer.vue";

// 设置考试截止日期
const examEndDate = ref(new Date('2025-11-10'))

// 倒计时数据
const currentTime = ref(new Date())

let timer: number | null = null

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

// 学习计划数据
const studyPlan = ref([
  {
    id: 1,
    icon: '📚',
    title: '系统设计',
    description: '掌握系统架构设计核心知识点'
  },
  {
    id: 2,
    icon: '📝',
    title: '案例分析',
    description: '每日一练，提升解题能力'
  },
  {
    id: 3,
    icon: '📊',
    title: '模拟考试',
    description: '全真模拟，查漏补缺'
  }
])

// 最新资讯数据
const latestNews = ref([
  {
    id: 1,
    date: '2023-10-01',
    title: '2023下半年软考时间确定',
    summary: '考试时间已公布，请考生合理安排复习计划'
  },
  {
    id: 2,
    date: '2023-09-25',
    title: '新增系统架构师考点',
    summary: '今年新增考点详解，务必重点关注'
  }
])

// 特色功能
const features = ref([
  {
    icon: '🎯',
    title: '精准预测',
    description: '基于历年真题的大数据分析'
  },
  {
    icon: '🧠',
    title: '智能练习',
    description: '个性化题目推荐系统'
  },
  {
    icon: '📈',
    title: '学习报告',
    description: '实时追踪学习进度和效果'
  },
  {
    icon: '👥',
    title: '学习社区',
    description: '与万千考生一起交流学习'
  }
])
</script>

<style scoped>
.home-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  overflow: auto;
  height: calc(100vh - 120px);
  padding: 100px 20px 20px;
}

/* 头部横幅样式 */
.hero-section {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  margin-bottom: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
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

/* 移动端日历 (默认显示) */
.mobile-calendar {
  display: none;
}

.mobile-calendar .calendar-card {
  padding: 20px;
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
}

/* 学习计划 */
.study-plan {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.plan-item {
  display: flex;
  gap: 15px;
  padding: 15px;
  border-radius: 10px;
  transition: background-color 0.3s ease;
}

.plan-item:hover {
  background: #f8f9fa;
}

.plan-icon {
  font-size: 1.5rem;
}

.plan-content h3 {
  margin: 0 0 5px 0;
  color: #333;
}

.plan-content p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

/* 最新资讯 */
.news-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.news-item {
  display: flex;
  gap: 15px;
  padding: 15px;
  border-radius: 10px;
  transition: background-color 0.3s ease;
}

.news-item:hover {
  background: #f8f9fa;
}

.news-date {
  color: #409EFF;
  font-size: 0.8rem;
  min-width: 70px;
}

.news-content h3 {
  margin: 0 0 5px 0;
  color: #333;
  font-size: 1rem;
}

.news-content p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

/* 日历卡片 */
.calendar-card {
  padding: 20px;
}

/* 特色功能区域 */
.features-section {
  margin-top: 20px;
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
}

.fullstack-page .footer {
  border: 0;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .content-wrapper {
    grid-template-columns: 1fr;
  }

  /* 在桌面端隐藏右侧日历 */
  .right-column {
    display: none;
  }

  /* 在移动端显示顶部日历 */
  .mobile-calendar {
    display: block;
    margin-bottom: 30px;
  }

  .features-wrapper {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .home-container {
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
    padding: 15px;
  }

  /* 确保移动端始终显示顶部日历 */
  .mobile-calendar {
    display: block;
    margin-bottom: 20px;
  }

  .right-column {
    display: none;
  }
}
</style>
