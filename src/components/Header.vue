<template>
  <a-layout-header class="app-header">
    <!-- Theme Toggle Button -->
    <div class="theme-toggle" @click="toggleTheme">
      {{ isLightTheme ? '🌙 暗色' : '☀️ 亮色' }}
    </div>

    <!-- 搜索按钮 -->
    <div class="search-toggle" @click="doOpenSearchModal">
      <img class="ss-icon" src="../assets/images/sousuo.png" />
      <span class="search-shortcut">Ctrl+K</span>
    </div>

    <div class="menus-container">
      <!-- 新增 Logo 区域 -->
      <div class="logo-container" @click="goToHome">
        <img
          src="../assets/images/aiocloud.png"
          :alt="siteName"
          class="logo-image"
        />
        <span class="logo-text">{{ siteName }}</span>
      </div>

      <div v-if="isMobile" v-show="isHome">
        <div v-if="!isSidebarOpen" class="sidebar-header">
          <!-- 三条横线图标 -->
          <div class="hamburger-icon" @click="toggleSidebar">
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
          </div>
        </div>

        <!-- 侧边栏菜单 -->
        <div v-else class="sidebar" :class="{ 'active': !isSidebarOpen }">
          <!-- 侧边栏头部 - 包含关闭按钮 -->
          <div class="sidebar-header">
            <div class="close-icon" @click="toggleSidebar">
              ×
            </div>
          </div>

          <nav class="sidebar-nav">
            <div
              v-for="menu in menuList"
              :key="menu.id"
              class="sidebar-item"
              :class="{ active: isActiveMenu(menu.id) }"
              @click.stop="goToMain(menu.id)"
            >
              <span>{{ menu.menuName }}</span>
            </div>
          </nav>
        </div>
      </div>

      <!-- Navigation Bar -->
      <nav v-else class="navbar">
        <div class="nav-container">
          <div class="nav-item dropdown mnms-box" @click="openMockInterview">
            <img src="../assets/images/remen.png" class="rm-icon" />
            <span>模拟面试</span>
          </div>

          <!-- 主要菜单项 -->
          <div
            v-for="menu in mainMenuList"
            :key="menu.id"
            class="nav-item dropdown"
            :class="{ active: isActiveMenu(menu.id) }"
            @mouseenter="activeDropdown = menu.id"
            @mouseleave="activeDropdown = ''"
            @click.stop="goToMain(menu.id)"
          >
            <span>{{ menu.menuName }}</span>
          </div>

          <!-- 更多菜单项 -->
          <div
            v-if="moreMenuList.length > 0"
            class="nav-item dropdown"
            @mouseenter="activeDropdown = 'more'"
            @mouseleave="activeDropdown = ''"
          >
            <span>更多</span>
            <div
              v-show="activeDropdown === 'more'"
              class="dropdown-content"
            >
              <div class="dropdown-column">
                <div
                  v-for="menu in moreMenuList"
                  :key="menu.id"
                  class="dropdown-item"
                  @click.stop="goToMain(menu.id)"
                >
                  {{ menu.menuName }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>

    <SearchTool ref="searchToolRef"
                @handleSelectMenu="handleSelectMenu"
    />

    <MockInterview v-model:visible="showMockInterview" />
  </a-layout-header>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import { getRootMenus } from "@/api/kn/home/home.ts";
import { useRouter, useRoute } from "vue-router";
import { useGlobalStore } from "../store/modules/global.ts";
import { checkIsMobile, isMobile } from "../utils/util.ts";
import SearchTool from "./SearchTool.vue";
import { goToMainPage } from "../views/kn/main/main.ts";
import MockInterview from './interview/MockInterview.vue';

const globalStore = useGlobalStore()
const isLightTheme = ref(false)
const loading = ref(false)
const menuList = ref([])
const router = useRouter()
const route = useRoute()
const activeDropdown = ref('')
const isSidebarOpen = ref(false)
const isHome = ref(true)
const screenWidth = ref(window.innerWidth)

// Logo 相关属性
const siteName = ref('Momo Java 技术小窝') // 文字 logo 或网站名称

// 跟踪当前激活的菜单ID
const currentActiveMenuId = ref(route.query.menuId || '')

const searchToolRef = ref(null)

const showMockInterview = ref(false);

// 计算主菜单和更多菜单
const mainMenuList = computed(() => {
  // 如果屏幕宽度大于等于1400px，显示所有菜单
  if (screenWidth.value >= 1500 ) {
    return menuList.value;
  }

  // 如果菜单数量小于等于5，显示所有菜单
  if (menuList.value.length <= 5) {
    return menuList.value;
  }

  // 否则只显示前5个菜单
  return menuList.value.slice(0, 5);
});

const moreMenuList = computed(() => {
  // 如果屏幕宽度大于等于1400px，没有更多菜单
  if (screenWidth.value >= 1500) {
    return [];
  }

  // 如果菜单数量小于等于5，没有更多菜单
  if (menuList.value.length <= 5) {
    return [];
  }

  // 返回剩余的菜单项
  return menuList.value.slice(5);
});

const openMockInterview = () => {
  showMockInterview.value = true;
};

const doOpenSearchModal = () => {
  searchToolRef.value?.openSearchModal()
}

// 重置移动端状态
const resetMobileState = () => {
  if (isMobile.value) {
    isHome.value = true
    isSidebarOpen.value = false
  }
}

// 处理搜索结果选择事件
const handleSelectMenu = (rootMenuId, type, selectFirst) => {
  // 切换菜单
  currentActiveMenuId.value = rootMenuId

  goToMainPage(router, rootMenuId, type, selectFirst)

  resetMobileState()
}

// 判断菜单项是否为当前激活项
const isActiveMenu = (menuId) => {
  return currentActiveMenuId.value === menuId
}

// 跳转到首页
const goToHome = () => {
  currentActiveMenuId.value = ''
  router.push({name: 'home'})

  resetMobileState()
}

// 切换侧边栏
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

// 监听窗口大小变化
const handleResize = () => {
  screenWidth.value = window.innerWidth;
};

onMounted(() => {
  // 添加窗口大小变化监听器
  checkIsMobile()
  window.addEventListener('resize', handleResize);

  const savedTheme = localStorage.getItem('themePreference')
  if (savedTheme === 'light') {
    isLightTheme.value = true
    globalStore.setIsLightTheme(true)
  }

  fetchTableData()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
})

const toggleTheme = () => {
  isLightTheme.value = !isLightTheme.value
  localStorage.setItem('themePreference', isLightTheme.value ? 'light' : 'dark')

  globalStore.setIsLightTheme(isLightTheme.value)
}

/**
 * 添加跳转函数
 * @param menuId
 */
const goToMain = (menuId) => {
  if (isMobile.value) {
    isHome.value = false
  }

  sessionStorage.removeItem('selectedArticle');

  currentActiveMenuId.value = menuId

  goToMainPage(router, menuId, 'menu')
}

const fetchTableData = async () => {
  loading.value = true
  try {
    menuList.value = await getRootMenus({})
  } catch (error) {
    console.error('获取数据失败:', error)
  } finally {
    loading.value = false
  }
}

const groupChildren = (childrenMenu) => {
  if (!childrenMenu || childrenMenu.length === 0) return []

  // 按照菜单名称中的关键词进行分组
  const groups = []
  const processed = new Set()

  childrenMenu.forEach(item => {
    if (processed.has(item.id)) return

    // 提取菜单名称中的关键词作为分组标题
    let title = item.menuName
    if (item.menuName.includes('-')) {
      title = item.menuName.split('-')[0]
    }

    // 查找同组的其他菜单项
    const groupItems = childrenMenu.filter(menu => {
      if (processed.has(menu.id)) return false
      const menuTitle = menu.menuName.includes('-') ? menu.menuName.split('-')[0] : menu.menuName
      return menuTitle === title
    })

    // 标记这些项已处理
    groupItems.forEach(menu => processed.add(menu.id))

    groups.push({
      title: title,
      items: groupItems
    })
  })

  console.log("groups", groups)

  return groups
}

// 暴露给父组件使用
defineExpose({
  isLightTheme,
  openMockInterview
})
</script>

<style scoped>

.rm-icon {
  width: 36px;
  height: 36px;
  margin-right: 5px;
}
.ss-icon{
  width: 18px;
  height: 18px;
}

.app-header {
  position: fixed;
  top: 0;
  z-index: 1000;
  width: 100%;
  cursor: pointer; /* 添加手型光标表示可点击 */
}

.fullstack-page .app-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background-color: #22272e;
  color: #fff;
}

