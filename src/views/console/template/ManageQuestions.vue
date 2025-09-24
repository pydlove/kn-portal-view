<!-- src/views/kn/console/template/ManageQuestions.vue -->
<template>
  <a-modal
    v-model:open="modalVisible"
    :title="`关联问题 - ${templateForm.templateName}`"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirm-loading="confirmLoading"
    width="80%"
  >
    <div class="manage-questions-container">
      <a-row :gutter="20">
        <!-- 左侧：所有问题列表 -->
        <a-col :span="12">
          <div class="section-title">所有面试题</div>
          <div class="search-box">
            <a-input-search
              v-model:value="searchForm.questionText"
              placeholder="搜索题目内容"
              @search="fetchQuestions"
              style="margin-bottom: 10px"
            />

            <a-input-search
              v-model:value="searchForm.categoryName"
              placeholder="搜索题目分类"
              @search="fetchQuestions"
              style="margin-bottom: 10px"
            />
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
                onChange: onSelectChange,
                getCheckboxProps: (record) => ({
                  disabled: isQuestionSelected(record.id)
                })
              }"
              size="small"
              :scroll="{ y: 300 }"
              rowKey="id"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'questionTitle'">
                  <a-tooltip :title="record.questionTitle">
                    <span>{{ truncateText(record.questionTitle, 20) }}</span>
                  </a-tooltip>
                </template>
                <template v-else-if="column.key === 'difficultyLevel'">
                  <a-tag :color="getDifficultyColor(record.difficultyLevel)">
                    {{ record.difficultyLevel }}
                  </a-tag>
                </template>
              </template>
            </a-table>
          </div>
        </a-col>

        <!-- 右侧：已关联问题列表 -->
        <a-col :span="12">
          <div class="section-title">已关联面试题</div>
          <div class="selected-questions-container">
            <a-table
              :columns="selectedQuestionsColumns"
              :data-source="selectedQuestionsList"
              :pagination="false"
              size="small"
              :scroll="{ y: 300 }"
              :rowClassName="(record, index) => record._selected ? 'selected-row' : ''"
              @rowClick="(record, index) => handleSelectedQuestionsRowClick(record, index)"
            >


            <template #bodyCell="{ column, record, index }">
                <template v-if="column.key === 'questionTitle'">
                  <a-tooltip :title="record.questionTitle">
                    <span>{{ truncateText(record.questionTitle, 20) }}</span>
                  </a-tooltip>
                </template>
                <template v-else-if="column.key === 'orderNo'">
                  <a-input-number
                    v-model:value="record.orderNo"
                    :min="1"
                    :max="999"
                    @change="(value) => handleOrderChange(index, value)"
                  />
                </template>
                <template v-else-if="column.key === 'action'">
                  <a @click.stop="removeQuestion(index)">移除</a>
                </template>
              </template>
            </a-table>
          </div>

          <div class="actions">
            <a-button @click="addAllQuestions"
                      :disabled="selectedQuestionKeys.length === 0"
                      style="margin-left: 10px">添加选中
            </a-button>
          </div>
        </a-col>

      </a-row>
    </div>
  </a-modal>
</template>

<!-- src/views/kn/console/template/ManageQuestions.vue -->
<script lang="ts" setup>
import { ref, reactive, watch } from 'vue'
import { message } from 'ant-design-vue'
import { getQuestionPage } from '@/api/question/question'
import { getTemplateQuestions, batchCreateTemplateQuestionRel } from '@/api/template/templateQuestionRel'
import { TemplateVO } from './type'

// 模态框可见性
const modalVisible = ref(false)
const confirmLoading = ref(false)

// 模板表单数据
const templateForm = reactive({
  id: undefined as number | undefined,
  templateName: ''
})

// 所有问题列表
const allQuestionsList = ref<any[]>([])
const allQuestionsLoading = ref(false)
const selectedQuestionKeys = ref<number[]>([])

// 已选中的问题列表
const selectedQuestionsList = ref<any[]>([])

// 当前选中的行索引
const selectedRowIndex = ref<number | null>(null)

