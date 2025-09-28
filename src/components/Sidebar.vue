<!-- src/components/Sidebar.vue -->
<template>
  <div>
    <div v-if="isMobile">

      <div v-if="!isSidebarOpen" class="sidebar-header">
        <!-- 三条横线图标 -->
        <div class="hamburger-icon" @click="toggleSidebar">
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </div>
      </div>

      <div v-else class="mb-sidebar-menu">

        <div class="mb-sidebar-container">
        </div>

        <!-- 侧边栏头部 - 包含关闭按钮 -->
        <div class="mb-sidebar-header">
          <div class="close-icon" @click="toggleSidebar">
            ×
          </div>
        </div>

        <ul>
          <!-- 导航菜单项 -->
          <li v-for="menu in articleMenuList" :key="menu.menuId" class="mb-menu-item">
            <a
              href="#"
              @click.prevent="doToggleMenu(menu.menuId)"
              :class="{ active: isActiveMenu(menu.menuId) }"
              :title="menu.menuName"
            >
            <span class="mb-menu-icon">
              {{ menu.menuName }}
            </span>
              <span v-if="menu.articleTitleList && menu.articleTitleList.length > 0"
                    class="mb-arrow-icon">
              {{ isExpanded[menu.menuId] ? '▼' : '▶' }}
            </span>
            </a>

            <!-- 子元素列表 -->
            <ul v-if="isExpanded[menu.menuId]" class="mb-submenu">
              <li v-for="article in menu.articleTitleList" :key="article.articleId"
                  class="mb-submenu-item">
                <a
                  href="#"
                  @click.prevent="handleArticleClick(article, false)"
                  :title="article.title"
                  :class="{ 'mb-article-active': isActiveArticle(article.articleId) }"
                >
                  {{ article.title }}
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>

    <div v-else>
      <div class="sidebar-menu">

        <!-- 添加收起所有按钮 -->
        <div class="sidebar-actions">

          <div class="collapse-all-btn" @click="collapseAllMenus">
            <img src="../assets/images/shouqi.png" alt="">
          </div>

          <div class="collapse-all-btn" @click="expandAllMenus">
            <img src="../assets/images/expand_all.png" alt="">
          </div>

          <div class="collapse-all-btn" @click="locateCurrentArticle">
            <img src="../assets/images/mubiao.png" alt="">
          </div>

          <div class="collapse-all-btn" @click="doPcToggleSidebar">
            <img src="../assets/images/openLeft.png" alt="">
          </div>
        </div>

        <div class="sidebar">
          <ul>
            <!-- 导航菜单项 -->
            <li v-for="menu in articleMenuList" :key="menu.menuId" class="menu-item">
              <a
                href="#"
                @click.prevent="doToggleMenu(menu.menuId)"
                :class="{ active: isActiveMenu(menu.menuId) }"
                :title="menu.menuName"
              >
            <span class="menu-icon">
              {{ menu.menuName }}
            </span>
                <span v-if="menu.articleTitleList && menu.articleTitleList.length > 0"
                      class="arrow-icon">
              {{ isExpanded[menu.menuId] ? '▼' : '▶' }}
            </span>
              </a>

              <!-- 子元素列表 -->
              <ul v-if="isExpanded[menu.menuId]" class="submenu">
                <li v-for="article in menu.articleTitleList" :key="article.articleId"
                    class="submenu-item">
                  <a :id="`article-${article.articleId}`"
                     href="#"
                     @click.prevent="handleArticleClick(article)"
                     :title="article.title"
                     :class="{ 'article-active': isActiveArticle(article.articleId) }"
                  >
                    {{ article.title }}
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {getSubMenus} from "@/api/kn/home/home";
import {checkIsMobile, isMobile} from "@/utils/util";

const props = defineProps<{
  activeMenuId?: number,
  title?: TitleItem
}>()
const activeMenuIdRef = ref<string | null>(null)
const articleMenuList = ref<MenuItem[]>([])
const isExpanded = ref<{ [key: number]: boolean }>({}) // 记录每个菜单的展开状态
const firstArticle = ref<TitleItem>(null) // 记录每个菜单的展开状态
const activeArticleId = ref<number | null>(null) // 记录当前选中的文章ID
const isSidebarOpen = ref(false)

const emit = defineEmits<{
  (e: 'doPcToggleSidebar'): void,
  (e: 'handleArticleSelected', article: TitleItem): void
}>()

