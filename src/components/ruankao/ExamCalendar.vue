<template>
  <div class="exam-calendar">
    <div class="calendar-header">
      <button @click="prevMonth">&lt;</button>
      <h2>{{ currentMonthYear }}</h2>
      <button @click="nextMonth">&gt;</button>
    </div>

    <div class="calendar-grid">
      <div class="weekdays">
        <div v-for="day in weekdays" :key="day" class="weekday">{{ day }}</div>
      </div>

      <div class="days">
        <div
          v-for="(day, index) in days"
          :key="index"
          :class="['day', {
            'empty': !day.date,
            'today': day.isToday,
            'has-content': day.hasContent,
            'past': day.isPast
          }]"
          @click="day.date && !day.isPast && openDayContent(day)"
        >
          <span v-if="day.date">{{ day.date.getDate() }}</span>
        </div>
      </div>
    </div>

    <!-- 每日内容弹窗 -->
    <div v-if="showContentModal" class="modal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <span class="close" @click="closeModal">&times;</span>
        <h3>{{ selectedDate?.toDateString() }}</h3>
        <div v-if="dayContent">
          <h4>{{ dayContent.title }}</h4>
          <p>{{ dayContent.description }}</p>
          <ul>
            <li v-for="item in dayContent.items" :key="item.id">
              <a :href="item.link">{{ item.title }}</a>
            </li>
          </ul>
        </div>
        <div v-else>
          <p>暂无内容</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import router from "@/router";

// 类型定义
interface DayInfo {
  date: Date | null
  isToday: boolean
  isPast: boolean
  hasContent: boolean
}

interface DayContent {
  title: string
  description: string
  items: Array<{
    id: number
    title: string
    link: string
  }>
}

// 配置截止日期（可以作为 prop 传入）
const props = defineProps<{
  endDate: Date
}>()

// 响应式数据
const currentDate = ref(new Date())
const showContentModal = ref(false)
const selectedDate = ref<Date | null>(null)
const dayContent = ref<DayContent | null>(null)

// 星期名称
const weekdays = ['日', '一', '二', '三', '四', '五', '六']

// 当前月份年份显示
const currentMonthYear = computed(() => {
  return `${currentDate.value.getFullYear()}年${currentDate.value.getMonth() + 1}月`
})

// 计算当月天数
const days = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()

  // 当月第一天
  const firstDay = new Date(year, month, 1)
  // 当月最后一天
  const lastDay = new Date(year, month + 1, 0)
  // 当月天数
  const daysInMonth = lastDay.getDate()

  // 第一天是星期几（0-6）
  const firstDayOfWeek = firstDay.getDay()

  // 构建日历数组
  const calendarDays: DayInfo[] = []

  // 添加空白天格
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push({ date: null, isToday: false, isPast: false, hasContent: false })
  }

  // 添加当月日期
  const today = new Date()
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i)
    const isToday = date.toDateString() === today.toDateString()
    const isPast = date < today && !isToday
    // 这里可以根据实际数据判断是否有内容
    const hasContent = Math.random() > 0.3 // 模拟有内容的日期

    calendarDays.push({
      date,
      isToday,
      isPast,
      hasContent
    })
  }

  return calendarDays
})

// 翻页功能
const prevMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1
  )
}

const nextMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1
  )
}

// 打开每日内容
const openDayContent = (day: DayInfo) => {
  if (!day.date) return

  // 修复日期格式化问题，保持本地时区
  const year = day.date.getFullYear()
  const month = String(day.date.getMonth() + 1).padStart(2, '0')
  const date = String(day.date.getDate()).padStart(2, '0')
  const formattedDate = `${year}-${month}-${date}`

  // 跳转到学习任务页面
  router.push({
    name: 'StudyTask',
    query: {
      date: formattedDate
    }
  })
}

// 关闭弹窗
const closeModal = () => {
  showContentModal.value = false
  selectedDate.value = null
  dayContent.value = null
}

// 挂载时初始化
onMounted(() => {
  // 可以根据截止日期调整初始显示月份
  const now = new Date()
  if (now > props.endDate) {
    currentDate.value = new Date(props.endDate)
  } else {
    currentDate.value = now
  }
})
</script>