.fullstack-page.light-theme .app-header {
  border-bottom: 1px solid #d9d9d9;
  background-color: #ffffff;
  color: #333;
}

/* 新增 Logo 样式 */
.logo-container {
  display: flex;
  align-items: center;
  padding: 0 1rem;
  min-width: 60px;
}

.logo-image {
  height: 36px;
  width: auto;
  border-radius: 20px;
}

.logo-text {
  font-weight: bold;
  font-size: 21px;
  margin-left: 10px;
  min-width: 250px;
}

.header-title {
  width: 20%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.5rem;
  padding: 0 1rem;
  /* 使用系统字体 */
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.menus-container {
  height: 70px;
  max-width: 1600px;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
}

/* 主题切换按钮 */
.theme-toggle {
  position: fixed;
  top: 20px;
  right: 10px;
  padding: 5px 10px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  cursor: pointer;
  z-index: 1000;
  font-size: 14px;
}

.navbar {
  flex: 1;
}

.nav-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: right;
  min-width: 1000px;
}

.nav-item {
  text-decoration: none;
  font-size: 16px;
  padding: 5px;
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  transition: all 0.3s ease;
  max-width: 200px;
  min-width: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 5px;
}

/* 悬停时显示底部线条 */
.nav-item:hover::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: #1890ff;
}

/* 选中菜单始终显示底部线条 */
.nav-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: #1890ff;
}

/* 点击时的按钮式交互效果 */
.nav-item span {
  transition: all 0.2s ease;
  display: inline-block;
}

.nav-item:active span {
  transform: scale(0.95);
  opacity: 0.8;
}

.dropdown {
  cursor: pointer;
}

