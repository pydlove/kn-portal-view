<!-- src/views/console/exam/components/ArticleQuestionCreate.vue -->
<template>
  <a-form
    :model="formState"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    ref="formRef"
  >
    <a-form-item
      label="题目内容"
      name="title"
      :rules="[{ required: true, message: '请输入题目内容' }]"
    >
      <a-textarea
        v-model:value="formState.title"
        placeholder="请输入题目内容"
        :auto-size="{ minRows: 3, maxRows: 6 }"
      />
    </a-form-item>

    <a-form-item
      label="文章内容"
      name="content"
      :rules="[{ required: true, message: '请输入文章内容' }]"
    >
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="editor" tab="编辑">
          <div class="markdown-editor">
            <a-textarea
              v-model:value="formState.content"
              placeholder="请输入Markdown格式的文章内容"
              :auto-size="{ minRows: 10, maxRows: 15 }"
            />
            <div class="editor-help">
              <a href="https://markdown.com.cn/" target="_blank">Markdown
                语法参考</a>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="preview" tab="预览">
          <div class="markdown-preview" v-html="renderedMarkdown"></div>
        </a-tab-pane>
      </a-tabs>
    </a-form-item>

    <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="handleSubmit"
                :loading="confirmLoading">提交
      </a-button>
      <a-button style="margin-left: 10px" @click="handleCancel">取消</a-button>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { message } from 'ant-design-vue';
import { marked } from 'marked';
import { createArticleQuestion } from '@/api/exam/exam.ts';

const emit = defineEmits<{
  (e: 'submit'): void;
  (e: 'cancel'): void;
}>();

const formRef = ref();
const activeKey = ref('editor');

const formState = reactive({
  title: '',
  difficulty: undefined as number | undefined,
  score: undefined as number | undefined,
  type: 'ARTICLE',
  content: ''
});

const renderedMarkdown = computed(() => {
  return marked(formState.content);
});

const confirmLoading = ref(false);
const labelCol = { span: 4 };
const wrapperCol = { span: 14 };

// 提交表单
const handleSubmit = async () => {
  confirmLoading.value = true;
  try {
    // 表单验证
    await formRef.value.validate();

    // 提交数据
    await createArticleQuestion({
      question: {
        title: formState.title,
        difficulty: formState.difficulty,
        score: formState.score,
        type: 'ARTICLE'
      },
      articleDetail: {
        title: formState.title,
        content: formState.content
      }
    });

    emit('submit');
  } catch (error: any) {
    if (error?.errorFields) {
      // 表单验证失败
      console.log('表单验证失败');
    } else {
      console.error('创建文章题失败', error);
      message.error('创建文章题失败');
    }
  } finally {
    confirmLoading.value = false;
  }
};

// 取消
const handleCancel = () => {
  emit('cancel');
};
</script>

<style scoped>
.markdown-editor {
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}

.editor-help {
  padding: 8px;
  background-color: #f5f5f5;
  border-top: 1px solid #d9d9d9;
}

.markdown-preview {
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 16px;
  min-height: 200px;
  background-color: #fff;
}
</style>

<style>
/* Markdown预览样式 */
.markdown-preview h1,
.markdown-preview h2,
.markdown-preview h3 {
  margin-top: 1em;
  margin-bottom: 0.5em;
}

.markdown-preview p {
  margin-bottom: 1em;
}

.markdown-preview ul,
.markdown-preview ol {
  padding-left: 20px;
  margin-bottom: 1em;
}

.markdown-preview li {
  margin-bottom: 0.5em;
}

.markdown-preview pre {
  background-color: #f5f5f5;
  padding: 12px;
  border-radius: 4px;
  overflow: auto;
}

.markdown-preview code {
  background-color: #f5f5f5;
  padding: 2px 4px;
  border-radius: 2px;
}

.markdown-preview blockquote {
  border-left: 4px solid #d9d9d9;
  padding-left: 16px;
  margin-left: 0;
  color: #666;
}
</style>
