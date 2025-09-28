<!-- src/views/ruankao/home/StudyTask.vue -->
<template>
  <div class="study-task-page">
    <!-- 背景装饰元素 -->
    <div class="background-glow"></div>

    <!-- 粒子装饰效果 -->
    <div class="particle" style="top: 20%; left: 10%; width: 8px; height: 8px; animation-delay: 0s;"></div>
    <div class="particle" style="top: 70%; left: 80%; width: 6px; height: 6px; animation-delay: 2s;"></div>
    <div class="particle" style="top: 40%; left: 90%; width: 4px; height: 4px; animation-delay: 4s;"></div>
    <div class="particle" style="top: 80%; left: 20%; width: 10px; height: 10px; animation-delay: 6s;"></div>
    <div class="particle" style="top: 30%; left: 50%; width: 5px; height: 5px; animation-delay: 1s;"></div>
    <div class="particle" style="top: 60%; left: 30%; width: 7px; height: 7px; animation-delay: 3s;"></div>
    <div class="particle" style="top: 10%; left: 70%; width: 6px; height: 6px; animation-delay: 5s;"></div>

    <!-- 页面头部装饰 -->
    <div class="page-header-decoration">
      <div class="decoration-circle circle-1"></div>
      <div class="decoration-circle circle-2"></div>
      <div class="decoration-circle circle-3"></div>
    </div>

    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-badge">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
               xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
              stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round"/>
          </svg>
        </div>
        <h1 class="page-title">今日学习任务</h1>
        <div class="task-date">{{ formattedDate }}</div>
        <div class="header-subtitle">开启高效学习之旅</div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 左侧内容 -->
      <div class="content-left">
        <!-- 任务统计 -->
        <div class="task-stats">
          <div class="stat-card">
            <div class="stat-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                   xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round"/>
                <path d="M12 12L12 12.01" stroke="currentColor" stroke-width="2"
                      stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 16L12 16.01" stroke="currentColor" stroke-width="2"
                      stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 8L12 8.01" stroke="currentColor" stroke-width="2"
                      stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ tasks.length }}</div>
              <div class="stat-label">今日任务</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                   xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round"/>
                <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2"
                      stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ completedTasks }}</div>
              <div class="stat-label">已完成</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                   xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18457 2.99721 7.13633 4.39828 5.49707C5.79935 3.85782 7.69279 2.71538 9.79619 2.24015C11.8996 1.76491 14.1003 1.98234 16.07 2.86"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round"/>
                <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" stroke-width="2"
                      stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ tasks.length - completedTasks }}</div>
              <div class="stat-label">待完成</div>
            </div>
          </div>
        </div>

        <!-- 任务列表 -->
        <div v-if="loading" class="loading-container">
          <div class="spinner-container">
            <div class="spinner"></div>
            <p class="loading-text">正在加载今日任务...</p>
          </div>
        </div>

        <div v-else-if="tasks.length > 0" class="task-list">
          <div
            v-for="(task, index) in tasks"
            :key="task.id"
            class="task-item"
            :class="`task-item-${index % 4}`"
            @click="openTaskDetail(task)"
          >
            <div class="task-card">
              <div class="task-header">
                <div class="task-icon">
                  <svg v-if="index % 4 === 0" width="24" height="24" viewBox="0 0 24 24"
                       fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15"
                      stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round"/>
                    <path d="M12 12L12 12.01" stroke="currentColor" stroke-width="2"
                          stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 16L12 16.01" stroke="currentColor" stroke-width="2"
                          stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 8L12 8.01" stroke="currentColor" stroke-width="2"
                          stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <svg v-else-if="index % 4 === 1" width="24" height="24"
                       viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18457 2.99721 7.13633 4.39828 5.49707C5.79935 3.85782 7.69279 2.71538 9.79619 2.24015C11.8996 1.76491 14.1003 1.98234 16.07 2.86"
                      stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round"/>
                    <path d="M22 4L12 14.01L9 11.01" stroke="currentColor"
                          stroke-width="2" stroke-linecap="round"
                          stroke-linejoin="round"/>
                  </svg>
                  <svg v-else-if="index % 4 === 2" width="24" height="24"
                       viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                      stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round"/>
                  </svg>
                  <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none"
                       xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                      stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round"/>
                    <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2"
                          stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="task-info">
                  <h3 class="task-title">{{ task.planTitle }}</h3>
                  <p class="task-description">{{ task.planDescription }}</p>
                </div>
              </div>
              <div class="task-footer">
                <div class="task-meta">
                  <span class="task-status" :class="getTaskStatusClass(task.isFinished)">
                    <svg v-if="task.isFinished" width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 13L9 17L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    {{ getTaskStatusText(task.isFinished) }}
                  </span>
                </div>
                <button class="complete-btn">
                  <span class="btn-text">去完成</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                       xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="white"
                          stroke-width="2" stroke-linecap="round"
                          stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="no-tasks">
          <div class="empty-state">
            <div class="empty-icon">📚</div>
            <h3 class="empty-title">暂无学习任务</h3>
            <p class="empty-text">今天没有安排学习任务，您可以自由安排学习内容</p>
            <button class="empty-action-btn" @click="goToStudyPlan">
              查看学习计划
            </button>
          </div>
        </div>
      </div>

      <!-- 右侧广告 -->
      <div class="content-right" v-if="showBanner">
        <div class="ad-banner-container">
          <MainBanner/>
        </div>
      </div>
    </div>

    <!-- 任务详情弹框 -->
    <TaskDetailModal
      :visible="showModal"
      :task="selectedTask"
      :loading="detailLoading"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, computed, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import TaskDetailModal from './TaskDetailModal.vue'