const doPcToggleSidebar = () => {
  emit('doPcToggleSidebar')
}

// 添加收起所有菜单函数
const collapseAllMenus = () => {
  Object.keys(isExpanded.value).forEach(key => {
    isExpanded.value[Number(key)] = false;
  });
};

// 添加展开所有菜单函数
const expandAllMenus = () => {
  articleMenuList.value.forEach(menu => {
    isExpanded.value[menu.menuId] = true;
  });
};

// 添加定位当前文章函数
const locateCurrentArticle = () => {
  // 从缓存中获取当前选中的文章
  const storedArticle = sessionStorage.getItem('selectedArticle');
  if (storedArticle) {
    const article = JSON.parse(storedArticle);

    // 设置当前选中的文章ID
    activeArticleId.value = article.articleId;

    // 触发文章选中事件
    emit('handleArticleSelected', article);

    // 展开对应的菜单
    if (!isExpanded.value[article.menuId]) {
      isExpanded.value[article.menuId] = true;
    }

    // 滚动到文章位置
    setTimeout(() => {
      const element = document.getElementById(`article-${article.articleId}`);
      if (element) {
        element.scrollIntoView({behavior: 'smooth', block: 'center'});
      }
    }, 100);
  }
};

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

export interface TitleItem {
  menuId: number
  articleId: number
  title: string
}

interface MenuItem {
  menuId: number
  menuName: string,
  articleTitleList: TitleItem[]
}

const fetchMenuData = async () => {
  try {

    articleMenuList.value = await getSubMenus({parentMenuId: activeMenuIdRef.value})

    // 初始化展开状态
    articleMenuList.value.forEach(menu => {
      isExpanded.value[menu.menuId] = false
    })

    if (articleMenuList.value.length > 0) {
      isExpanded.value[articleMenuList.value[0].menuId] = true
    }

    // 找出第一个目录下的第一个文章id
    if (articleMenuList.value.length > 0 &&
      articleMenuList.value[0].articleTitleList &&
      articleMenuList.value[0].articleTitleList.length > 0) {
      firstArticle.value = articleMenuList.value[0].articleTitleList[0]
      firstArticle.value.menuId = articleMenuList.value[0].menuId

      const storedArticle = sessionStorage.getItem('selectedArticle');
      if (!storedArticle) {
        activeArticleId.value = firstArticle.value.articleId
      }

    } else {
      firstArticle.value = null
    }

  } catch (error) {
    console.error('获取菜单数据失败:', error)
    firstArticle.value = null
  }
}

const doToggleMenuCore = (menuId: number) => {

  const isCurrentlyExpanded = isExpanded.value[menuId];

  // 先关闭所有菜单
  Object.keys(isExpanded.value).forEach(key => {
    isExpanded.value[Number(key)] = false;
  });

  // 如果之前是收起状态，则展开当前菜单
  // 如果之前是展开状态，则保持收起（允许手动收起）
  if (!isCurrentlyExpanded) {
    isExpanded.value[menuId] = true;
  }

  return isCurrentlyExpanded;
}

// 切换菜单展开/收起
const doToggleMenu = (menuId: number) => {
  doToggleMenuCore(menuId)
}

const toggleMenu = (menuId: number, isWait: boolean = false) => {

  if (isWait) {
    setTimeout(() => {
      if (articleMenuList.value && articleMenuList.value.length > 0) {
        afterDoToggleMenuCore(menuId)
      } else {
        toggleMenu(menuId, true)
      }
    }, 100);
  } else {
    afterDoToggleMenuCore(menuId)
  }
}

const afterDoToggleMenuCore = (menuId: number) => {

  let isCurrentlyExpanded = doToggleMenuCore(menuId)
  if (isCurrentlyExpanded) {
    isExpanded.value[menuId] = true;
  }
}

// 判断菜单是否激活
const isActiveMenu = (menuId: number) => {
  return activeMenuIdRef.value === menuId.toString()
}

// 判断文章是否激活
const isActiveArticle = (articleId: number) => {
  return activeArticleId.value === articleId
}

// 处理文章点击
const handleArticleClick = (article: TitleItem, isToggleMenu: boolean = false, isWait: boolean = false) => {

  if (isMobile.value) {
    toggleSidebar()
  }

  activeArticleId.value = article.articleId // 设置当前选中的文章ID

  if (isToggleMenu) {
    toggleMenu(article.menuId, isWait)
  }

  emit('handleArticleSelected', article)
}

