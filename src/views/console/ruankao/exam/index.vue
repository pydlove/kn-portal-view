<!-- src/views/console/exam/index.vue -->
<template>
  <div class="exam-container">
    <a-card>
      <!-- 查询条件 -->
      <a-row :gutter="20" class="search-form">
        <a-col :span="6">
          <a-select
            v-model:value="queryForm.type"
            placeholder="请选择题目类型"
            allow-clear
            style="width: 100%"
          >
            <a-select-option value="CHOICE">选择题</a-select-option>
            <a-select-option value="CASE">案例题</a-select-option>
            <a-select-option value="ESSAY">论文题</a-select-option>
            <a-select-option value="ARTICLE">文章</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="6">
          <a-input-search
            addon-before="题目内容"
            v-model:value="queryForm.title"
            placeholder="请输入题目内容"
            @search="handleQuery"
          />
        </a-col>
        <a-col :span="6">
          <a-select
            v-model:value="queryForm.difficulty"
            placeholder="请选择难度等级"
            allow-clear
            style="width: 100%"
          >
            <a-select-option :value="1">简单</a-select-option>
            <a-select-option :value="2">中等</a-select-option>
            <a-select-option :value="3">困难</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="6">
          <a-button type="primary" @click="handleQuery">查询</a-button>
          <a-button style="margin-left: 10px" @click="resetQuery">重置</a-button>
        </a-col>
      </a-row>

      <div class="btn-container">
        <a-dropdown>
          <template #overlay>
            <a-menu @click="handleCreateQuestion">
              <a-menu-item key="choice">选择题</a-menu-item>
              <a-menu-item key="case">案例题</a-menu-item>
              <a-menu-item key="essay">论文题</a-menu-item>
              <a-menu-item key="article">文章</a-menu-item>
            </a-menu>
          </template>
          <a-button type="primary">
            新增题目
            <DownOutlined />
          </a-button>
        </a-dropdown>
      </div>

      <!-- 题目列表 -->
      <a-table
        :columns="columns"
        :data-source="questionList"
        :loading="isLoading"
        :pagination="pagination"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
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
          <template v-else-if="column.key === 'createTime'">
            {{ record.createTime }}
          </template>
          <template v-else-if="column.key === 'action'">
            <a @click="handleEdit(record)">编辑</a>
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

    <BackToHome />
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { DownOutlined } from '@ant-design/icons-vue';
import { getQuestionPage, deleteQuestion } from "@/api/ruankao/exam/exam";
import { RkExamQuestion } from "./exam";
import BackToHome from "@/components/BackToHome.vue";

const router = useRouter();

const queryForm = reactive({
  type: undefined as string | undefined,
  title: '',
  difficulty: undefined as number | undefined
})

// 加载状态
const isLoading = ref(false)

// 题目列表
const questionList = ref<RkExamQuestion[]>([])

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
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80
  },
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
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 180
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 150
  }
]

// 处理创建题目 - 更新路由路径
const handleCreateQuestion = ({ key }: { key: string }) => {
  router.push({
    path: '/exam/question/create',
    query: {
      type: key
    }
  });
}

// 处理编辑 - 更新路由路径
const handleEdit = (record: RkExamQuestion) => {
  router.push(`/exam/question/edit/${record.id}`);
}

// 处理删除
const handleDelete = async (record: RkExamQuestion) => {
  try {
    await deleteQuestion(record.id!);
    message.success('删除成功');
    await fetchQuestionList();
  } catch (error) {
    console.error('删除失败', error);
    message.error('删除失败');
  }
}

// 处理查询
const handleQuery = () => {
  pagination.current = 1;
  fetchQuestionList();
}

// 重置查询
const resetQuery = () => {
  queryForm.type = undefined;
  queryForm.title = '';
  queryForm.difficulty = undefined;
  pagination.current = 1;
  fetchQuestionList();
}

// 表格分页变化
const handleTableChange = (pag: any) => {
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
  fetchQuestionList();
}

// 截断文本
const truncateText = (text: string, maxLength: number) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

// 获取题目列表
const fetchQuestionList = async () => {
  isLoading.value = true;
  try {
    const params = {
      type: queryForm.type,
      title: queryForm.title || undefined,
      difficulty: queryForm.difficulty,
      pageNum: pagination.current,
      pageSize: pagination.pageSize
    };

    // 清理空值参数
    Object.keys(params).forEach(key => {
      if (params[key as keyof typeof params] === undefined) {
        delete params[key as keyof typeof params];
      }
    });

    const res: any = await getQuestionPage(params);

    // 检查响应数据结构并正确处理
    if (res && typeof res === 'object') {
      // 如果直接返回了分页数据
      if (Array.isArray(res.records)) {
        questionList.value = res.records;
        pagination.total = res.total || 0;
      }
      // 如果返回的是包装过的数据（如 {code: 200, data: {...}}）
      else if (res.data && Array.isArray(res.data.records)) {
        questionList.value = res.data.records;
        pagination.total = res.data.total || 0;
      }
      // 如果返回的是数组但没有分页结构
      else if (Array.isArray(res)) {
        questionList.value = res;
        pagination.total = res.length;
      }
      // 其他情况
      else {
        questionList.value = [];
        pagination.total = 0;
      }
    } else {
      questionList.value = [];
      pagination.total = 0;
    }
  } catch (error) {
    console.error('获取题目列表失败', error);
    message.error('获取题目列表失败: ' + (error as Error).message);
    questionList.value = [];
    pagination.total = 0;
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchQuestionList();
})
</script>

<style scoped>
.exam-container {
  padding: 16px;
}

.search-form {
  margin-bottom: 20px;
}

.btn-container {
  margin-bottom: 20px;
}
</style>
