<!-- src/components/ruankao/ExamCalendar.vue -->
<template>
  <div class="exam-calendar">
    <div class="calendar-header">
      <button class="nav-button" @click="prevMonth">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="current-month">{{ currentMonthYear }}</div>
      <button class="nav-button" @click="nextMonth">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
    <div class="calendar-grid">
      <div class="weekdays">
        <div class="weekday" v-for="day in weekdays" :key="day">{{ day }}</div>
      </div>
      <div class="days">
        <div
          v-for="(day, index) in days"
          :key="index"
          class="day"
          :class="{
            'empty': !day,
            'today': isToday(day),
            'past': isPast(day),
            'future': isFuture(day),
            'selected': isSelected(day),
            'has-task': day && hasTask(day),
            'weekend': day && (day.getDay() === 0 || day.getDay() === 6)
          }"
          @click="selectDay(day)"
        >
          <span v-if="day" class="day-number">{{ day.getDate() }}</span>
          <div v-if="day && hasTask(day)" class="task-indicator"></div>
        </div>
      </div>
    </div>

    <!-- 固定提示区域 -->
    <div class="calendar-instruction">
      <p>💡 点击日期查看当日学习任务</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getCalendarDateTaskCount } from '@/api/ruankao/calendar/calendarDate'

const props = defineProps<{
  endDate: Date
}>()

const router = useRouter()
const currentDate = new Date()
const currentMonth = ref(currentDate.getMonth())
const currentYear = ref(currentDate.getFullYear())
const taskDays = ref<Set<string>>(new Set())

const weekdays = ['日', '一', '二', '三', '四', '五', '六']

// 当前月份和年份
const currentMonthYear = computed(() => {
  return `${currentYear.value}年${currentMonth.value + 1}月`
})

// 获取当月天数
const daysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate()
}

// 获取当月第一天是周几
const firstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay()
}

// 生成日历天数数组
const days = computed(() => {
  const daysArray: (Date | null)[] = []
  const daysCount = daysInMonth(currentYear.value, currentMonth.value)
  const firstDay = firstDayOfMonth(currentYear.value, currentMonth.value)

  // 添加空白天
  for (let i = 0; i < firstDay; i++) {
    daysArray.push(null)
  }

  // 添加实际日期
  for (let i = 1; i <= daysCount; i++) {
    daysArray.push(new Date(currentYear.value, currentMonth.value, i))
  }

  return daysArray
})

// 检查是否为今天
const isToday = (date: Date | null) => {
  if (!date) return false
  return date.toDateString() === currentDate.toDateString()
}

// 检查是否为过去日期
const isPast = (date: Date | null) => {
  if (!date) return false
  return date < new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())
}

// 检查是否为未来日期
const isFuture = (date: Date | null) => {
  if (!date) return false
  return date > new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())
}

// 检查是否为选中日期
const selectedDate = ref<string | null>(null)
const isSelected = (date: Date | null) => {
  if (!date) return false
  return selectedDate.value === formatDate(date)
}

// 检查是否有任务
const hasTask = (date: Date | null) => {
  if (!date) return false
  const dateStr = formatDate(date)
  return taskDays.value.has(dateStr)
}

// 格式化日期为 YYYY-MM-DD 格式
const formatDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 上一月
const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

// 下一月
const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

// 选择日期
const selectDay = (date: Date | null) => {
  if (!date) return

  // 允许点击所有日期（包括过去的日期）
  const dateStr = formatDate(date)
  selectedDate.value = dateStr

  // 跳转到任务页面
  router.push({
    name: 'StudyTask',
    query: { date: dateStr }
  })
}