const checkHasSelectedArticle = () => {
  const storedArticle = sessionStorage.getItem('selectedArticle');
  if (storedArticle) {
    const article = JSON.parse(storedArticle);

    handleArticleClick(article, true, true);
  }
}

watch(
  () => props,
  (props) => {
    if (props) {
      activeMenuIdRef.value = props.activeMenuId
      fetchMenuData()
    }
  },
  {immediate: true}
)

onMounted(() => {

  checkIsMobile()

  checkHasSelectedArticle()
})

defineExpose({
  firstArticle,
  checkHasSelectedArticle
})
</script>

<style scoped>

.fullstack-page .sidebar-actions {
  background-color: #22272e;
}

.fullstack-page.light-theme .sidebar-actions {
  background-color: #ffffff;
  border-right: 1px solid #d9d9d9;
  border-bottom: 1px solid #d9d9d9;
  border-top: 1px solid #d9d9d9;
}

.sidebar-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  height: 40px;
  align-items: center;
  justify-content: right;
  padding-right: 10px;
  position: absolute;
  width: 100%;
  z-index: 1;
}

.collapse-all-btn img {
  width: 20px;
  height: 20px;
}

.collapse-all-btn:hover {
  transform: translateY(-1px);
}

/* 添加定位图标样式 */
.locate-icon {
  margin-left: 0.5rem;
  cursor: pointer;
  opacity: 0.6;
  transition: all 0.3s ease;
  font-size: 16px;
  vertical-align: middle;
}

.locate-icon:hover {
  opacity: 1;
  transform: scale(1.1);
}

.submenu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.submenu-item a {
  flex-grow: 1;
}

/* 基础样式 */
.sidebar {
  width: 300px;
  transition: all 0.3s ease;
  height: calc(100vh - 120px);
  overflow-y: auto;
  padding-top: 40px;
}

.fullstack-page .sidebar {
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.fullstack-page a {
  color: #adbac7;
}

.fullstack-page.light-theme .sidebar {
  background-color: #ffffff;
  border-right: 1px solid #d9d9d9;
}


.fullstack-page.light-theme a {
  color: #333;
}

.sidebar-header h3 {
  margin: 0;
  color: #40a9ff;
  font-size: 1.2rem;
  font-weight: 600;
}

.sidebar-menu {
  position: relative;
}

.sidebar-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-menu li {
  margin-bottom: 0.5rem;
}

.sidebar-menu a {
  display: block;
  padding: 0.7rem 1rem;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  font-weight: 500;
  border: 1px solid transparent;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 220px; /* 限制最大宽度，确保文本不会溢出 */
}

.sidebar-menu a:hover {
  background-color: rgba(76, 175, 80, 0.1);
  transform: translateX(2px);
  font-weight: 600;
}

.sidebar-menu a.active {
  background-color: rgba(76, 175, 80, 0.2);
  font-weight: 600;
  border-left: 3px solid #40a9ff;
  box-shadow: 0 0 8px rgba(76, 175, 80, 0.2);
}

.sidebar-menu a.active::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 3px;
  background-color: #40a9ff;
  border-radius: 2px;
}

/* 子菜单样式 */
.submenu {
  margin-left: 1rem;
  padding-left: 0.5rem;
}

.submenu-item {
  margin-bottom: 0.3rem;
  margin-left: 2rem;
}

.submenu-item a {
  padding: 0.3rem 0.5rem;
  font-size: 14px;
  border-radius: 4px;
}

.submenu-item a:hover {
  background-color: unset;
  color: #40a9ff;
  font-weight: 600;
}

/* 选中的文章样式 */
.submenu-item a.article-active {
  background-color: rgba(64, 169, 255, 0.2);
  color: #40a9ff;
  font-weight: 600;
  border-left: 3px solid #40a9ff;
}

/* 箭头图标样式 */
.arrow-icon {
  margin-left: 0.5rem;
  font-size: 0.8rem;
  transition: transform 0.3s ease;
  opacity: 0.7;
}

/* 菜单图标样式 */
.menu-icon {
  position: relative;
  display: inline-block;
  padding: 0.2rem 0;
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}

