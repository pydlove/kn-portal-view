<!-- src/views/kn/console/article/index.vue -->
<template>
  <div class="article-container">
    <a-card>
      <!-- 查询条件 -->
      <a-row :gutter="20" class="search-form">
        <a-col :span="6">
          <a-input-search
            addon-before="文章标题"
            v-model:value="queryForm.title"
            placeholder="请输入文章标题"
            @search="handleQuery"
          />
        </a-col>
        <a-col :span="6">
          <a-select
            v-model:value="queryForm.menuId"
            placeholder="请选择菜单"
            allow-clear
            style="width: 100%"
          >
            <a-select-option
              v-for="menu in menuOptions"
              :key="menu.id"
              :value="menu.id"
            >
              {{ menu.name }}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :span="6">
          <a-button type="primary" @click="handleQuery">查询</a-button>
          <a-button style="margin-left: 10px" @click="resetQuery">重置</a-button>
        </a-col>
      </a-row>

      <div class="btn-container">
        <a-button type="primary" @click="openAddArticleModal">新增文章</a-button>
      </div>

      <!-- 文章列表 -->
      <a-table
        :columns="columns"
        :data-source="articleList"
        :loading="isLoading"
        :pagination="pagination"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'articleTitle'">
            <a-tooltip :title="record.articleTitle">
              <span>{{ truncateText(record.articleTitle, 30) }}</span>
            </a-tooltip>
          </template>
          <template v-else-if="column.key === 'menuName'">
            {{ record.menuName }}
          </template>
          <template v-else-if="column.key === 'createTime'">
            {{ record.createTime }}
          </template>
          <template v-else-if="column.key === 'updateTime'">
            {{ record.updateTime }}
          </template>
          <template v-else-if="column.key === 'action'">
            <a-divider type="vertical"/>
            <a @click="openEditArticleModal(record)">编辑</a>
            <a-divider type="vertical"/>
            <a-popconfirm
              title="确定要删除这篇文章吗?"
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

    <add-article-modal
      ref="addArticleModal"
      :menuOptions="menuOptions"
      @fetchArticleList="fetchArticleList"/>

    <edit-article-modal
      ref="editArticleModal"
      :menuOptions="menuOptions"
      @fetchArticleList="fetchArticleList"
    />

    <BackToHome />
  </div>
</template>

<script setup lang="ts">

import {onMounted, reactive, ref} from "vue";
import {ArticleVO} from "./type";
import {deleteArticle, getArticlePage} from "@/api/kn/article/article";
import {message, Modal} from "ant-design-vue";
import {getAllMenus} from "@/api/kn/menu/menu";
import {IdNameVO} from "@/domain/commonType";
import AddArticleModal from './AddArticle.vue'
import EditArticleModal from './EditArticle.vue'
import BackToHome from "@/components/BackToHome.vue";

const queryForm = reactive({
  title: '',
  menuId: undefined
})

// 加载状态
const isLoading = ref(false)
const confirmLoading = ref(false)

// 文章列表
const articleList = ref<ArticleVO[]>([])

// 菜单选项
const menuOptions = ref<IdNameVO[]>([])

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
    title: '文章标题',
    dataIndex: 'articleTitle',
    key: 'articleTitle',
    width: 250
  },
  {
    title: '所属菜单',
    dataIndex: 'menuName',
    key: 'menuName',
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
    width: 200
  }
]

// 处理删除
const handleDelete = (row: ArticleVO) => {
  Modal.confirm({
    title: '删除确认',
    content: `确定要删除文章"${row.articleTitle}"吗？`,
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      try {
        await deleteArticle(row.id);
        message.success('删除成功');
        await fetchArticleList();
      } catch (error) {
        message.error('删除失败');
      }
    },
    onCancel() {
      // 用户取消操作
    }
  });
};


const addArticleModal = ref<any>(null)

const openAddArticleModal = () => {
  if (addArticleModal.value) {
    addArticleModal.value.openModal(menuOptions.value)
  }
}

const editArticleModal = ref<any>(null)
const editingArticle = ref<ArticleVO | null>(null)
const openEditArticleModal = (record: ArticleVO) => {
  editingArticle.value = record
  if (editArticleModal.value) {
    editArticleModal.value.openModal(editingArticle.value, menuOptions.value)
  }
}

// 处理查询
const handleQuery = () => {
  pagination.current = 1
  fetchArticleList()
}

// 重置查询
const resetQuery = () => {
  queryForm.title = ''
  queryForm.menuId = undefined
  pagination.current = 1
  fetchArticleList()
}

const handlePreview = (record: ArticleVO) => {
  // previewArticle.value = { ...record }
  // previewVisible.value = true
}

// 表格分页变化
const handleTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  fetchArticleList()
}

// 截断文本
const truncateText = (text: string, maxLength: number) => {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

// 获取文章列表
const fetchArticleList = async () => {
  isLoading.value = true
  try {
    const params = {
      ...queryForm,
      pageNum: pagination.current,
      pageSize: pagination.pageSize
    }

    // 处理空值
    if (!params.title) delete params.title
    if (!params.menuId) delete params.menuId

    const res: any = await getArticlePage(params)

    console.log('获取文章列表成功', res)

    articleList.value = res.records
    pagination.total = res.total
  } catch (error) {
    console.error('获取文章列表失败', error)
    message.error('获取文章列表失败')
  } finally {
    isLoading.value = false
  }
}

// 获取菜单列表
const fetchMenus = async () => {
  try {
    menuOptions.value = await getAllMenus()
    console.log('获取菜单列表成功', menuOptions.value)
  } catch (error) {
    console.error('获取菜单列表失败', error)
  }
}

onMounted(() => {
  // fetchMenus()
  fetchArticleList()
  fetchMenus()
})

</script>

<style scoped>
.btn-container {
  margin-top: 40px;
  margin-bottom: 20px;
}

.article-container {
  padding: 16px;
}

.search-form {
  margin-bottom: 20px;
}

.article-preview {
  padding: 20px;
}

.preview-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}

.preview-content {
  line-height: 1.6;
}
</style>
