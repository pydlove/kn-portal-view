<!-- ManageCalendarQuestions.vue -->
<template>
  <a-modal
    v-model:open="modalVisible"
    :title="`关联问题 - ${calendarDateForm.planTitle}`"
    @ok="handleSave"
    @cancel="handleCancel"
    :confirm-loading="confirmLoading"
    width="80%"
  >
    <div class="manage-questions-container">
      <a-row :gutter="20">
        <!-- 左侧：所有问题列表 -->
        <a-col :span="12">
          <div class="section-title">所有问题</div>
          <div class="search-box">
            <!-- 参考index.vue修改搜索条件 -->
            <a-row :gutter="20" class="search-form">
              <a-col :span="12">
                <a-select
                  v-model:value="searchForm.type"
                  placeholder="请选择题目类型"
                  allow-clear                  style="width: 100%; margin-bottom: 10px"
                >
                  <a-select-option value="CHOICE">选择题</a-select-option>
                  <a-select-option value="CASE">案例题</a-select-option>
                  <a-select-option value="ESSAY">论文题</a-select-option>
                </a-select>
              </a-col>
              <a-col :span="12">
                <a-input-search
                  v-model:value="searchForm.questionText"
                  placeholder="请输入题目内容"
                  @search="fetchQuestions"                  style="margin-bottom: 10px"
                />
              </a-col>
            </a-row>
            <a-button @click="resetSearch" style="margin-bottom: 10px">重置</a-button>
          </div>
          <div class="question-list-container">
            <a-table
              :columns="allQuestionsColumns"
              :data-source="allQuestionsList"
              :loading="allQuestionsLoading"
              :pagination="allQuestionsPagination"
              @change="handleAllQuestionsTableChange"
              :row-selection="{
                selectedRowKeys: selectedQuestionKeys,
                onChange: onSelectChange
              }"
              size="small"
              :scroll="{ y: 300 }"
              rowKey="id"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'type'">
                  <a-tag v-if="record.type === 'CHOICE'" color="blue">选择题</a-tag>
                  <a-tag v-else-if="record.type === 'CASE'" color="green">案例题</a-tag>
                  <a-tag v-else-if="record.type === 'ESSAY'" color="orange">论文题</a-tag>
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
              </template>
            </a-table>
          </div>
        </a-col>

        <!-- 右侧：已关联问题列表 -->
        <a-col :span="12">
          <div class="section-title">已关联问题</div>
          <div class="selected-questions-container">
            <a-table
              :columns="selectedQuestionsColumns"
              :data-source="selectedQuestionsList"
              :pagination="selectQuestionsPagination"
              size="small"
              :scroll="{ y: 300 }"
              @change="handleSelectedQuestionsTableChange"
            >
              <template #bodyCell="{ column, record, index }">
                <template v-if="column.key === 'type'">
                  <a-tag v-if="record.type === 'CHOICE'" color="blue">选择题</a-tag>
                  <a-tag v-else-if="record.type === 'CASE'" color="green">案例题</a-tag>
                  <a-tag v-else-if="record.type === 'ESSAY'" color="orange">论文题</a-tag>
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
                  <a @click="removeQuestion(index)">移除</a>
                </template>
              </template>
            </a-table>
          </div>

          <div class="actions">
            <a-button @click="addAllQuestions"
                      :disabled="selectedQuestionKeys.length === 0">
              添加选中
            </a-button>
          </div>
        </a-col>
      </a-row>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import {reactive, ref} from 'vue'
import {message} from 'ant-design-vue'
import {
  getCalendarDateQuestions,
  saveCalendarDateQuestions
} from '@/api/calendar/calendarDate'
import {getQuestionPage} from "@/api/exam/exam";
import {RkExamQuestion} from "@/views/console/exam/exam";

const modalVisible = ref(false)
const confirmLoading = ref(false)

// 日程表单数据
const calendarDateForm = reactive({
  id: undefined as number | undefined,
  planTitle: ''
})

// 所有问题列表
const allQuestionsList = ref<RkExamQuestion[]>([])
const allQuestionsLoading = ref(false)
const selectedQuestionKeys = ref<number[]>([])

// 已选中的问题列表
const selectedQuestionsList = ref<RkExamQuestion[]>([])

