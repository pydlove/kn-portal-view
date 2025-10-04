<!-- src/views/console/exam/components/ArticleQuestion.vue -->
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
      label="文章分类"
      name="categoryName"
      :rules="[{ required: true, message: '请输入文章分类' }]"
    >
      <a-input v-model:value="formState.categoryName" placeholder="请输入文章分类" />
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

      <div class="toolbar-buttons" style="margin-top: 5px;">
        <a-button size="small" @click="insertMarkdownTemplate('content', 'red', formState)">红色文字</a-button>
        <a-button size="small" @click="insertMarkdownTemplate('content', 'bold', formState)" style="margin-left: 8px">粗体</a-button>
        <a-button size="small" @click="insertMarkdownTemplate('content', 'code', formState)" style="margin-left: 8px">代码</a-button>
        <a-button size="small" @click="insertMarkdownTemplate('content', 'image', formState)" style="margin-left: 5px">图片</a-button>
      </div>
    </a-form-item>

    <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="handleSubmit"
                :loading="confirmLoading">提交
      </a-button>
      <a-button style="margin-left: 10px" @click="onCancel">取消</a-button>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { message } from 'ant-design-vue';
import { marked } from 'marked';
import { getQuestion, getArticleDetail, updateQuestion, updateArticleDetail } from '@/api/ruankao/exam/exam.ts';
import {insertMarkdownTemplate} from "@/utils/markdownUtils";

const props = defineProps<{
  questionId: string;
}>();

const emit = defineEmits<{
  (e: 'submit'): void;
  (e: 'cancel'): void;
}>();

const formRef = ref();
const confirmLoading = ref(false);
const activeKey = ref('editor');
const labelCol = { span: 4 };
const wrapperCol = { span: 14 };

const renderedMarkdown = computed(() => {
  return marked(formState.content);
});

const formState = reactive({
  title: '',
  difficulty: undefined as number | undefined,
  score: undefined as number | undefined,
  type: 'ARTICLE',
  content: '',
  categoryName: ''
});

const fetchDetail = async () => {
  try {
    const [question, articleDetail] = await Promise.all([
      getQuestion(Number(props.questionId)),
      getArticleDetail(Number(props.questionId))
    ]);

    // 设置表单数据
    formState.title = question.title;
    formState.difficulty = question.difficulty;
    formState.score = question.score;
    formState.type = question.type;
    formState.categoryName = question.categoryName;
    formState.content = articleDetail.content;
  } catch (error) {
    console.error('获取文章题详情失败', error);
    message.error('获取文章题详情失败');
  }
};

const handleSubmit = async () => {
  confirmLoading.value = true;
  try {
    // 表单验证
    // await formRef.value.validate();

    // 构造提交数据
    const questionData = {
      id: Number(props.questionId),
      title: formState.title,
      difficulty: formState.difficulty,
      score: formState.score,
      categoryName: formState.categoryName,
      type: formState.type
    };

    const articleData = {
      questionId: Number(props.questionId),
      content: formState.content
    };

    // 提交数据
    await Promise.all([
      updateQuestion(Number(props.questionId), questionData),
      updateArticleDetail(Number(props.questionId), articleData)
    ]);

    message.success('更新文章题成功');
    emit('submit');
  } catch (error: any) {
    if (error?.errorFields) {
      // 表单验证失败
      console.log('表单验证失败');
    } else {
      console.error('更新文章题失败', error);
      message.error('更新文章题失败');
    }
  } finally {
    confirmLoading.value = false;
  }
};

const onCancel = () => {
  emit('cancel');
};

defineExpose({
  fetchDetail
});

onMounted(() => {
  fetchDetail();
});
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