@media (max-width: 768px) {

  .fullstack-page .mb-sidebar-menu {
    background-color: #181b20;
    color: #adbac7;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  }

  .fullstack-page.light-theme .mb-sidebar-menu {
    background-color: #ffffff;
    color: #333;
  }

  /* 移动端基础样式 */
  .mb-sidebar-menu {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 10000;
    width: 300px;
    transition: all 0.3s ease;
    border-radius: 5px;
    height: calc(100vh - 0px);
    overflow-y: auto;
  }

  /* 暗黑模式移动端样式 */
  .fullstack-page.dark-theme .mb-sidebar-menu {
    background-color: #1a1a1a;
    border-left: 1px solid #333;
  }

  /* 亮色模式移动端样式 */
  .fullstack-page.light-theme .mb-sidebar-menu {
    background-color: #ffffff;
    border-left: 1px solid #d9d9d9;
  }

  .mb-menu-item {
    margin-bottom: 0.8rem;
  }

  .mb-menu-item a {
    align-items: center;
    padding: 5px;
    font-size: 15px;
    border-radius: 8px;
    transition: all 0.3s ease;
    position: relative;
    font-weight: 500;
    border: 1px solid transparent;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 240px;
    text-decoration: none;
    display: block;
  }

  /* 暗黑模式移动端菜单项样式 */
  .fullstack-page.dark-theme .mb-menu-item a {
    color: #adbac7;
  }

  /* 亮色模式移动端菜单项样式 */
  .fullstack-page.light-theme .mb-menu-item a {
    color: #333;
  }

  .mb-menu-item a:hover {
    background-color: rgba(76, 175, 80, 0.1);
    transform: translateX(2px);
    font-weight: 600;
  }

  .mb-menu-item a.active {
    background-color: rgba(76, 175, 80, 0.2);
    font-weight: 600;
    border-left: 3px solid #40a9ff;
    box-shadow: 0 0 8px rgba(76, 175, 80, 0.2);
  }

  .mb-menu-item a.active::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 3px;
    background-color: #40a9ff;
    border-radius: 2px;
  }

  .mb-arrow-icon {
    margin-left: 0.5rem;
    font-size: 0.8rem;
    transition: transform 0.3s ease;
    opacity: 0.7;
  }

  /* 暗黑模式移动端箭头图标样式 */
  .fullstack-page.dark-theme .mb-arrow-icon {
    color: #adbac7;
  }

  /* 亮色模式移动端箭头图标样式 */
  .fullstack-page.light-theme .mb-arrow-icon {
    color: #333;
  }

  .mb-submenu {
    margin-left: 1rem;
    padding-left: 0.5rem;
    margin-top: 0.5rem;
  }

  .mb-submenu-item a {
    padding: 5px;
    font-size: 14px;
    border-radius: 4px;
    text-decoration: none;
    line-height: 28px;
  }


  /* 暗黑模式移动端子菜单项样式 */
  .fullstack-page.dark-theme .mb-submenu-item a {
    color: #adbac7;
  }

  /* 亮色模式移动端子菜单项样式 */
  .fullstack-page.light-theme .mb-submenu-item a {
    color: #333;
  }

  .mb-submenu-item a:hover {
    background-color: rgba(76, 175, 80, 0.1);
    color: #40a9ff;
    font-weight: 600;
  }

  .mb-submenu-item a.mb-article-active {
    background-color: rgba(64, 169, 255, 0.2);
    color: #40a9ff;
    font-weight: 600;
    border-left: 3px solid #40a9ff;
  }

  ::marker {
    display: none;
  }

  ul, li {
    list-style: none;
  }

  .mb-sidebar-menu ul {
    padding-left: 10px;
  }

  .mb-sidebar-header {
    position: fixed;
    right: 10px;
    top: 10px;
    font-size: 36px;
  }

  .close-icon {
    font-size: 36px;
    cursor: pointer;
    padding: 5px;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.3s ease;
    position: fixed;
    right: 10px;
    top: 15px;
  }

  /* 三条横线图标 */
  .hamburger-icon {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 30px;
    height: 30px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    z-index: 1001;
    position: fixed;
    right: 10px;
    top: 13px;
  }

  .hamburger-line {
    width: 100%;
    height: 3px;
    background: #333;
    transition: all 0.3s linear;
    position: relative;
    border-radius: 2px;
  }

  .fullstack-page .hamburger-line {
    background: #fff;
  }

  .fullstack-page.light-theme .hamburger-line {
    background: #333;
  }

  .mb-sidebar-container {
    height: 60px;
    width: 100%;
  }

  .fullstack-page .mb-sidebar-container {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .fullstack-page.light-theme .mb-sidebar-container {
    border-bottom: 1px solid #eeeeee;
  }

}
</style>