.dropdown-content {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 200px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  padding: 1rem;
  border-radius: 0 0 8px 8px;
  background-color: #fff;
}

.fullstack-page .dropdown-content {
  background-color: #22272e;
  color: #fff;
}

.fullstack-page.light-theme .dropdown-content {
  background-color: #ffffff;
  color: #333;
}

.dropdown-column {
  flex: 1;
  padding: 0 1rem;
}

.dropdown-column h4 {
  color: #4CAF50;
  margin: 0.5rem 0;
  font-size: 1rem;
}

.dropdown-item {
  padding: 8px 0;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.fullstack-page .dropdown-item {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.dropdown-item:hover {
  color: #1890ff;
  padding-left: 5px;
}

.dropdown-item:last-child {
  border-bottom: none;
}

/* 搜索按钮样式 */
.search-toggle {
  position: fixed;
  top: 20px;
  right: 90px;
  padding: 6px 10px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  cursor: pointer;
  z-index: 1000;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;
}

.search-toggle:hover {
  background-color: rgba(0, 0, 0, 0.3);
  transform: scale(1.05);
}

.search-shortcut {
  font-size: 14px;
  opacity: 0.7;
}

.fullstack-page.light-theme .search-toggle {
  background-color: rgba(0, 0, 0, 0.1);
  color: #333;
}

.fullstack-page.light-theme .search-toggle:hover {
  background-color: rgba(0, 0, 0, 0.2);
}

@media (min-width: 769px) and (max-width: 1669px) {
  .menus-container {
    margin-right: 200px;
    max-width: 1400px;
  }
}

@media (max-width: 768px) {
  .sidebar-header {
    border-bottom: 0 !important;
  }

  .search-toggle {
    position: fixed;
    top: 20px;
    left: 70px;
    font-size: 12px;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    display: unset;
    padding: unset;
    background-color: unset;
  }

  .search-toggle span {
    font-size: 32px;
    line-height: 45px;
    text-align: center;
    display: block;
  }

  .search-shortcut {
    display: none !important;
  }

  .menus-container {
    height: 60px;
    padding: 0 10px;
  }

  .logo-container {
    padding: 0;
  }

  .logo-image {
    height: 30px;
  }

  .logo-text {
    font-size: 1rem;
    margin-left: 10px;
    display: none;
  }

  .mobile-menu-toggle {
    display: flex;
  }

  .navbar {
    position: absolute;
    top: 60px;
    left: 0;
    width: 100%;
    background-color: inherit;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  .navbar.mobile-active {
    display: block;
  }

  .nav-container {
    flex-direction: column;
    align-items: center;
  }

  .nav-item {
    width: 100%;
    text-align: center;
    padding: 10px;
    margin: 0;
    border-bottom: 1px solid #eee;
  }

  .logo-text {
    font-size: 16px;
    margin-left: 10px;
  }

  .logo-image {
    height: 30px;
    width: auto;
  }

  .theme-toggle {
    position: fixed;
    top: 15px;
    right: 50px;
    padding: 5px 10px;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 20px;
    cursor: pointer;
    z-index: 1000;
    font-size: 14px;
    width: 100px;
  }

  /* 侧边栏遮罩 */
  .sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }

  .sidebar-overlay.active {
    opacity: 1;
    visibility: visible;
  }

  /* 侧边栏 */
  .sidebar {
    position: fixed;
    top: 0;
    right: 0px;
    width: 300px;
    height: 100%;
    background-color: #fff;
    z-index: 1000;
    transition: all 0.3s ease;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
    overflow-y: auto;
  }

  .fullstack-page .sidebar {
    background-color: #22272e;
    color: #fff;
  }

  .sidebar.active {
    left: 0;
    display: none;
  }

  .sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    height: 50px;
  }

  .sidebar-header .logo-container {
    padding: 0;
  }

  .sidebar-header .logo-text {
    font-size: 1.1rem;
    margin-left: 10px;
  }

  .close-btn {
    font-size: 24px;
    cursor: pointer;
    padding: 5px;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.3s ease;
  }

  .close-btn:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }

  .sidebar-nav {
    padding: 10px 0;
  }

  .sidebar-item {
    padding: 15px 20px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }

  .fullstack-page .sidebar-item {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .sidebar-item:hover {
    background-color: rgba(0, 0, 0, 0.05);
    padding-left: 25px;
  }

  .fullstack-page .sidebar-item:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }

  .sidebar-item.active {
    background-color: #1890ff;
    color: #fff;
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

  .close-icon:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }

  .fullstack-page .close-icon {
    color: #fff;
  }

  .fullstack-page .close-icon:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .fullstack-page.light-theme .sidebar {
    background-color: #ffffff;
    color: #333333;
  }

  .fullstack-page.light-theme .close-icon {
    color: #333;
  }

  .sidebar-header {
    height: 60px;
  }

  .fullstack-page .sidebar-header {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .fullstack-page.light-theme .sidebar-header {
    border-bottom: 1px solid #eeeeee;
  }

  .sidebar {
    overflow: auto;
    height: calc(100vh);
  }

  .logo-image {
    height: 40px;
  }
}
</style>
