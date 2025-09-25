<!-- src/views/ruankao/home/StudyTask.vue -->
<template>
  <div class="study-task-page">
    <h1 class="page-title">今日学习任务</h1>
    <div class="task-date">{{ formattedDate }}</div>

    <div v-if="loading" class="loading">
      加载中...
    </div>

    <div v-else-if="tasks.length > 0" class="task-list">
      <div
        v-for="task in tasks"
        :key="task.id"
        class="task-item"
      >
        <div class="task-info">
          <h3>{{ task.planTitle }}</h3>
          <p>{{ task.planDescription }}</p>
        </div>
        <button
          class="complete-btn"
          @click="openTaskDetail(task)"
        >
          去完成
        </button>
      </div>
    </div>

    <div v-else class="no-tasks">
      暂无学习任务
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
    console.log(1)
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
}

.page-title {
  text-align: center;
  color: #333;
  margin-bottom: 10px;
}

.task-date {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
  font-size: 18px;
}

.loading, .no-tasks {
  text-align: center;
  padding: 50px 20px;
  color: #666;
  font-size: 16px;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.task-item:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.task-info h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.task-info p {
  margin: 0;
  color: #666;
}

.complete-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 30px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.complete-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

@media (max-width: 768px) {
  .task-item {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .complete-btn {
    padding: 8px 16px;
  }
}
</style>