// 分页参数
const allQuestionsPagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条`,
  pageSizeOptions: ['10', '20', '50', '100']
})

// 搜索表单
const searchForm = reactive({
  questionText: '',
  categoryName: '',
  difficultyLevel: ''
})

// 表格列定义
const allQuestionsColumns = [
  {
    title: '题目标题',
    dataIndex: 'questionTitle',
    key: 'questionTitle',
    width: 150
  },
  {
    title: '难度',
    dataIndex: 'difficultyLevel',
    key: 'difficultyLevel',
    width: 80
  }
]

const selectedQuestionsColumns = [
  {
    title: '题目标题',
    dataIndex: 'questionTitle',
    key: 'questionTitle',
    width: 150
  },
  {
    title: '排序',
    dataIndex: 'orderNo',
    key: 'orderNo',
    width: 100
  },
  {
    title: '操作',
    key: 'action',
    width: 80
  }
]

// 获取难度等级颜色
const getDifficultyColor = (level: string) => {
  switch (level) {
    case '简单': return 'green';
    case '中等': return 'orange';
    case '困难': return 'red';
    default: return 'default';
  }
}

// 截断文本
const truncateText = (text: string, maxLength: number) => {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

// 选择变化
const onSelectChange = (selectedKeys: number[], selectedRows: any[]) => {
  selectedQuestionKeys.value = selectedKeys || []
}

// 判断问题是否已选中
const isQuestionSelected = (questionId: number) => {
  const result = selectedQuestionsList.value.some(item => item.id === questionId)
  return result
}

// 添加选中的问题
const addAllQuestions = () => {
  // 根据选中的ID获取对应的问题对象
  const selectedQuestions = allQuestionsList.value.filter(
    item => selectedQuestionKeys.value.includes(item.id)
  )

  // 过滤掉已存在的问题
  const newQuestions = selectedQuestions.filter(
    item => !isQuestionSelected(item.id)
  )

  // 获取当前最大排序值
  const maxOrder = Math.max(...selectedQuestionsList.value.map(item => item.orderNo), 0)

  // 添加到已选列表并设置排序
  newQuestions.forEach((question, index) => {
    selectedQuestionsList.value.push({
      ...question,
      orderNo: maxOrder + index + 1
    })
  })

  // 清空选择
  selectedQuestionKeys.value = []

  // 重新排序整个列表
  reOrderQuestions()
}

// 移除问题
const removeQuestion = (index: number) => {
  selectedQuestionsList.value.splice(index, 1)

  // 如果删除的是选中的行，清除选中状态
  if (selectedRowIndex.value === index) {
    selectedRowIndex.value = null
  }
  // 如果删除的是选中行之前的行，调整选中行索引
  else if (selectedRowIndex.value !== null && selectedRowIndex.value > index) {
    selectedRowIndex.value = selectedRowIndex.value - 1
  }

  // 重新排序
  reOrderQuestions()
}

// 重新排序
const reOrderQuestions = () => {
  // 先按 orderNo 排序，然后按原始索引排序（确保相同 orderNo 的顺序）
  selectedQuestionsList.value.sort((a, b) => {
    if (a.orderNo === b.orderNo) {
      return a.id - b.id; // 使用 id 作为稳定排序键
    }
    return a.orderNo - b.orderNo;
  })

  // 重新设置索引（保持连续的排序号）
  selectedQuestionsList.value.forEach((item, index) => {
    item.orderNo = index + 1
  })
}

// 处理排序变化
const handleOrderChange = (index: number, value: number | null) => {
  if (value !== null && value > 0) {
    // 验证排序值是否合理
    const maxOrder = Math.max(...selectedQuestionsList.value.map(item => item.orderNo))
    if (value > maxOrder + 1) {
      message.warning('排序值不能超过最大值+1')
      return
    }

    // 更新排序值
    selectedQuestionsList.value[index].orderNo = value

    // 重新排序整个列表
    reOrderQuestions()
  }
}

// 上移
const moveUp = () => {
  if (selectedRowIndex.value !== null && selectedRowIndex.value > 0) {
    const temp = selectedQuestionsList.value[selectedRowIndex.value]
    selectedQuestionsList.value[selectedRowIndex.value] = selectedQuestionsList.value[selectedRowIndex.value - 1]
    selectedQuestionsList.value[selectedRowIndex.value - 1] = temp

    // 更新选中行索引
    selectedRowIndex.value = selectedRowIndex.value - 1

    // 重新排序
    reOrderQuestions()
  }
}

// 下移
const moveDown = () => {
  if (selectedRowIndex.value !== null && selectedRowIndex.value < selectedQuestionsList.value.length - 1) {
    const temp = selectedQuestionsList.value[selectedRowIndex.value]
    selectedQuestionsList.value[selectedRowIndex.value] = selectedQuestionsList.value[selectedRowIndex.value + 1]
    selectedQuestionsList.value[selectedRowIndex.value + 1] = temp

    // 更新选中行索引
    selectedRowIndex.value = selectedRowIndex.value + 1

    // 重新排序
    reOrderQuestions()
  }
}

// 监听选中问题列表变化，更新移动按钮状态
watch(selectedQuestionsList, () => {
  const selectedIndex = selectedQuestionsList.value.findIndex((item, index) => item._selected);
  canMoveUp.value = selectedIndex > 0;
  canMoveDown.value = selectedIndex >= 0 && selectedIndex < selectedQuestionsList.value.length - 1;
}, { deep: true });

const canMoveUp = ref(true)
const canMoveDown = ref(true)

// 打开模态框
const openModal = async (template: TemplateVO) => {
  modalVisible.value = true
  templateForm.id = template.id
  templateForm.templateName = template.templateName

  // 重置数据
  selectedQuestionKeys.value = []
  selectedQuestionsList.value = []

  // 获取所有问题
  await fetchQuestions()

  // 获取当前模板已关联的问题
  if (templateForm.id) {
    await fetchTemplateQuestions(templateForm.id)
  }
}

// 获取所有问题列表
const fetchQuestions = async () => {
  allQuestionsLoading.value = true
  try {
    const params = {
      questionText: searchForm.questionText || undefined,
      difficultyLevel: searchForm.difficultyLevel || undefined,
      categoryName: searchForm.categoryName || undefined,
      pageNum: allQuestionsPagination.current,
      pageSize: allQuestionsPagination.pageSize
    }

    const res: any = await getQuestionPage(params)

    allQuestionsList.value = res.records
    allQuestionsPagination.total = res.total

    console.log('问题列表:', allQuestionsList)

  } catch (error) {
    console.error('获取问题列表失败')
  } finally {
    allQuestionsLoading.value = false
  }
}

// 获取模板关联的问题列表
const fetchTemplateQuestions = async (templateId: number) => {
  try {
    const res: any = await getTemplateQuestions(templateId)

    // 确保返回的数据不为空
    if (!res || res.length === 0) {
      selectedQuestionsList.value = []
      return
    }

    // 将关联的问题添加到已选列表
    selectedQuestionsList.value = res.map((item: any, index: number) => ({
      ...item,
      orderNo: item.orderNo || index + 1,
      _selected: false // 添加默认选中状态
    }))
  } catch (error) {
    console.error('获取模板关联问题失败', error)
    selectedQuestionsList.value = [] // 空数组时也设置为[]
  }
}

// 所有问题表格分页变化
const handleAllQuestionsTableChange = (pag: any) => {
  allQuestionsPagination.current = pag.current
  allQuestionsPagination.pageSize = pag.pageSize
  fetchQuestions()
}

// 提交表单
const handleSubmit = async () => {
  if (!templateForm.id) {
    message.error('模板ID不能为空')
    return
  }

  confirmLoading.value = true
  try {
    // 构造关联关系数据
    const relData = selectedQuestionsList.value.map((question, index) => ({
      templateId: templateForm.id,
      questionId: question.id,
      orderNo: question.orderNo || index + 1
    }))

    // 先删除原有关系，再批量创建新关系
    await batchCreateTemplateQuestionRel(relData)

    message.success('关联问题保存成功')
    emit('fetchTemplateList')
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

// 添加右侧表格行选择功能
const handleSelectedQuestionsRowClick = (record: any, index: number) => {
  // 防止空数组点击
  if (!selectedQuestionsList.value || selectedQuestionsList.value.length === 0) {
    return
  }

  // 设置当前选中行索引
  selectedRowIndex.value = index

  // 更新选中状态
  selectedQuestionsList.value.forEach((item, i) => {
    item._selected = i === index
  })
}

// 修复后的计算逻辑
watch([selectedQuestionsList, selectedRowIndex], () => {
  if (selectedRowIndex.value !== null) {
    canMoveUp.value = selectedRowIndex.value > 0
    canMoveDown.value = selectedRowIndex.value < selectedQuestionsList.value.length - 1
  } else {
    canMoveUp.value = false
    canMoveDown.value = false
  }
}, { deep: true })

const emit = defineEmits(['fetchTemplateList'])

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
