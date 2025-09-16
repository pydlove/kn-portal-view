<template>
  <!-- 返回顶部按钮 -->
  <div class="tool-item top-btn" @click="scrollToTop" title="返回顶部">
    <div class="tool-icon">
      <img
        src="../assets/images/top.png"
        alt="返回顶部"
        class="top-icon"
      />
    </div>
  </div>
</template>

<script setup lang="ts">

const emit = defineEmits(['scrollToTop'])

// 返回顶部
const scrollToTop = () => {
  emit('scrollToTop')
}
</script>

<style scoped>
.fullstack-page .tool-icon {
  background: #ffffff;
}

.fullstack-page.light-theme .tool-icon {
  background: #bae0ff;
}

.top-btn {
  position: fixed;
  right: 20px;
  bottom: 40px;
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
</style>