<!-- 修改 ExamCalendar.vue 中的 <style scoped> 部分 -->
<style scoped>
.exam-calendar {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  max-width: 100%;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 5px;
}

.calendar-header button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 30px;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  font-size: 16px;
  min-width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.calendar-header button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.calendar-header button:active {
  transform: translateY(0);
}

.calendar-header h2 {
  margin: 0;
  color: #333;
  font-weight: 600;
  font-size: 22px;
  text-align: center;
  flex: 1;
}

.calendar-grid {
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  background: white;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.weekday {
  padding: 15px 5px;
  text-align: center;
  font-weight: 600;
  font-size: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: white;
}

.day {
  min-height: 95px;
  padding: 8px;
  border-right: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  background: white;
}

.day:nth-child(7n) {
  border-right: none;
}

.day.empty {
  background: #fafafa;
  cursor: default;
}

.day.today {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: bold;
  box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.2);
}

.day.today .day-number {
  background: rgba(255, 255, 255, 0.2);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.day.has-content::after {
  content: "";
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 6px;
  height: 6px;
  background: #409EFF;
  border-radius: 50%;
  box-shadow: 0 0 0 2px white, 0 0 0 4px #409EFF;
}

.day.has-content.today::after {
  background: white;
  box-shadow: 0 0 0 2px #764ba2, 0 0 0 4px white;
}

.day.past {
  background: #f8f9fa;
  color: #aaa;
  cursor: not-allowed;
}

.day.past.has-content::after {
  background: #ccc;
  box-shadow: 0 0 0 2px #f8f9fa, 0 0 0 4px #ccc;
}

.day:not(.empty):not(.past):hover {
  background: #e3f2fd;
  transform: translateY(-3px);
  z-index: 2;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin: -1px;
  border: 1px solid #bbdefb;
}

.day.today:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
  transform: translateY(-3px);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

.day .day-number {
  display: block;
  text-align: right;
  font-size: 16px;
  font-weight: 500;
  padding: 5px;
}

/* 弹窗样式 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
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

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 20px;
  max-width: 700px;
  width: 90%;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  position: relative;
  animation: slideIn 0.3s ease-out;
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

.close {
  position: absolute;
  top: 20px;
  right: 25px;
  font-size: 32px;
  cursor: pointer;
  color: #999;
  transition: all 0.2s;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.close:hover {
  color: #333;
  background: #f5f5f5;
  transform: rotate(90deg);
}

.modal-content h3 {
  margin-top: 0;
  color: #333;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 15px;
  font-size: 24px;
}

.modal-content h4 {
  color: #409EFF;
  margin: 25px 0 15px 0;
  font-size: 20px;
}

.modal-content p {
  color: #666;
  line-height: 1.6;
  font-size: 16px;
}

.modal-content ul {
  padding-left: 25px;
}

.modal-content li {
  margin-bottom: 12px;
  line-height: 1.5;
}

.modal-content a {
  color: #409EFF;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
  padding: 5px 10px;
  border-radius: 5px;
}

.modal-content a:hover {
  text-decoration: underline;
  background: #ecf5ff;
  transform: translateX(3px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .calendar-header h2 {
    font-size: 18px;
  }

  .calendar-header button {
    padding: 8px 15px;
    font-size: 14px;
    height: 36px;
  }

  .weekday {
    padding: 12px 2px;
    font-size: 14px;
  }

  .day {
    min-height: 60px;
  }

  .day .day-number {
    font-size: 14px;
  }

  .modal-content {
    padding: 20px;
    margin: 10px;
  }

  .modal-content h3 {
    font-size: 20px;
  }

  .close {
    top: 15px;
    right: 15px;
    font-size: 28px;
  }
}

@media (max-width: 480px) {
  .calendar-header {
    margin-bottom: 15px;
  }

  .calendar-header h2 {
    font-size: 16px;
  }

  .calendar-header button {
    padding: 6px 12px;
    font-size: 12px;
    height: 32px;
  }

  .weekday {
    padding: 10px 1px;
    font-size: 12px;
  }

  .day {
    min-height: 50px;
    padding: 5px;
  }

  .day .day-number {
    font-size: 12px;
  }
}
</style>