// 获取任务数据
const fetchTaskData = async () => {
  try {
    // 获取当前月份的任务数据
    const startDate = new Date(currentYear.value, currentMonth.value, 1)
    const endDate = new Date(currentYear.value, currentMonth.value + 1, 0)

    const response = await getCalendarDateTaskCount({
      startDate: formatDate(startDate),
      endDate: formatDate(endDate)
    })

    if (response) {
      taskDays.value = new Set(response)
    }
  } catch (error) {
    console.error('获取任务数据失败:', error)
    // 出错时清空任务数据
    taskDays.value = new Set()
  }
}

// 监听月份变化
watch([currentMonth, currentYear], () => {
  fetchTaskData()
}, { immediate: false })

// 初始化
fetchTaskData()
</script>

<style scoped>
.exam-calendar {
  max-width: 100%;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  position: relative;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding: 0 15px;
}

.nav-button {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  color: white;
}

.nav-button:hover {
  transform: translateY(-3px) scale(1.1);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.nav-button:active {
  transform: translateY(-1px) scale(1.05);
}

.current-month {
  font-size: 22px;
  font-weight: 700;
  color: #2c3e50;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.calendar-grid {
  display: flex;
  flex-direction: column;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 15px;
  font-size: 16px;
}

.weekday {
  padding: 12px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.day-number {
  font-size: 18px;
  font-weight: 600;
  z-index: 1;
  transition: all 0.2s;
}

.day:not(.empty):hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, #f0f4ff, #e6e9ff);
}

.day.today {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
  font-weight: 700;
}

.day.today:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.5);
}

.day.selected {
  background: linear-gradient(135deg, #764ba2, #667eea);
  color: white;
  box-shadow: 0 6px 16px rgba(118, 75, 162, 0.4);
}

.day.selected:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 20px rgba(118, 75, 162, 0.5);
}

.day.past {
  color: #a0aec0;
}

.day.past:not(.today):not(.selected):hover {
  background: #f7fafc;
  color: #718096;
}

.day.weekend {
  color: #e53e3e;
}

.day.weekend.today,
.day.weekend.selected {
  color: white;
}

/* 任务标记样式 - 更加活泼 */
.task-indicator {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 10px;
  height: 10px;
  background: linear-gradient(135deg, #ff6b6b, #ff8e53);
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 2px 6px rgba(255, 107, 107, 0.4);
  z-index: 2;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 2px 6px rgba(255, 107, 107, 0.4);
  }
  50% {
    transform: scale(1.2);
    box-shadow: 0 4px 12px rgba(255, 107, 107, 0.6);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 2px 6px rgba(255, 107, 107, 0.4);
  }
}

/* 为有任务的日期添加额外的视觉效果 */
.day.has-task .day-number {
  font-weight: 700;
  color: #ff6b6b;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.day.today.has-task .day-number,
.day.selected.has-task .day-number {
  color: white;
  text-shadow: none;
}

.day.empty {
  cursor: default;
  background: transparent;
  box-shadow: none;
}

.day.empty:hover {
  background: transparent;
  transform: none;
  box-shadow: none;
}

/* 日历使用说明 */
.calendar-instruction {
  margin-top: 20px;
  padding: 12px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 12px;
  text-align: center;
  font-size: 14px;
  color: #667eea;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .exam-calendar {
    padding: 15px;
  }

  .calendar-header {
    margin-bottom: 20px;
  }

  .nav-button {
    width: 36px;
    height: 36px;
  }

  .current-month {
    font-size: 20px;
  }

  .weekdays {
    font-size: 14px;
    margin-bottom: 10px;
  }

  .weekday {
    padding: 10px 0;
  }

  .day-number {
    font-size: 16px;
  }

  .task-indicator {
    width: 8px;
    height: 8px;
    top: 5px;
    right: 5px;
  }

  .calendar-instruction {
    font-size: 13px;
    padding: 10px;
  }
}

@media (max-width: 480px) {
  .exam-calendar {
    padding: 12px;
  }

  .current-month {
    font-size: 18px;
  }

  .weekdays {
    font-size: 12px;
  }

  .day-number {
    font-size: 14px;
  }
}
</style>
