<!-- src/views/kn/console/exam-calendar/ExamCalendar.vue -->
<template>
  <div class="exam-calendar-container">
    <a-card>
      <div class="header-section">
        <a-date-picker
          v-model:value="selectedDate"
          placeholder="请选择日期"
          @change="onDateChange"
          style="margin-right: 10px"
        />
        <a-button type="primary" @click="openAddCalendarDateModal"
                  :disabled="!selectedDate">新增日程
        </a-button>
      </div>

      <div class="calendar-content" v-if="selectedDate">
        <a-list
          :data-source="calendarDates"
          :loading="loading"
          item-layout="vertical"
        >
          <template #renderItem="{ item }">
            <a-list-item>
              <a-list-item-meta>
                <template #title>
                  <div class="calendar-item-header">
                    <span class="plan-title">{{ item.planTitle }}</span>
                    <div class="actions">
                      <a @click="openEditCalendarDateModal(item)">编辑</a>
                      <a-divider type="vertical"/>
                      <a-popconfirm
                        title="确定要删除这个日程吗?"
                        ok-text="确定"
                        cancel-text="取消"
                        @confirm="handleDeleteCalendarDate(item.id)"
                      >
                        <a>删除</a>
                      </a-popconfirm>
                    </div>
                  </div>
                </template>
                <template #description>
                  <div class="plan-description">{{ item.planDescription }}</div>
                </template>
              </a-list-item-meta>
              <div class="associated-questions">
                <div class="section-title">关联问题</div>
                <a-table
                  :columns="questionColumns"
                  :data-source="item.associatedQuestions.records"
                  :pagination="true"
                  size="small"
                  :scroll="{ y: 200 }"
                >
                  <template #bodyCell="{ column, record, index }">
                    <template v-if="column.key === 'type'">
                      <a-tag v-if="record.type === 'CHOICE'" color="blue">选择题</a-tag>
                      <a-tag v-else-if="record.type === 'CASE'" color="green">案例题</a-tag>
                      <a-tag v-else-if="record.type === 'ESSAY'" color="orange">论文题</a-tag>
                      <a-tag v-else-if="record.type === 'ARTICLE'" color="purple">文章</a-tag>
                      <a-tag v-else>未知</a-tag>
                    </template>
                    <template v-else-if="column.key === 'title'">
                      <a-tooltip :title="record.title">
                        <span>{{ truncateText(record.title, 30) }}</span>
                      </a-tooltip>
                    </template>
                    <template v-else-if="column.key === 'difficulty'">
                      <a-tag v-if="record.difficulty === 1">简单</a-tag>
                      <a-tag v-else-if="record.difficulty === 2" color="orange">中等</a-tag>
                      <a-tag v-else-if="record.difficulty === 3" color="red">困难</a-tag>
                    </template>
                    <template v-else-if="column.key === 'score'">
                      {{ record.score }}
                    </template>
                    <template v-else-if="column.key === 'sortOrder'">
                      <a-input-number
                        v-model:value="record.sortOrder"
                        :min="1"
                        @change="(value) => handleSortOrderChange(index, value)"
                      />
                    </template>
                    <template v-else-if="column.key === 'action'">
                      <a @click="removeQuestionFromCalendar(item.id, record.id)">移除</a>
                    </template>
                  </template>
                </a-table>
                <div class="add-question-button">
                  <a-button @click="openManageQuestionsModal(item)">关联问题</a-button>
                </div>
              </div>
            </a-list-item>
          </template>
        </a-list>
      </div>
    </a-card>

    <!-- 新增/编辑日程模态框 -->
    <a-modal
      v-model:open="calendarDateModalVisible"
      :title="isEditing ? '编辑日程' : '新增日程'"
      @ok="handleSaveCalendarDate"
      @cancel="handleCancelCalendarDate"
      :confirm-loading="confirmLoading"
    >
      <a-form :model="calendarDateForm" ref="calendarDateFormRef">
        <a-form-item
          label="计划标题"
          name="planTitle"
          :rules="[{ required: true, message: '请输入计划标题' }]"
        >
          <a-input v-model:value="calendarDateForm.planTitle"
                   placeholder="请输入计划标题"/>
        </a-form-item>
        <a-form-item
          label="计划描述"
          name="planDescription"
          :rules="[{ required: true, message: '请输入计划描述' }]"
        >
          <a-textarea v-model:value="calendarDateForm.planDescription"
                      placeholder="请输入计划描述"/>
        </a-form-item>
        <a-form-item
          label="排序"
          name="sortOrder"
          :rules="[{ required: true, message: '请输入排序' }]"
        >
          <a-input-number v-model:value="calendarDateForm.sortOrder" :min="1"/>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 关联问题管理模态框 -->
    <manage-calendar-questions-modal
      ref="manageQuestionsModal"
      @questionsAssociated="fetchCalendarDates"
    />

    <BackToHome/>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted} from 'vue'
import {message} from 'ant-design-vue'
import dayjs, {Dayjs} from 'dayjs'
import {
  createCalendarDate,
  updateCalendarDate,
  deleteCalendarDate,
  listCalendarDatesByDate
} from '../../../api/calendar/calendarDate.ts'
import ManageCalendarQuestionsModal from './ManageCalendarQuestions.vue'
import BackToHome from "@/components/BackToHome.vue";

// 状态管理
const selectedDate = ref<Dayjs | null>(null)
const calendarDates = ref<any[]>([])
const loading = ref(false)
const confirmLoading = ref(false)

