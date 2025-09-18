<template>
  <!-- 搜索模态框 -->
  <div v-if="showSearchModal" class="search-modal" @click="closeSearchModal">
    <div class="search-modal-content" @click.stop>
      <div class="search-header">
        <input
          ref="searchInput"
          v-model="searchQuery"
          type="text"
          class="search-input"
          placeholder="输入关键词搜索..."
          @input="handleSearch"
          @keydown.enter="handleEnterKey"
          @keydown.esc="closeSearchModal"
          @keydown.down.prevent="navigateResults(1)"
          @keydown.up.prevent="navigateResults(-1)"
        />
        <button class="search-close-btn" @click="closeSearchModal">×</button>
      </div>

      <div v-if="isLoading" class="loading">
        搜索中...
      </div>

      <div v-else-if="searchResults.length > 0" class="search-results">
        <div
          v-for="(result, index) in searchResults"
          :key="result.id"
          class="search-result-item"
          :class="{ 'active': selectedIndex === index }"
          @click="selectResult(result)"
        >
          <div class="result-title">{{ result.title }}</div>
          <div class="result-content">{{ formatContent(result.content) }}</div>
        </div>

        <!-- 显示更多按钮 -->
        <div v-if="searchResults.length < totalResults" class="load-more"
             @click="loadMoreResults">
          显示更多结果 ({{ totalResults - searchResults.length }} 个剩余)
        </div>
      </div>

      <div v-else-if="searchQuery" class="no-results">
        未找到相关结果
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref} from "vue";
import {getMenuPage} from "@/api/menu/menu";
import {searchArticleFulltext} from "@/api/home/home";

interface SearchResult {
  id: number;
  rootMenuId: number;
  menuId: number;
  title: string;
  content: string;
}

const showSearchModal = ref(false)
const searchQuery = ref('')
const searchResults = ref<SearchResult[]>([])
const selectedIndex = ref(-1)
const searchInput = ref<HTMLInputElement | null>(null)
const currentPage = ref(1)
const pageSize = ref(5)
const totalResults = ref(0)
const isLoading = ref(false)

