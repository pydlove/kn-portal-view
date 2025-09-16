<!-- src/views/kn/console/menu/index.vue -->
<template>
  <div class="ts-container">
    <a-card>
      <a-input-search
        addon-before="菜单名称"
        class="search-input"
        v-model:value="searchValue"
        placeholder="请输入菜单名称"
        :loading="isSearchLoading"
        style="display: block; margin-bottom: 20px;"
        @search="getSearchList"
      />

      <a-button class="mb-20" type="primary" @click="openAddMenuModal">新增菜单</a-button>

      <a-table
        :columns="menuColumns"
        :data-source="menuList"
        :loading="isLoading"
        :pagination="pagination"
        childrenColumnName="childrenMenu"
        :default-expand-all="true"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'menuLevel'">
            {{ formatLevel(record.menuLevel) }}
          </template>
          <template v-else-if="column.key === 'enabledStatus'">
            <a-tag :color="record.enabledStatus === 1 ? 'green' : 'red'">
              {{ record.enabledStatus === 1 ? '启用' : '禁用' }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <a @click="openAddSubMenuModal(record)">新增下级</a>
            <a-divider type="vertical" />
            <a @click="openEditMenuModal(record)">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm
              title="确定要删除这个菜单吗?"
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

    <!-- 新增菜单模态框 -->
    <add-menu-modal
      ref="addMenuModal"
      @fetchData="fetchData"
    />

    <!-- 编辑菜单模态框 -->
    <edit-menu-modal
      ref="editMenuModal"
      :menu="editingMenu"
      @fetchData="fetchData"
    />

    <BackToHome />
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import {deleteMenu, getMenuPage} from '@/api/menu/menu'
import AddMenuModal from './AddMenu.vue'
import EditMenuModal from './EditMenu.vue'
import {message} from 'ant-design-vue'
import type {KnMenu} from './type'
import BackToHome from '../../../../components/BackToHome.vue'

const searchValue = ref('')
const menuList = ref<KnMenu[]>([])
const isLoading = ref<boolean>(false)
const isSearchLoading = ref<boolean>(false)

const pagination = ref({
  current: 1,
  pageSize: 15,
  total: 0,
  showTotal: (total: number) => `共 ${total} 条`,
  onChange: (page: number, pageSize: number) => {
    fetchData(page, pageSize)
  }
})

// 表格列定义
const menuColumns = [
  {
    title: '菜单名称',
    dataIndex: 'menuName',
    key: 'menuName',
  },
  {
    title: '菜单URL',
    dataIndex: 'menuUrl',
    key: 'menuUrl',
  },
  {
    title: '菜单级别',
    key: 'menuLevel',
  },
  {
    title: '排序',
    dataIndex: 'orderNo',
    key: 'orderNo',
  },
  {
    title: '状态',
    key: 'enabledStatus',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
  },
  {
    title: '操作',
    key: 'action',
  },
]

// 格式化菜单级别
const formatLevel = (level: number) => {
  const levelMap: Record<number, string> = {
    1: '一级菜单',
    2: '二级菜单',
    3: '三级菜单'
  }
  return levelMap[level] || `${level}级菜单`
}

const fetchData = async (current?: number, pageSize?: number) => {
  isLoading.value = true
  try {
    const pageNum = current || pagination.value.current
    const pageSizeValue = pageSize || pagination.value.pageSize

    const res: any = await getMenuPage({
      pageNum: pageNum,
      pageSize: pageSizeValue
    })

    console.log("menu page", res)
    menuList.value = res.records

    pagination.value.total = res.total
    if (current) pagination.value.current = current
    if (pageSize) pagination.value.pageSize = pageSize
  } catch (error) {
    console.error('获取菜单列表失败', error)
    message.error('获取菜单列表失败')
  } finally {
    isLoading.value = false
    isSearchLoading.value = false
  }
}

onMounted(() => {
  // 组件挂载时只调用一次
  fetchData()
})

const getSearchList = () => {
  isSearchLoading.value = true
  // 搜索时重置到第一页
  fetchData(1, pagination.value.pageSize)
}

// 新增菜单模态框
const addMenuModal = ref<any>(null)

const openAddMenuModal = () => {
  if (addMenuModal.value) {
    addMenuModal.value.openModal()
  }
}

const openAddSubMenuModal = (parentMenu: KnMenu) => {
  if (addMenuModal.value) {
    addMenuModal.value.openModal(parentMenu)
  }
}

// 编辑菜单模态框
const editMenuModal = ref<any>(null)
const editingMenu = ref<KnMenu | null>(null)

const openEditMenuModal = (menu: KnMenu) => {
  editingMenu.value = menu
  if (editMenuModal.value) {
    editMenuModal.value.openModal()
  }
}

// 删除菜单
const handleDelete = async (menu: KnMenu) => {
  try {
    await deleteMenu(menu.id!)
    await fetchData()
  } catch (error) {
    console.error('删除菜单失败', error)
    message.error('删除菜单失败')
  }
}
</script>

<style scoped>
.ts-container {
  padding: 16px;
  height: calc(100vh - 120px);
  overflow: auto;
}
.search-input {
  min-width: 100px;
  max-width: 300px;
  margin-bottom: 20px;
}
</style>
