<!-- src/components/RightTool.vue -->
<template>
  <div class="tool-container">

    <!-- 全屏切换按钮 -->
    <div class="tool-item" @click="showPhoneCode">
      <div class="tool-icon">
        <img
          src="../assets/images/phone.png"
          alt="移动端"
          class="top-icon"
        />
      </div>
    </div>

    <!-- 全屏切换按钮 -->
    <div class="tool-item" @click="toggleFullScreen" :title="isFullScreen ? '退出全屏' : '全屏显示'">
      <div class="tool-icon">
        <img
          :src="isFullScreen ? exitFullScreenIcon : fullScreenIcon"
          :alt="isFullScreen ? '退出全屏' : '全屏显示'"
          class="top-icon1"
        />
      </div>
    </div>

    <!-- 切换侧边栏按钮 -->
    <div class="tool-item" @click="toggleSidebar"
         :title="isSidebarHidden ? '显示侧边栏' : '隐藏侧边栏'">
      <div class="tool-icon">
        <img
          :src="isSidebarHidden ? openLeftIcon : closeLeftIcon"
          :alt="isSidebarHidden ? '打开左边栏' : '关闭左边栏'"
          class="top-icon"
        />
      </div>
    </div>

    <!-- 返回顶部按钮 -->
    <ReturnTop @scrollToTop="scrollToTop" />

  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, onBeforeUnmount} from "vue";
// 需要准备对应的图标图片
import openLeftIcon from '../assets/images/openLeft.png';
import closeLeftIcon from '../assets/images/openLeft.png';
import fullScreenIcon from '../assets/images/fullscreen.png';
import exitFullScreenIcon from '../assets/images/fullScreen.png';
import topIcon from '../assets/images/top.png';
import ReturnTop from '../components/ReturnTop.vue'

const isSidebarHidden = ref(false)
const isFullScreen = ref(false)
const emit = defineEmits(['toggleSidebar', 'scrollToTop'])

// 切换侧边栏显示/隐藏
const toggleSidebar = () => {
  emit('toggleSidebar')
  isSidebarHidden.value = !isSidebarHidden.value
}

// 返回顶部
const scrollToTop = () => {
  emit('scrollToTop')
}

// 切换全屏
const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    // 进入全屏
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if ((document as any).webkitRequestFullscreen) { /* Safari */
      (document as any).webkitRequestFullscreen();
    } else if ((document as any).msRequestFullscreen) { /* IE11 */
      (document as any).msRequestFullscreen();
    }
  } else {
    // 退出全屏
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) { /* Safari */
      (document as any).webkitExitFullscreen();
    } else if ((document as any).msExitFullscreen) { /* IE11 */
      (document as any).msExitFullscreen();
    }
  }
}

// 监听全屏状态变化
const handleFullScreenChange = () => {
  isFullScreen.value = !!document.fullscreenElement;
}

const showPhoneCode = () => {
}

// 组件挂载时添加事件监听器
onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullScreenChange);
  document.addEventListener('webkitfullscreenchange', handleFullScreenChange); // Safari
  document.addEventListener('msfullscreenchange', handleFullScreenChange); // IE11
});

// 组件卸载前移除事件监听器
onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', handleFullScreenChange);
  document.removeEventListener('webkitfullscreenchange', handleFullScreenChange);
  document.removeEventListener('msfullscreenchange', handleFullScreenChange);
});
</script>

<style scoped>


.fullstack-page .tool-icon {
  background: #ffffff;
}

.fullstack-page.light-theme .tool-icon {
  background: #bae0ff;
}

.fullstack-page .tool-container {
  border-left: 1px solid rgba(255, 255, 255, 0.1);
}

.fullstack-page.light-theme .tool-container {
  border-left: 1px solid #d9d9d9;
}

.tool-container {
  max-width: 80px;
  min-width: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
}

/* 工具项样式 */
.tool-item {
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tool-item:hover {
  transform: scale(1.1);
}

/* 工具图标样式 */
.tool-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border-radius: 50%;
  font-size: 20px;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.tool-icon:hover {
  background-color: #40a9ff;
}

.top-icon {
  width: 30px;
  height: 30px;
  object-fit: contain;
}

.top-icon1 {
  width: 26px;
  height: 26px;
  object-fit: contain;
}
</style>