// 格式化内容，去除Markdown标记
const formatContent = (content: string) => {
  if (!content) return '';

  // 去除常见的Markdown标记
  return content
    // 去除代码块标记
    .replace(/[\s\S]*?/g, '')
    // 去除行内代码标记
    .replace(/`[^`]*`/g, '')
    // 去除链接标记 [text](url)
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    // 去除图片标记 ![alt](url)
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '')
    // 去除粗体标记
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    // 去除斜体标记
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    // 去除标题标记
    .replace(/^#+\s*/gm, '')
    // 去除引用标记
    .replace(/^>\s*/gm, '')
    // 去除分割线
    .replace(/^\s*[-*_]{3,}\s*$/gm, '')
    // 去除多余的空白字符
    .replace(/\s+/g, ' ')
    // 去除行首行尾空格
    .trim()
    // 截取前100个字符并添加省略号
    .substring(0, 100) + (content.length > 100 ? '...' : '');
}

// 打开搜索模态框
const openSearchModal = () => {
  showSearchModal.value = true
  searchQuery.value = ''
  searchResults.value = []
  selectedIndex.value = -1

  // 延迟聚焦到输入框
  setTimeout(() => {
    if (searchInput.value) {
      searchInput.value.focus()
    }
  }, 100)
}

// 关闭搜索模态框
const closeSearchModal = () => {
  showSearchModal.value = false
  searchQuery.value = ''
  searchResults.value = []
  selectedIndex.value = -1
}

// 处理搜索
const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    selectedIndex.value = -1
    return
  }

  const res: any = await searchArticleFulltext({
    content: searchQuery.value,
    pageNum: currentPage.value,
    pageSize: pageSize.value
  })

  // 如果是第一页，替换结果；否则追加结果
  if (currentPage.value === 1) {
    searchResults.value = res.records
  } else {
    // 追加结果到现有数组中
    searchResults.value = [...searchResults.value, ...res.records]
  }
  totalResults.value = res.total
}

// 定义事件发射器
const emit = defineEmits<{
  (e: 'handleSelectMenu', rootMenuId: number, type: string, selectFirst: boolean): void
}>()

// 处理键盘回车事件
const handleEnterKey = () => {
  // 如果有选中的结果，则选择该结果
  if (selectedIndex.value >= 0 && searchResults.value.length > 0) {
    console.log('通过键盘回车选择搜索结果:', searchResults.value[selectedIndex.value])
    selectResult(searchResults.value[selectedIndex.value])
  }
}

// 选择搜索结果（通过点击或键盘回车）
const selectResult = (result: any) => {
  if (!result) return

  const articleInfo = {
    rootMenuId: result.rootMenuId,
    menuId: result.menuId,
    articleId: result.id,
    timestamp: Date.now()
  };
  sessionStorage.setItem('selectedArticle', JSON.stringify(articleInfo));

  console.log('通过点击选择搜索结果:', result)
  emit('handleSelectMenu', result.rootMenuId, 'search', false)
  closeSearchModal()
}

// 加载更多结果
const loadMoreResults = () => {
  if (searchResults.value.length >= totalResults.value) return

  currentPage.value++
  handleSearch()
}

// 导航搜索结果
const navigateResults = (direction: any) => {
  if (searchResults.value.length === 0) return

  selectedIndex.value += direction

  if (selectedIndex.value < 0) {
    selectedIndex.value = searchResults.value.length - 1
  } else if (selectedIndex.value >= searchResults.value.length) {
    selectedIndex.value = 0
  }
}

// 键盘事件处理
const handleKeyDown = (event: any) => {
  // Ctrl+K 打开搜索
  if (event.ctrlKey && event.key === 'k') {
    event.preventDefault()
    openSearchModal()
  }

  // ESC 关闭搜索
  if (event.key === 'Escape' && showSearchModal.value) {
    closeSearchModal()
  }
}

// 组件卸载前移除事件监听器
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

onMounted(() => {
  // 添加键盘事件监听器
  window.addEventListener('keydown', handleKeyDown)
})

defineExpose({
  openSearchModal
})
</script>

<style scoped>
/* 样式部分保持不变 */
.loading {
  padding: 20px;
  text-align: center;
  color: #666;
}

.load-more {
  padding: 15px;
  text-align: center;
  color: #1890ff;
  cursor: pointer;
  font-weight: 500;
  border-top: 1px solid #eee;
}

.load-more:hover {
  background-color: rgba(24, 144, 255, 0.1);
}

.fullstack-page .load-more {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.fullstack-page.light-theme .load-more {
  border-top: 1px solid #eee;
}

/* 搜索模态框样式 */
.search-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 100px;
}

.search-modal-content {
  background-color: #fff;
  border-radius: 8px;
  width: 600px;
  max-width: 90%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.fullstack-page .search-modal-content {
  background-color: #22272e;
  color: #fff;
}

.fullstack-page.light-theme .search-modal-content {
  background-color: #ffffff;
  color: #333;
}

.search-header {
  display: flex;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.fullstack-page .search-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.fullstack-page.light-theme .search-header {
  border-bottom: 1px solid #eee;
}

.search-input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  outline: none;
}

.fullstack-page .search-input {
  background-color: #1a1a1a;
  border: 1px solid #333;
  color: #fff;
}

.fullstack-page.light-theme .search-input {
  background-color: #fff;
  border: 1px solid #ddd;
  color: #333;
}

.search-input:focus {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.search-close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 0 10px;
  color: #999;
  transition: color 0.3s;
}

.search-close-btn:hover {
  color: #333;
}

.fullstack-page .search-close-btn:hover {
  color: #fff;
}

.fullstack-page.light-theme .search-close-btn:hover {
  color: #333;
}

.search-results {
  max-height: 400px;
  overflow-y: auto;
}

.search-result-item {
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.fullstack-page .search-result-item {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.fullstack-page.light-theme .search-result-item {
  border-bottom: 1px solid #eee;
}

.search-result-item:hover,
.search-result-item.active {
  background-color: rgba(24, 144, 255, 0.1);
}

.fullstack-page .search-result-item:hover,
.fullstack-page .search-result-item.active {
  background-color: rgba(24, 144, 255, 0.2);
}

.fullstack-page.light-theme .search-result-item:hover,
.fullstack-page.light-theme .search-result-item.active {
  background-color: rgba(24, 144, 255, 0.1);
}

.result-title {
  font-weight: 600;
  margin-bottom: 5px;
  font-size: 16px;
}

.result-content {
  font-size: 14px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.fullstack-page .result-content {
  color: #adbac7;
}

.fullstack-page.light-theme .result-content {
  color: #666;
}

.no-results {
  padding: 30px;
  text-align: center;
  color: #999;
}

.fullstack-page .no-results {
  color: #adbac7;
}

.fullstack-page.light-theme .no-results {
  color: #999;
}

@media (max-width: 768px) {
  .search-modal {
    padding-top: 50px;
  }

  .search-modal-content {
    width: 95%;
  }
}
</style>
