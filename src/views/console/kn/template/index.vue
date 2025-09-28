<!-- src/views/kn/console/template/index.vue -->
<template>
  <div class="template-container">
    <a-card>
      <!-- 查询条件 -->
      <a-row :gutter="20" class="search-form">
        <a-col :span="6">
          <a-input-search
            addon-before="模板名称"
            v-model:value="queryForm.templateName"
            placeholder="请输入模板名称"
            @search="handleQuery"
          />
        </a-col>
        <!-- 新增模板等级筛选 -->
        <a-col :span="6">
          <a-select
            v-model:value="queryForm.templateLevel"
            placeholder="请选择模板等级"
            allow-clear
            style="width: 100%"
            @change="handleQuery"
          >
            <a-select-option :value="1">初级</a-select-option>
            <a-select-option :value="2">中级</a-select-option>
            <a-select-option :value="3">高级</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="6">
          <a-button type="primary" @click="handleQuery">查询</a-button>
          <a-button style="margin-left: 10px" @click="resetQuery">重置</a-button>
        </a-col>
      </a-row>

      <div class="btn-container">
        <a-button type="primary" @click="openAddTemplateModal">新增模板</a-button>
      </div>

      <!-- 面试模板列表 -->
      <a-table
        :columns="columns"
        :data-source="templateList"
        :loading="isLoading"
        :pagination="pagination"
        @change="handleTableChange"
        :scroll="{ x: 1200 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'templateName'">
            <a-tooltip :title="record.templateName">
              <span>{{ truncateText(record.templateName, 30) }}</span>
            </a-tooltip>
          </template>
          <template v-else-if="column.key === 'templateDesc'">
            <a-tooltip :title="record.templateDesc">
              <span>{{ truncateText(record.templateDesc, 30) }}</span>
            </a-tooltip>
          </template>
          <!-- 新增模板等级显示 -->
          <template v-else-if="column.key === 'templateLevel'">
            <a-tag :color="getLevelColor(record.templateLevel)">
              {{ getLevelText(record.templateLevel) }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'createTime'">
            {{ record.createTime }}
          </template>
          <template v-else-if="column.key === 'updateTime'">
            {{ record.updateTime }}
          </template>
          <template v-else-if="column.key === 'action'">
            <a @click="openEditTemplateModal(record)">编辑</a>
            <a-divider type="vertical"/>
            <a @click="openManageQuestionsModal(record)">关联问题</a>
            <a-divider type="vertical"/>
            <a-popconfirm
              title="确定要删除这个模板吗?"
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

    <add-template-modal
      ref="addTemplateModal"
      @fetchTemplateList="fetchTemplateList"/>

    <edit-template-modal
      ref="editTemplateModal"
      @fetchTemplateList="fetchTemplateList"
    />

    <!-- 关联问题管理模态框 -->
    <manage-questions-modal
      ref="manageQuestionsModal"
      @fetchTemplateList="fetchTemplateList"
    />

    <BackToHome />
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { TemplateVO } from "@/views/kn/console/template/type";
import { deleteTemplate, getTemplatePage } from "@/api/kn/template/template";
import { message, Modal } from "ant-design-vue";
import AddTemplateModal from './AddTemplate.vue'
import EditTemplateModal from './EditTemplate.vue'
import ManageQuestionsModal from './ManageQuestions.vue' // 新增导入
import BackToHome from "@/components/BackToHome.vue";

const queryForm = reactive({
  templateName: '',
  templateLevel: undefined // 新增字段
})

// 加载状态
const isLoading = ref(false)

// 面试模板列表
const templateList = ref<TemplateVO[]>([])

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
    title: '模板名称',
    dataIndex: 'templateName',
    key: 'templateName',
    width: 220
  },
  {
    title: '模板描述',
    dataIndex: 'templateDesc',
    key: 'templateDesc',
    width: 250
  },
  // 新增模板等级列
  {
    title: '模板等级',
    dataIndex: 'templateLevel',
    key: 'templateLevel',
    width: 60
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
    width: 220
  }
]

// 处理删除
const handleDelete = (row: TemplateVO) => {
  Modal.confirm({
    title: '删除确认',
    content: `确定要删除模板"${row.templateName}"吗？`,
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      try {
        await deleteTemplate(row.id);
        message.success('删除成功');
        await fetchTemplateList();
      } catch (error) {
        message.error('删除失败');
      }
    },
    onCancel() {
      // 用户取消操作
    }
  });
};

// 获取模板等级文本
const getLevelText = (level: number) => {
  switch (level) {
    case 4: return '应届生';
    case 1: return '初级';
    case 2: return '中级';
    case 3: return '高级';
    default: return '未知';
  }
}

// 获取模板等级颜色
const getLevelColor = (level: number) => {
  switch (level) {
    case 4: return 'green';
    case 1: return 'green';
    case 2: return 'orange';
    case 3: return 'red';
    default: return 'default';
  }
}

const addTemplateModal = ref<any>(null)

const openAddTemplateModal = () => {
  if (addTemplateModal.value) {
    addTemplateModal.value.openModal()
  }
}

const editTemplateModal = ref<any>(null)
const editingTemplate = ref<TemplateVO | null>(null)
const openEditTemplateModal = (record: TemplateVO) => {
  editingTemplate.value = record
  if (editTemplateModal.value) {
    editTemplateModal.value.openModal(editingTemplate.value)
  }
}

// 新增：打开关联问题管理模态框
const manageQuestionsModal = ref<any>(null)
const managingTemplate = ref<TemplateVO | null>(null)
const openManageQuestionsModal = (record: TemplateVO) => {
  managingTemplate.value = record
  if (manageQuestionsModal.value) {
    manageQuestionsModal.value.openModal(managingTemplate.value)
  }
}

// 处理查询
const handleQuery = () => {
  pagination.current = 1
  fetchTemplateList()
}

// 重置查询
const resetQuery = () => {
  queryForm.templateName = ''
  queryForm.templateLevel = undefined // 重置新增字段
  pagination.current = 1
  fetchTemplateList()
}

// 表格分页变化
const handleTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  fetchTemplateList()
}

// 截断文本
const truncateText = (text: string, maxLength: number) => {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

// 获取面试模板列表
const fetchTemplateList = async () => {
  isLoading.value = true
  try {
    const params = {
      ...queryForm,
      pageNum: pagination.current,
      pageSize: pagination.pageSize
    }

    // 处理空值
    if (!params.templateName) delete params.templateName
    if (!params.templateLevel) delete params.templateLevel

    const res: any = await getTemplatePage(params)

    console.log('获取面试模板列表成功', res)

    templateList.value = res.records
    pagination.total = res.total
  } catch (error) {
    console.error('获取面试模板列表失败', error)
    message.error('获取面试模板列表失败')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchTemplateList()
})
</script>

<style scoped>
.btn-container {
  margin-top: 40px;
  margin-bottom: 20px;
}

.template-container {
  padding: 16px;
}

.search-form {
  margin-bottom: 20px;
}
</style>
