<!-- src/components/MarkdownEditor.vue -->
<template>
  <div class="markdown-editor">
    <div class="editor-container">
      <!-- 编辑区域 -->
      <div class="editor-panel">
        <div class="panel-header">编辑</div>
        <a-textarea
          v-model:value="inputContent"
          :rows="15"
          placeholder="请输入Markdown格式内容"
          class="editor-input"
        />
      </div>

      <!-- 预览区域 -->
      <div class="preview-panel">
        <div class="panel-header">预览</div>
        <div class="preview-content" v-html="previewHtml"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { marked } from 'marked'

const props = defineProps({
  value: {
    type: String,
    default: ''
  },
  height: {
    type: String,
    default: '300px'
  }
})

const emit = defineEmits(['update:value'])

const inputContent = ref(props.value)

// 预览HTML内容
const previewHtml = computed(() => {
  if (!inputContent.value) return ''
  return marked(inputContent.value)
})

// 监听输入内容变化
watch(inputContent, (newVal) => {
  emit('update:value', newVal)
})

// 监听外部值变化
watch(() => props.value, (newVal) => {
  inputContent.value = newVal
})
</script>

<style scoped>
.markdown-editor {
  border: 1px solid #d9d9d9;
  border-radius: 2px;
}

.editor-container {
  display: flex;
  height: v-bind('props.height');
}

.editor-panel,
.preview-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.panel-header {
  padding: 8px 12px;
  background-color: #fafafa;
  border-bottom: 1px solid #d9d9d9;
  font-weight: 500;
}

.editor-input {
  flex: 1;
  border: none;
  border-radius: 0;
}

.editor-input :deep(.ant-input) {
  height: 100% !important;
  resize: none;
  border: none;
  border-radius: 0;
}

.preview-content {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
  border: 0;
  border-left: 1px solid #d9d9d9;
}

/* 确保预览内容样式正确显示 */
.preview-content :deep(h1),
.preview-content :deep(h2),
.preview-content :deep(h3) {
  margin-top: 16px;
  margin-bottom: 10px;
}

.preview-content :deep(p) {
  margin-bottom: 10px;
}

.preview-content :deep(code) {
  padding: 2px 4px;
  background-color: #f2f4f5;
  border-radius: 3px;
  font-family: monospace;
}

.preview-content :deep(pre) {
  padding: 12px;
  background-color: #f2f4f5;
  border-radius: 3px;
  overflow-x: auto;
}

.preview-content :deep(pre code) {
  padding: 0;
  background: none;
}

.preview-content :deep(blockquote) {
  margin: 0 0 10px;
  padding: 10px 20px;
  background-color: #f2f4f5;
  border-left: 5px solid #d9d9d9;
}
</style>