const handleSelectedQuestionsTableChange = (pag: any) => {
  selectQuestionsPagination.current = pag.current
  selectQuestionsPagination.pageSize = pag.pageSize
  // 注意：这里不需要重新获取数据，因为已关联问题已经在内存中
  // 如果数据量很大，可以考虑实现服务端分页
}

// 分页参数
const allQuestionsPagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

const selectQuestionsPagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

// 搜索表单
const searchForm = reactive({
  type: undefined as string | undefined,
  questionText: ''
})

// 表格列定义
const allQuestionsColumns = [
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
]

const selectedQuestionsColumns = [
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
    width: 200
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
  {
    title: '操作',
    key: 'action',
    width: 80,
    fixed: 'right'
  }
]

// 获取题目类型文本
const getTypeText = (type: string) => {
  switch (type) {
    case 'choice':
      return '选择题';
    case 'case':
      return '案例题';
    case 'essay':
      return '论文题';
    default:
      return '未知';
  }
}

// 获取题目类型颜色
const getTypeColor = (type: string) => {
  switch (type) {
    case 'choice':
      return 'blue';
    case 'case':
      return 'green';
    case 'essay':
      return 'orange';
    default:
      return 'default';
  }
}

// 截断文本
const truncateText = (text: string, maxLength: number) => {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

// 选择变化
const onSelectChange = (selectedKeys: number[]) => {
  selectedQuestionKeys.value = selectedKeys || []
}

// 添加选中的问题
const addAllQuestions = () => {
  // 根据选中的ID获取对应的问题对象
  const selectedQuestions = allQuestionsList.value.filter(
    item => selectedQuestionKeys.value.includes(item.id)
  )

  // 过滤掉已存在的问题
  const newQuestions = selectedQuestions.filter(
    item => !selectedQuestionsList.value.some(q => q.questionId === item.id)
  )

  // 获取当前最大排序值
  const maxOrder = selectedQuestionsList.value.length > 0
    ? Math.max(...selectedQuestionsList.value.map(item => item.sortOrder))
    : 0

  // 添加到已选列表并设置排序
  newQuestions.forEach((question, index) => {
    selectedQuestionsList.value.push({
      id: question.id,
      type: question.type,
      title: question.title,
      score: question.score,
      difficulty: question.difficulty,
      status: question.status,
      createTime: question.createTime,
      updateTime: question.updateTime,
      deletedStatus: question.deletedStatus,
      sortOrder: maxOrder + index + 1
    })
  })

  // 清空选择
  selectedQuestionKeys.value = []
}

// 移除问题
const removeQuestion = (index: number) => {
  selectedQuestionsList.value.splice(index, 1)

  // 重新排序
  selectedQuestionsList.value.forEach((item, i) => {
    item.sortOrder = i + 1
  })
}

// 处理排序变化
const handleSortOrderChange = (index: number, value: number | null) => {
  if (value !== null && value > 0) {
    selectedQuestionsList.value[index].sortOrder = value

    // 重新排序整个列表
    selectedQuestionsList.value.sort((a, b) => a.sortOrder - b.sortOrder)

    // 重新分配连续的排序号
    selectedQuestionsList.value.forEach((item, i) => {
      item.sortOrder = i + 1
    })
  }
}

// 打开模态框
const openModal = async (calendarDate: any) => {
  modalVisible.value = true
  calendarDateForm.id = calendarDate.id
  calendarDateForm.planTitle = calendarDate.planTitle

  // 重置数据
  selectedQuestionKeys.value = []
  selectedQuestionsList.value = []

  // 获取所有问题
  await fetchQuestions()

  // 获取当前日程已关联的问题
  if (calendarDateForm.id) {
    await fetchCalendarDateQuestions(calendarDateForm.id)
  }
}

// 获取所有问题列表
const fetchQuestions = async () => {
  allQuestionsLoading.value = true
  try {
    const params = {
      type: searchForm.type,
      title: searchForm.questionText || undefined,
      pageNum: allQuestionsPagination.current,
      pageSize: allQuestionsPagination.pageSize
    }

    // 清理空值参数
    Object.keys(params).forEach(key => {
      if (params[key as keyof typeof params] === undefined) {
        delete params[key as keyof typeof params];
      }
    });

    const res: any = await getQuestionPage(params)
    console.log(res)

    // 检查响应数据结构并正确处理
    if (res && typeof res === 'object') {
      // 如果直接返回了分页数据
      if (Array.isArray(res.records)) {
        allQuestionsList.value = res.records || []
        allQuestionsPagination.total = res.total || 0
      }
      // 如果返回的是包装过的数据（如 {code: 200, data: {...}}）
      else if (res.data && Array.isArray(res.data.records)) {
        allQuestionsList.value = res.data.records
        allQuestionsPagination.total = res.data.total || 0
      }
      // 如果返回的是数组但没有分页结构
      else if (Array.isArray(res)) {
        allQuestionsList.value = res
        allQuestionsPagination.total = res.length
      }
      // 其他情况
      else {
        allQuestionsList.value = []
        allQuestionsPagination.total = 0
      }
    } else {
      allQuestionsList.value = []
      allQuestionsPagination.total = 0
    }
  } catch (error) {
    console.error('获取问题列表失败', error)
    message.error('获取问题列表失败')
    // 出错时设置默认值
    allQuestionsList.value = []
    allQuestionsPagination.total = 0
  } finally {
    allQuestionsLoading.value = false
  }
}

const resetSearch = () => {
  searchForm.type = undefined
  searchForm.questionText = ''
  allQuestionsPagination.current = 1
  fetchQuestions()
}

// 获取日程关联的问题列表
const fetchCalendarDateQuestions = async (calendarId: number) => {
  try {
    const params = {
      pageNum: allQuestionsPagination.current,
      pageSize: allQuestionsPagination.pageSize
    }

    const res: any = await getCalendarDateQuestions(calendarId, params)

    // 正确处理不同数据结构
    if (res && typeof res === 'object') {
      // 如果返回的是分页数据（如 { records: [], total: 0 }）
      if (Array.isArray(res.records)) {
        selectedQuestionsList.value = res.records || []
        selectQuestionsPagination.total = res.total || 0
      }
      // 如果返回的是包装过的数据（如 { code: 200, data: { records: [] } }）
      else if (res.data && Array.isArray(res.data.records)) {
        selectedQuestionsList.value = res.data.records || []
        selectQuestionsPagination.total = res.data.total || 0
      }
      // 如果直接返回数组
      else if (Array.isArray(res)) {
        selectedQuestionsList.value = res
        selectQuestionsPagination.total = res.length
      }
      // 其他情况
      else {
        selectedQuestionsList.value = []
        selectQuestionsPagination.total = 0
      }
    } else {
      selectedQuestionsList.value = []
      selectQuestionsPagination.total = 0
    }
  } catch (error) {
    console.error('获取日程关联问题失败', error)
    message.error('获取日程关联问题失败')
    selectedQuestionsList.value = []
    selectQuestionsPagination.total = 0
  }
}

// 所有问题表格分页变化
const handleAllQuestionsTableChange = (pag: any) => {
  allQuestionsPagination.current = pag.current
  allQuestionsPagination.pageSize = pag.pageSize
  fetchQuestions()
}

// 保存关联
const handleSave = async () => {
  if (!calendarDateForm.id) {
    message.error('日程ID不能为空')
    return
  }

  confirmLoading.value = true
  try {
    // 构造关联关系数据
    const relations = selectedQuestionsList.value.map((question, index) => ({
      questionId: question.id,
      sortOrder: question.sortOrder || index + 1
    }))

    await saveCalendarDateQuestions(calendarDateForm.id, relations)

    message.success('关联问题保存成功')
    emit('questionsAssociated')
    modalVisible.value = false
  } catch (error) {
    console.error('保存关联问题失败', error)
    message.error('保存关联问题失败')
  } finally {
    confirmLoading.value = false
  }
}

// 处理取消
const handleCancel = () => {
  modalVisible.value = false
}

const emit = defineEmits(['questionsAssociated'])

defineExpose({
  openModal
})
</script>

<style scoped>
.manage-questions-container {
  min-height: 400px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid #e8e8e8;
}

.question-list-container,
.selected-questions-container {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 15px;
}

.actions {
  text-align: center;
  padding: 10px 0;
}
</style>
