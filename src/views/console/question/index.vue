<!-- src/views/kn/console/question/index.vue -->
<template>
  <div class="question-container">
    <a-card>
      <!-- 查询条件 -->
      <a-row :gutter="20" class="search-form">
        <a-col :span="6">
          <a-input-search
            addon-before="题目标题"
            v-model:value="queryForm.questionText"
            placeholder="请输入题目标题"
            @search="handleQuery"
          />
        </a-col>
        <a-col :span="6">
          <a-input-search
            addon-before="题目分类"
            v-model:value="queryForm.categoryName"
            placeholder="请输入题目分类"
            @search="handleQuery"
          />
        </a-col>
        <a-col :span="6">
          <a-select
            v-model:value="queryForm.difficultyLevel"
            placeholder="请选择难度等级"
            allow-clear
            style="width: 100%"
          >
            <a-select-option value="简单">简单</a-select-option>
            <a-select-option value="中等">中等</a-select-option>
            <a-select-option value="困难">困难</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="6">
          <a-button type="primary" @click="handleQuery">查询</a-button>
          <a-button style="margin-left: 10px" @click="resetQuery">重置</a-button>
        </a-col>
      </a-row>

      <div class="btn-container">
        <a-button type="primary" @click="openAddQuestionModal">新增题目</a-button>
      </div>

      <!-- 面试题列表 -->
      <a-table
        :columns="columns"
        :data-source="questionList"
        :loading="isLoading"
        :pagination="pagination"
        @change="handleTableChange"
        :scroll="{ x: 1200 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'questionTitle'">
            <a-tooltip :title="record.questionTitle">
              <span>{{ truncateText(record.questionTitle, 20) }}</span>
            </a-tooltip>
          </template>
          <template v-else-if="column.key === 'questionText'">
            <a-tooltip :title="record.questionText">
              <span>{{ truncateText(record.questionText, 30) }}</span>
            </a-tooltip>
          </template>
          <template v-else-if="column.key === 'difficultyLevel'">
            <a-tag :color="getDifficultyColor(record.difficultyLevel)">
              {{ record.difficultyLevel }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'templateName'">
            {{ record.templateName }}
          </template>
          <template v-else-if="column.key === 'createTime'">
            {{ record.createTime }}
          </template>
          <template v-else-if="column.key === 'updateTime'">
            {{ record.updateTime }}
          </template>
          <template v-else-if="column.key === 'action'">
            <a @click="openEditQuestionModal(record)">编辑</a>
            <a-divider type="vertical"/>
            <a-popconfirm
              title="确定要删除这道题目吗?"
              ok-text="确定"
              cancel-text="取消"
              @confirm="handleDelete(record)"
            >
              <a>删除</a>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
    </a-card>

    <add-question-modal
      ref="addQuestionModal"
      :templateOptions="templateOptions"
      @fetchQuestionList="fetchQuestionList"/>

    <edit-question-modal
      ref="editQuestionModal"
      :templateOptions="templateOptions"
      @fetchQuestionList="fetchQuestionList"
    />

    <BackToHome />
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { QuestionVO } from "@/views/kn/console/question/type";
import { deleteQuestion, getQuestionPage } from "@/api/question/question";
import { message, Modal } from "ant-design-vue";
import { IdNameVO } from "@/domain/commonType";
import AddQuestionModal from './AddQuestion.vue'
import EditQuestionModal from './EditQuestion.vue'
import BackToHome from "@/components/BackToHome.vue";
import {getAllTemplates} from "@/api/template/template";

const queryForm = reactive({
  questionText: '',
  difficultyLevel: undefined,
  categoryName: ''
})

// 加载状态
const isLoading = ref(false)
const confirmLoading = ref(false)

// 面试题列表
const questionList = ref<QuestionVO[]>([])

// 模板选项
const templateOptions = ref<IdNameVO[]>([])

// 分页参数
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条`,
  pageSizeOptions: ['10', '20', '50', '100']
})

const columns = [
  {
    title: '题目标题',
    dataIndex: 'questionTitle',
    key: 'questionTitle',
    width: 150
  },
  {
    title: '题目内容',
    dataIndex: 'questionText',
    key: 'questionText',
    width: 200
  },
  {
    title: '难度等级',
    dataIndex: 'difficultyLevel',
    key: 'difficultyLevel',
    width: 100
  },
  {
    title: '分类名称',
    dataIndex: 'categoryName',
    key: 'categoryName',
    width: 150
  },
  {
    title: '所属模板',
    dataIndex: 'templateName',
    key: 'templateName',
    width: 150
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 180
  },
  {
    title: '修改时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    width: 180
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 150
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

// 处理删除
const handleDelete = (row: QuestionVO) => {
  Modal.confirm({
    title: '删除确认',
    content: `确定要删除题目"${row.questionTitle}"吗？`,
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      try {
        await deleteQuestion(row.id);
        message.success('删除成功');
        await fetchQuestionList();
      } catch (error) {
        message.error('删除失败');
      }
    },
    onCancel() {
      // 用户取消操作
    }
  });
};

const addQuestionModal = ref<any>(null)

const openAddQuestionModal = () => {
  if (addQuestionModal.value) {
    addQuestionModal.value.openModal(templateOptions.value)
  }
}

const editQuestionModal = ref<any>(null)
const editingQuestion = ref<QuestionVO | null>(null)
const openEditQuestionModal = (record: QuestionVO) => {
  editingQuestion.value = record
  if (editQuestionModal.value) {
    editQuestionModal.value.openModal(editingQuestion.value, templateOptions.value)
  }
}

// 处理查询
const handleQuery = () => {
  pagination.current = 1
  fetchQuestionList()
}

// 重置查询
const resetQuery = () => {
  queryForm.categoryName = ''
  queryForm.questionText = ''
  queryForm.difficultyLevel = undefined
  pagination.current = 1
  fetchQuestionList()
}

// 表格分页变化
const handleTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  fetchQuestionList()
}

// 截断文本
const truncateText = (text: string, maxLength: number) => {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

// 获取面试题列表
const fetchQuestionList = async () => {
  isLoading.value = true
  try {

    const params = {
      questionText: queryForm.questionText || undefined,
      difficultyLevel: queryForm.difficultyLevel || undefined,
      categoryName: queryForm.categoryName || undefined,
      pageNum: pagination.current,
      pageSize: pagination.pageSize
    }

    console.log('params', params)

    const res: any = await getQuestionPage(params)

    questionList.value = res.records
    pagination.total = res.total
  } catch (error) {
    console.error('获取面试题列表失败', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchQuestionList()
})
</script>

<style scoped>
.btn-container {
  margin-top: 40px;
  margin-bottom: 20px;
}

.question-container {
  padding: 16px;
}

.search-form {
  margin-bottom: 20px;
}
</style>