// 模态框相关
const calendarDateModalVisible = ref(false)
const isEditing = ref(false)
const editingCalendarDateId = ref<number | null>(null)

// 表单引用
const calendarDateFormRef = ref()

// 表单数据
const calendarDateForm = reactive({
  planTitle: '',
  planDescription: '',
  sortOrder: 1
})

// 表格列定义
const questionColumns = [
  {
    title: '题目类型',
    dataIndex: 'type',
    key: 'type',
    width: 100
  },
  {
    title: '题目内容',
    dataIndex: 'title',
    key: 'title',
    width: 250
  },
  {
    title: '难度等级',
    dataIndex: 'difficulty',
    key: 'difficulty',
    width: 100
  },
  {
    title: '分数',
    dataIndex: 'score',
    key: 'score',
    width: 80
  },
  {
    title: '排序',
    dataIndex: 'sortOrder',
    key: 'sortOrder',
    width: 100
  },
]

// 日期变更处理
const onDateChange = (date: Dayjs | null) => {
  if (date) {
    fetchCalendarDates()
  } else {
    calendarDates.value = []
  }
}

// 在 fetchCalendarDates 函数中，确保 associatedQuestions 是数组
const fetchCalendarDates = async () => {
  if (!selectedDate.value) return

  loading.value = true
  try {
    const res: any = await listCalendarDatesByDate({calendarDateStr: selectedDate.value.format('YYYY-MM-DD')})

    calendarDates.value = res
    console.log('获取日程成功', calendarDates)
  } catch (error) {
    console.error('获取日程失败', error)
    message.error('获取日程失败')
  } finally {
    loading.value = false
  }
}


// 打开新增日程模态框
const openAddCalendarDateModal = () => {
  isEditing.value = false
  editingCalendarDateId.value = null
  resetCalendarDateForm()
  calendarDateModalVisible.value = true
}

// 打开编辑日程模态框
const openEditCalendarDateModal = (record: any) => {
  isEditing.value = true
  editingCalendarDateId.value = record.id
  calendarDateForm.planTitle = record.planTitle
  calendarDateForm.planDescription = record.planDescription
  calendarDateForm.sortOrder = record.sortOrder
  calendarDateModalVisible.value = true
}

// 重置日程表单
const resetCalendarDateForm = () => {
  calendarDateForm.planTitle = ''
  calendarDateForm.planDescription = ''
  calendarDateForm.sortOrder = 1
}

// 保存日程
const handleSaveCalendarDate = async () => {
  if (!selectedDate.value) return

  confirmLoading.value = true
  try {
    await calendarDateFormRef.value.validate()

    const formData = {
      calendarDate: selectedDate.value.format('YYYY-MM-DD'),
      planTitle: calendarDateForm.planTitle,
      planDescription: calendarDateForm.planDescription,
      sortOrder: calendarDateForm.sortOrder,
      contentType: 1, // 1表示问题内容类型
      contentId: 0 // 默认值，后续关联问题时更新
    }

    if (isEditing.value && editingCalendarDateId.value) {
      await updateCalendarDate(editingCalendarDateId.value, formData)
      message.success('日程更新成功')
    } else {
      await createCalendarDate(formData)
      message.success('日程创建成功')
    }

    calendarDateModalVisible.value = false
    fetchCalendarDates()
  } catch (error) {
    console.error('保存日程失败', error)
    message.error('保存日程失败')
  } finally {
    confirmLoading.value = false
  }
}

// 取消日程操作
const handleCancelCalendarDate = () => {
  calendarDateModalVisible.value = false
}

// 删除日程
const handleDeleteCalendarDate = async (id: number) => {
  try {
    await deleteCalendarDate(id)
    message.success('日程删除成功')
    fetchCalendarDates()
  } catch (error) {
    console.error('删除日程失败', error)
    message.error('删除日程失败')
  }
}

// 打开关联问题模态框
const manageQuestionsModal = ref<any>(null)
const currentCalendarDate = ref<any>(null)

const openManageQuestionsModal = (record: any) => {
  currentCalendarDate.value = record
  if (manageQuestionsModal.value) {
    manageQuestionsModal.value.openModal(record)
  }
}

// 处理排序变更
const handleSortOrderChange = async (calendarDateId: number, questionId: number, sortOrder: number) => {
  // 这里应该调用API更新问题排序
  // 由于当前后端没有提供专门的API，我们暂时只在前端更新
  console.log(`更新日程${calendarDateId}中问题${questionId}的排序为${sortOrder}`)
}

// 移除问题
const removeQuestionFromCalendar = async (calendarDateId: number, questionId: number) => {
  // 这里应该调用API移除问题关联
  console.log(`从日程${calendarDateId}中移除问题${questionId}`)
}

// 截断文本
const truncateText = (text: string, maxLength: number) => {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

onMounted(() => {
  // 默认选择今天
  selectedDate.value = dayjs()
  fetchCalendarDates()
})
</script>

<style scoped>
.exam-calendar-container {
  padding: 16px;
  height: calc(100vh);
  overflow-y: auto;
}

.header-section {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.calendar-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.plan-title {
  font-weight: bold;
  font-size: 16px;
}

.plan-description {
  color: #666;
  margin-top: 5px;
}

.associated-questions {
  margin-top: 20px;
  border-top: 1px solid #f0f0f0;
  padding-top: 15px;
}

.section-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
}

.add-question-button {
  margin-top: 10px;
  text-align: center;
}
</style>