import MainBanner from '@/components/advertisement/MainBanner.vue'
import {getCalendarDateTasks} from "@/api/ruankao/calendar/calendarDate";

interface Task {
  id: number
  sortOrder: number
  planTitle: string
  planDescription: string
  calendarDate: string
  isFinished: boolean
}

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const detailLoading = ref(false)
const tasks = ref<Task[]>([])
const showModal = ref(false)
const selectedTask = ref<Task | null>(null)
const showBanner = ref(true) // 控制广告位显示

// 格式化日期显示
const formattedDate = computed(() => {
  if (!route.query.date) return ''
  const date = new Date(route.query.date as string)
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const weekday = weekdays[date.getDay()]
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${weekday}`
})

// 计算已完成任务数量
const completedTasks = computed(() => {
  return tasks.value.filter(task => task.isFinished).length
})

// 获取任务状态类名
const getTaskStatusClass = (isFinished: boolean) => {
  if (isFinished) return 'completed'
  return 'not-started'
}

// 获取任务状态文本
const getTaskStatusText = (isFinished: boolean) => {
  if (isFinished) return '已完成'
  return '未开始'
}

// 获取任务类型
const getTaskType = (title: string) => {
  if (title.includes('选择')) return '选择题'
  if (title.includes('案例')) return '案例题'
  if (title.includes('论文')) return '论文题'
  if (title.includes('文章')) return '阅读题'
  return '综合题'
}

// 获取任务列表
const fetchTasks = async () => {
  try {
    loading.value = true
    tasks.value = await getCalendarDateTasks({calendarDateStr: route.query.date as string})
  } catch (error) {
    console.error('获取任务列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 打开任务详情
const openTaskDetail = (task: Task) => {
  selectedTask.value = task
  showModal.value = true
}

// 关闭弹框
const closeModal = () => {
  showModal.value = false
  selectedTask.value = null
  fetchTasks()
}

// 跳转到学习计划
const goToStudyPlan = () => {
  router.push('/ruankao/study-plan')
}

// 监听路由变化
watch(
  () => route.query.date,
  (newDate, oldDate) => {
    if (newDate !== oldDate) {
      fetchTasks()
    }
  }
)

onMounted(() => {
  fetchTasks()
})
</script>

<style scoped>
.study-task-page {
  padding: 20px;
  max-width: 1200px;
  margin: 70px auto 20px;
  height: calc(100vh - 90px);
  min-height: calc(100vh - 90px) !important;
  overflow-y: auto;
  position: relative;
  background:
    /* 渐变背景 */
    linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%),
      /* 装饰性圆点图案 */
    radial-gradient(circle at 10% 20%, rgba(102, 126, 234, 0.1) 0%, transparent 2%),
    radial-gradient(circle at 90% 80%, rgba(118, 75, 162, 0.1) 0%, transparent 2%),
    radial-gradient(circle at 30% 70%, rgba(240, 147, 251, 0.1) 0%, transparent 3%),
    radial-gradient(circle at 70% 30%, rgba(79, 172, 254, 0.1) 0%, transparent 3%);
  background-blend-mode: overlay, normal, normal, normal, normal;
}

/* 页面头部装饰 */
.page-header-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.15;
  filter: blur(20px);
}

.circle-1 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  top: -200px;
  right: -200px;
  animation: float 15s ease-in-out infinite;
}

.circle-2 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #f093fb, #f5576c);
  bottom: -150px;
  left: -150px;
  animation: float 18s ease-in-out infinite reverse;
}

.circle-3 {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  top: 30%;
  left: 10%;
  animation: float 12s ease-in-out infinite;
}

/* 添加浮动动画 */
@keyframes float {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(-20px, -20px) rotate(5deg);
  }
  50% {
    transform: translate(0, -40px) rotate(0deg);
  }
  75% {
    transform: translate(20px, -20px) rotate(-5deg);
  }
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
}

/* 添加网格背景装饰 */
.study-task-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    linear-gradient(rgba(102, 126, 234, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(102, 126, 234, 0.05) 1px, transparent 1px);
  background-size: 30px 30px;
  z-index: -1;
}

/* 背景光晕效果 */
.background-glow {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -2;
  background:
    radial-gradient(ellipse at 10% 20%, rgba(102, 126, 234, 0.15) 0%, transparent 30%),
    radial-gradient(ellipse at 90% 80%, rgba(118, 75, 162, 0.15) 0%, transparent 30%),
    radial-gradient(ellipse at 50% 50%, rgba(240, 147, 251, 0.1) 0%, transparent 40%);
}

/* 粒子效果装饰 */
.particle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
  animation: particle-float 8s infinite linear;
}

@keyframes particle-float {
  0% {
    transform: translateY(0) translateX(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) translateX(100px) rotate(360deg);
    opacity: 0;
  }
}

/* 页面头部样式 */
.page-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 30px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.85);
  box-shadow:
    0 15px 35px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(229, 231, 235, 0.3);
  position: relative;
  overflow: hidden;
  animation: fadeInUp 0.6s ease-out 0.1s both;
}

.page-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2, #f093fb, #4facfe);
}

.page-header::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, transparent 30%),
    linear-gradient(-135deg, rgba(118, 75, 162, 0.05) 0%, transparent 30%);
  pointer-events: none;
}

.header-badge {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: white;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.page-title {
  color: #1e40af;
  font-size: 2.8rem;
  font-weight: 800;
  letter-spacing: 1px;
  margin: 0 0 10px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, #1e40af, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.task-date {
  color: #6b7280;
  font-size: 1.3rem;
  margin-bottom: 15px;
  font-weight: 500;
}

.header-subtitle {
  color: #8b5cf6;
  font-size: 1.1rem;
  font-weight: 500;
  opacity: 0.9;
}

/* 主要内容区域 */
.main-content {
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 30px;
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

/* 左侧内容 */
.content-left {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

/* 右侧广告 */
.content-right {
  display: flex;
  flex-direction: column;
}

.ad-banner-container {
  position: sticky;
  top: 20px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  animation: fadeInUp 0.6s ease-out 0.3s both;
}

/* 任务统计 */
.task-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.85);
  border-radius: 16px;
  padding: 20px;
  box-shadow:
    0 10px 25px rgba(0, 0, 0, 0.08),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 15px;
  transition: all 0.3s ease;
  border: 1px solid rgba(229, 231, 235, 0.5);
  backdrop-filter: blur(5px);
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 45px;
  height: 45px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.stat-card:nth-child(1) .stat-icon {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.stat-card:nth-child(2) .stat-icon {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
}

.stat-card:nth-child(3) .stat-icon {
  background: linear-gradient(135deg, #f093fb, #f5576c);
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 3px;
}

.stat-label {
  color: #6b7280;
  font-size: 0.85rem;
  font-weight: 500;
}

/* 加载状态样式 */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.spinner-container {
  text-align: center;
  padding: 40px;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(229, 231, 235, 0.3);
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #e5e7eb;
  border-top: 5px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

.loading-text {
  color: #6b7280;
  font-size: 1.2rem;
  font-weight: 500;
}

/* 任务列表样式 */
.task-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.task-item {
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border-radius: 20px;
  overflow: hidden;
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.08),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(229, 231, 235, 0.5);
  transform: translateY(0);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(5px);
}

.task-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
}

.task-item-0::before {
  background: linear-gradient(90deg, #667eea, #764ba2);
}

.task-item-1::before {
  background: linear-gradient(90deg, #4facfe, #00f2fe);
}

.task-item-2::before {
  background: linear-gradient(90deg, #f093fb, #f5576c);
}

.task-item-3::before {
  background: linear-gradient(90deg, #5ee7df, #b490ca);
}

.task-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.task-card {
  padding: 25px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.task-header {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 20px;
}

.task-icon {
  width: 45px;
  height: 45px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.task-item-0 .task-icon {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.task-item-1 .task-icon {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
}

.task-item-2 .task-icon {
  background: linear-gradient(135deg, #f093fb, #f5576c);
}

.task-item-3 .task-icon {
  background: linear-gradient(135deg, #5ee7df, #b490ca);
}

.task-info {
  flex: 1;
}

.task-title {
  margin: 0 0 10px 0;
  color: #1f2937;
  font-size: 1.3rem;
  font-weight: 700;
  line-height: 1.4;
}

.task-description {
  margin: 0;
  color: #6b7280;
  font-size: 1rem;
  line-height: 1.6;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid #e5e7eb;
}

.task-meta {
  display: flex;
  gap: 10px;
}

.task-type, .task-status {
  padding: 5px 10px;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 600;
}

.task-type {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.task-status {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.task-status.completed {
  background: linear-gradient(135deg, #52c41a, #73d13d);
  color: white;
  box-shadow: 0 4px 12px rgba(82, 196, 26, 0.3);
}

.task-status.pending {
  background: linear-gradient(135deg, #faad14, #ffc53d);
  color: white;
  box-shadow: 0 4px 12px rgba(250, 173, 20, 0.3);
}

.task-status.not-started {
  background: linear-gradient(135deg, #bfbfbf, #d9d9d9);
  color: #1f1f1f;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.complete-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 30px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.complete-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.5);
}

/* 空状态样式 */
.no-tasks {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.empty-state {
  text-align: center;
  padding: 40px;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(229, 231, 235, 0.3);
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 25px;
  color: #9ca3af;
}

.empty-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 15px 0;
}

.empty-text {
  color: #6b7280;
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 0 0 30px 0;
}

.empty-action-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 30px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.empty-action-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.5);
}

/* 动画效果 */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .main-content {
    grid-template-columns: 1fr;
  }

  .content-right {
    order: -1;
  }

  .ad-banner-container {
    position: static;
  }

  .task-stats {
    grid-template-columns: repeat(3, 1fr);
  }

  .study-task-page {
    margin: 70px auto 20px;
  }
}

@media (max-width: 768px) {
  .study-task-page {
    padding: 15px;
    margin: 70px auto 15px;
    min-height: calc(100vh - 85px);
  }

  .page-header {
    padding: 25px 20px;
  }

  .page-title {
    font-size: 2.2rem;
  }

  .task-date {
    font-size: 1.1rem;
  }

  .main-content {
    gap: 20px;
  }

  .task-stats {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .stat-card {
    padding: 15px;
  }

  .stat-icon {
    width: 40px;
    height: 40px;
  }

  .stat-number {
    font-size: 1.6rem;
  }

  .task-card {
    padding: 20px;
  }

  .task-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .task-icon {
    width: 40px;
    height: 40px;
  }

  .task-title {
    font-size: 1.2rem;
  }

  .task-description {
    font-size: 0.95rem;
  }

  .task-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .task-meta {
    width: 100%;
    justify-content: space-between;
  }

  .complete-btn {
    width: 100%;
    justify-content: center;
    padding: 12px;
  }

  .empty-state {
    padding: 30px 20px;
  }

  .empty-icon {
    font-size: 60px;
  }

  .empty-title {
    font-size: 1.6rem;
  }

  .decoration-circle {
    display: none;
  }
}
</style>
