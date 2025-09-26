<!-- src/views/ruankao/home/StudyTask.vue -->
<template>
  <div class="study-task-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">今日学习任务</h1>
        <div class="task-date">{{ formattedDate }}</div>
      </div>
    </div>

    <!-- 任务列表 -->
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p class="loading-text">加载中...</p>
    </div>

    <div v-else-if="tasks.length > 0" class="task-list">
      <div
        v-for="task in tasks"
        :key="task.id"
        class="task-item"
        @click="openTaskDetail(task)"
      >
        <div class="task-card">
          <div class="task-header">
            <div class="task-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 12L12 12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 16L12 16.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 8L12 8.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="task-info">
              <h3 class="task-title">{{ task.planTitle }}</h3>
              <p class="task-description">{{ task.planDescription }}</p>
            </div>
          </div>
          <div class="task-footer">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: '100%' }"></div>
            </div>
            <button class="complete-btn">
              <span class="btn-text">去完成</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="no-tasks">
      <div class="empty-icon">📚</div>
      <p class="empty-text">暂无学习任务</p>
      <p class="empty-subtext">请稍后查看或联系管理员</p>
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
import {useRoute} from 'vue-router'
import TaskDetailModal from './TaskDetailModal.vue'
import {getCalendarDateTasks} from "@/api/calendar/calendarDate";

interface Task {
  id: number
  sortOrder: number
  planTitle: string
  planDescription: string
  calendarDate: string
}

const route = useRoute()
const loading = ref(true)
const detailLoading = ref(false)
const tasks = ref<Task[]>([])
const showModal = ref(false)
const selectedTask = ref<Task | null>(null)

// 格式化日期显示
const formattedDate = computed(() => {
  if (!route.query.date) return ''
  const date = new Date(route.query.date as string)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
})

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
  margin: 70px auto;
  height: calc(100vh - 70px);
  overflow-y: auto;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* 页面头部样式 */
.page-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 20px;
  border-radius: 16px;
  background: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(229, 231, 235, 0.3);
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.page-title {
  color: #1e40af;
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.task-date {
  color: #6b7280;
  font-size: 1.2rem;
  margin-top: 10px;
  font-weight: 500;
}

/* 加载状态样式 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #1e40af;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: #6b7280;
  font-size: 1.1rem;
}

/* 任务列表样式 */
.task-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.task-item {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  background: white;
  border: 1px solid #e5e7eb;
  transform: translateY(0);
}

.task-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.task-card {
  padding: 24px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.task-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
}

.task-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.task-info {
  flex: 1;
}

.task-title {
  margin: 0 0 8px 0;
  color: #1f2937;
  font-size: 1.3rem;
  font-weight: 600;
  line-height: 1.4;
}

.task-description {
  margin: 0;
  color: #6b7280;
  font-size: 1rem;
  line-height: 1.5;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.progress-bar {
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
  width: 100px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #1e40af, #3b82f6);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.complete-btn {
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
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
  box-shadow: 0 4px 15px rgba(30, 64, 175, 0.3);
}

.complete-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(30, 64, 175, 0.4);
}

/* 空状态样式 */
.no-tasks {
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
  font-size: 1.1rem;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
  color: #9ca3af;
}

.empty-text {
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 10px;
}

.empty-subtext {
  color: #9ca3af;
  font-size: 0.9rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .study-task-page {
    padding: 15px;
    margin: 50px auto;
  }

  .page-title {
    font-size: 2rem;
  }

  .task-date {
    font-size: 1rem;
  }

  .task-item {
    padding: 16px;
  }

  .task-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .task-icon {
    width: 32px;
    height: 32px;
  }

  .task-title {
    font-size: 1.1rem;
  }

  .task-description {
    font-size: 0.9rem;
  }

  .complete-btn {
    padding: 10px 16px;
    font-size: 0.9rem;
  }

  .progress-bar {
    width: 80px;
  }
}
</style>
