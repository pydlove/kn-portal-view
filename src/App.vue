<template>
  <ConfigProvider :theme="globalStore.themeConfig">
    <div :class="['fullstack-page', { 'light-theme': getCurrentTheme }]">
      <!-- 普通头部：当不在软考路径下且不隐藏头部时显示 -->
      <Header ref="headerRef" v-if="!isRuankaoRoute && !$route.meta.hideHeader"/>
      <!-- 软考头部：当在软考路径下且不隐藏头部时显示 -->
      <RkHeader ref="rkHeaderRef" v-if="isRuankaoRoute && !$route.meta.hideHeader"/>
      <div>
        <RouterView
          :class="['app-main', 'fullstack-page', { 'light-theme': getCurrentTheme }]"/>
      </div>
    </div>
  </ConfigProvider>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue'
import {useRoute} from 'vue-router'
import {RouterView} from 'vue-router'
import {ConfigProvider} from 'ant-design-vue'
import {useGlobalStore} from '@/store/modules/global'
import Header from './components/Header.vue';
import RkHeader from './components/ruankao/RkHeader.vue';
import type {ComponentPublicInstance} from 'vue'

interface HeaderInstance extends ComponentPublicInstance {
  isLightTheme: boolean
}

const globalStore = useGlobalStore()
const route = useRoute()
const mainContainer = ref<HTMLElement | null>(null)
const headerRef = ref<HeaderInstance | null>(null)
const rkHeaderRef = ref<HeaderInstance | null>(null)

// 判断当前是否为软考路由
const isRuankaoRoute = computed(() => {
  return route.path.startsWith('/rk')
})

// 获取当前主题模式
const getCurrentTheme = computed(() => {
  if (isRuankaoRoute.value && rkHeaderRef.value) {
    return rkHeaderRef.value.isLightTheme
  } else if (headerRef.value) {
    return headerRef.value.isLightTheme
  }
  return false
})

// 保持原有的 onMounted 逻辑
import {onMounted} from 'vue'
onMounted(() => {
  if (mainContainer.value) {
    mainContainer.value.style.height = `${window.innerHeight}px`
  }

  window.addEventListener('resize', () => {
    if (mainContainer.value) {
      mainContainer.value.style.height = `${window.innerHeight}px`
    }
  })
})
</script>

<style>
body {
  scrollbar-width: none;
  -ms-overflow-style: none;
  overflow: hidden !important;
}
html {
  scroll-padding-top: 70px;
}
.app-main {
  padding-top: 70px;
}

</style>

<style scoped>

/* 基础样式 */
.fullstack-page {
  min-height: 100vh;
  font-family: 'Arial', sans-serif;
  transition: background-color 0.3s, color 0.3s;
}

/* 暗色主题 (默认) */
.fullstack-page {
  background-color: #22272e;
  color: #adbac7;
}

/* 亮色主题 */
.fullstack-page.light-theme {
  background-color: #ffffff;
  color: #333;
}

.fullstack-page.light-theme .navbar {
  background-color: #31383f;
}

.fullstack-page.light-theme .nav-item {
  color: #333;
}

.fullstack-page.light-theme .dropdown-content {
  background-color: #fff;
  border: 1px solid #ddd;
}

.fullstack-page.light-theme .dropdown-column a {
  color: #555;
}

.fullstack-page.light-theme .dropdown-column a:hover {
  color: #000;
}

.fullstack-page.light-theme .feature {
  background-color: rgba(0, 0, 0, 0.05);
}

.fullstack-page.light-theme .feature p {
  color: #555;
}

.fullstack-page.light-theme .footer {
  background-color: rgba(0, 0, 0, 0.05);
}

.fullstack-page.light-theme .footer-links a {
  color: #555;
}

.fullstack-page.light-theme .theme-toggle {
  background-color: rgba(0, 0, 0, 0.05);
  color: #333;
}

.navbar {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-item {
  color: #fff;
}

.dropdown-content {
  background-color: #444;
}

.dropdown-column a {
  color: #ccc;
}

.dropdown-column a:hover {
  color: #fff;
}

.feature {
  background-color: rgba(255, 255, 255, 0.1);
}

.feature p {
  color: #ccc;
}

.footer {
  background-color: rgba(0, 0, 0, 0.2);
}

.footer-links a {
  color: #ccc;
}


.fullstack-page.light-theme .table-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 在暗色主题下添加适当的样式 */
.table-container :deep(.ant-table) {
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  overflow: hidden;
}

.table-container :deep(.ant-table-thead > tr > th) {
  background-color: rgba(255, 255, 255, 0.1);
}

.fullstack-page.light-theme .table-container :deep(.ant-table-thead > tr > th) {
  background-color: #f5f5f5;
  color: #333;
}

.table-container :deep(.ant-table-tbody > tr:hover > td) {
  background-color: rgba(255, 255, 255, 0.1);
}

.fullstack-page.light-theme .table-container :deep(.ant-table-tbody > tr:hover > td) {
  background-color: #f0f0f0;
}

/* 确保动态菜单的下拉内容宽度自适应 */
.nav-item.dropdown .dropdown-content {
  min-width: 600px;
  white-space: nowrap;
}

/* 为动态生成的列添加间距 */
.nav-item.dropdown .dropdown-content .dropdown-column:not(:last-child) {
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.fullstack-page.light-theme .nav-item.dropdown .dropdown-content .dropdown-column:not(:last-child) {
  border-right: 1px solid #ddd;
}

@media (max-width: 768px) {

  .app-main {
    padding-top: 50px;
  }
}

</style>
