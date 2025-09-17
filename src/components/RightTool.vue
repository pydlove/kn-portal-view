<!-- src/components/RightTool.vue -->
<template>
  <div class="tool-container">

    <!-- 手机看按钮 - 添加二维码展示 -->
    <div class="rt-tool-item" @click="showPhoneCode" @mouseenter="showQRCode" @mouseleave="hideQRCode">
      <div class="tool-icon">
        <img
          src="../assets/images/phone.png"
          alt="移动端"
          class="top-icon"
        />
      </div>
      <span>手机看</span>
      <!-- 二维码弹窗 -->
      <div v-show="showQR" class="qr-code-popup">
        <div class="qr-code-container">
          <img :src="qrCodeUrl" alt="二维码" class="qr-code-image" />
          <div class="qr-code-text">扫描二维码访问移动端</div>
        </div>
      </div>
    </div>

    <!-- 其他按钮保持不变 -->
    <!-- 全屏切换按钮 -->
    <div class="rt-tool-item" @click="toggleFullScreen"
         :title="isFullScreen ? '退出全屏' : '全屏显示'">
      <div class="tool-icon">
        <img
          :src="isFullScreen ? exitFullScreenIcon : fullScreenIcon"
          :alt="isFullScreen ? '退出全屏' : '全屏显示'"
          class="top-icon1"
        />
      </div>
      <span>{{ isFullScreen ? '退出全屏' : '全屏显示' }}</span>
    </div>

    <!-- 切换侧边栏按钮 -->
    <div class="rt-tool-item" @click="toggleSidebar"
         :title="isSidebarHidden ? '显示侧边栏' : '隐藏侧边栏'">
      <div class="tool-icon">
        <img
          :src="isSidebarHidden ? openLeftIcon : closeLeftIcon"
          :alt="isSidebarHidden ? '打开左边栏' : '关闭左边栏'"
          class="top-icon"
        />
      </div>
      <span>{{ isSidebarHidden ? '打开左边栏' : '关闭左边栏' }}</span>
    </div>

    <!-- 返回顶部按钮 -->
    <ReturnTop @scrollToTop="scrollToTop"/>

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
const showQR = ref(false)
const qrCodeUrl = ref('') // 二维码图片URL
const mobileUrl = ref('') // 移动端链接地址

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

// 显示二维码
const showQRCode = () => {
  // 设置移动端链接地址（根据你的实际需求修改）
  mobileUrl.value = 'http://112.124.109.1:9443/data-cc/home' // 替换为实际的移动端链接

  // 生成二维码图片URL（这里使用在线二维码生成服务示例）
  // 你可以使用自己的二维码生成服务或预生成的二维码图片
  qrCodeUrl.value = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(mobileUrl.value)}`

  showQR.value = true
}

// 隐藏二维码
const hideQRCode = () => {
  showQR.value = false
}

// 点击二维码区域跳转到移动端
const showPhoneCode = () => {
  if (mobileUrl.value) {
    window.open(mobileUrl.value, '_blank')
  }
}

// 切换全屏
const toggleFullScreen = () => {
  // ... 原有代码保持不变 ...
}

// 监听全屏状态变化
const handleFullScreenChange = () => {
  isFullScreen.value = !!document.fullscreenElement;
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

/* 二维码弹窗样式 */
.qr-code-popup {
  position: absolute;
  right: 80px; /* 距离右侧工具栏的距离 */
  top: 0;
  z-index: 1000;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  padding: 15px;
  min-width: 220px;
  text-align: center;
}

.qr-code-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.qr-code-image {
  width: 150px;
  height: 150px;
  margin-bottom: 10px;
  cursor: pointer;
}

.qr-code-text {
  font-size: 12px;
  color: #666;
  margin-top: 5px;
}

/* 暗色主题下的二维码弹窗 */
.fullstack-page .qr-code-popup {
  background: #2d3748;
  border: 1px solid #4a5568;
}

.fullstack-page .qr-code-text {
  color: #e2e8f0;
}

/* 为手机看按钮添加相对定位以便二维码定位 */
.rt-tool-item:first-child {
  position: relative;
}

.fullstack-page .tool-container {
  border-left: 1px solid rgba(255, 255, 255, 0.1);
}

.fullstack-page.light-theme .tool-container {
  border-left: 1px solid #d9d9d9;
  background: #ffffff;
}

.tool-container {
  max-width: 80px;
  min-width: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
}

.rt-tool-item {
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  background-color: transparent; /* 确保默认背景透明 */
  border: none; /* 移除可能的边框 */
}

.rt-tool-item span {
  font-size: 12px;
  margin-top: 5px;
  display: block;
  text-align: center;
}

/* 悬停状态 */
.rt-tool-item:hover {
  transform: scale(1.1);
  background-color: transparent; /* 确保悬停时不改变背景 */
}

/* 点击状态 - 移除背景色 */
.rt-tool-item:active {
  background-color: transparent !important;
  transform: scale(1.05);
}

/* 确保工具图标在各种状态下都没有背景色 */
.rt-tool-item:hover .tool-icon,
.rt-tool-item:active .tool-icon {
  background-color: transparent;
}

.rt-tool-item span {
  font-size: 12px;
  margin-top: 5px;
  display: block;
  text-align: center;
}

/* 工具图标样式 */
.tool-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 20px;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.top-icon {
  width: 30px;
  height: 30px;
  object-fit: contain;
}

.top-icon1 {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

</style>
