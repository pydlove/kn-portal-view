<!-- src/views/kn/console/article/EditArticle.vue -->
<template>
  <a-modal
    v-model:open="modalVisible"
    :title="modalTitle"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirm-loading="confirmLoading"
    width="80%"
    :maskClosable="false"
    :keyboard="false"
  >
    <a-form
      :model="articleForm"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      ref="formRef"
    >
      <a-form-item
        label="文章标题"
        name="articleTitle"
        :rules="[{ required: true, message: '请输入文章标题' }]"
      >
        <a-input v-model:value="articleForm.articleTitle" placeholder="请输入文章标题"/>
      </a-form-item>

      <a-form-item
        label="所属菜单"
        name="menuId"
        :rules="[{ required: true, message: '请选择所属菜单' }]"
      >
        <a-select
          v-model:value="articleForm.menuId"
          placeholder="请选择菜单"
          style="width: 100%"
        >
          <a-select-option
            v-for="menu in menuOptions"
            :key="menu.id"
            :value="menu.id"
          >
            {{ menu.name }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        label="文章内容"
        name="articleContent"
        :rules="[{ required: true, message: '请输入文章内容' }]"
      >
        <markdown-editor
          v-model:value="articleForm.articleContent"
          :height="'400px'"
          style="width: 100%"
        />
      </a-form-item>
    </a-form>
  </a-modal>

  <!-- 文章预览模态框 -->
  <a-modal
    v-model:open="previewVisible"
    title="文章预览"
    width="80%"
    :footer="null"
  >
    <div class="article-preview">
      <div class="preview-title">{{ previewArticle.articleTitle }}</div>
      <div class="preview-content" v-html="previewContent"></div>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import {ref, reactive, computed, watch} from 'vue'
import {message} from 'ant-design-vue'
import {marked} from 'marked'
import MarkdownEditor from '@/components/MarkdownEditor.vue'
import {updateArticle} from '@/api/kn/article/article'
import {ArticleVO} from './type'
import {IdNameVO} from "@/domain/commonType";

// 模态框可见性
const modalVisible = ref(false)
const previewVisible = ref(false)
const confirmLoading = ref(false)
const formRef = ref()

// 模态框标题
const modalTitle = ref('编辑文章')

// 表单数据
const articleForm = reactive({
  id: undefined as number | undefined,
  articleTitle: '',
  menuId: undefined,
  articleContent: ''
})

// 菜单选项
const menuOptions = ref<any[]>([])

// 预览文章
const previewArticle = ref<ArticleVO>({} as ArticleVO)

// 表单布局
const labelCol = {span: 4}
const wrapperCol = {span: 20}

// 预览内容
const previewContent = computed(() => {
  if (!previewArticle.value.articleContent) return ''
  return marked(previewArticle.value.articleContent)
})

// 打开编辑模态框
const openModal = async (article: ArticleVO, menus: IdNameVO[]) => {
  modalVisible.value = true
  modalTitle.value = '编辑文章'

  menuOptions.value = menus

  // 重置表单
  articleForm.id = article.id
  articleForm.articleTitle = article.articleTitle
  articleForm.menuId = article.menuId
  articleForm.articleContent = article.articleContent

}

// 提交表单
const handleSubmit = async () => {
  confirmLoading.value = true
  try {
    // 表单验证
    await formRef.value.validate()

    // 更新文章
    if (articleForm.id) {
      await updateArticle(articleForm.id, {
        articleTitle: articleForm.articleTitle,
        menuId: articleForm.menuId,
        articleContent: articleForm.articleContent
      })

      message.success('更新文章成功')
      emit('fetchArticleList')
      modalVisible.value = false
    }
  } catch (error: any) {
    console.error('更新文章失败', error)
    if (error?.errorFields) {
      // 表单验证失败
      console.log('表单验证失败')
    } else {
      message.error('更新文章失败')
    }
  } finally {
    confirmLoading.value = false
  }
}

// 处理取消
const handleCancel = () => {
  modalVisible.value = false
}

// 处理预览
const handlePreview = (record: ArticleVO) => {
  previewArticle.value = {...record}
  previewVisible.value = true
}

const emit = defineEmits(['fetchArticleList'])

defineExpose({
  openModal,
  handlePreview
})
</script>

<style scoped>
.article-preview {
  padding: 20px;
}

.preview-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}

.preview-content {
  line-height: 1.6;
}
</style>
