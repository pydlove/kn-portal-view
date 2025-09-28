<!-- src/views/kn/console/article/AddArticleModal.vue -->
<template>
  <a-modal
    v-model:open="visible"
    title="新增文章"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirm-loading="confirmLoading"
    width="80%"
    :maskClosable="false"
    :keyboard="false"
  >
    <a-form
      :model="formState"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      ref="formRef"
    >
      <a-form-item
        label="文章标题"
        name="articleTitle"
        :rules="[{ required: true, message: '请输入文章标题' }]"
      >
        <a-input v-model:value="formState.articleTitle" placeholder="请输入文章标题" />
      </a-form-item>

      <a-form-item
        label="所属菜单"
        name="menuId"
        :rules="[{ required: true, message: '请选择所属菜单' }]"
      >
        <a-select
          v-model:value="formState.menuId"
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
          v-model:value="formState.articleContent"
          :height="'400px'"
          style="width: 100%"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import MarkdownEditor from '@/components/MarkdownEditor.vue'
import { createArticle } from '@/api/kn/article/article'
import { IdNameVO } from '@/domain/commonType'

const visible = ref(false)
const confirmLoading = ref(false)
const formRef = ref()

const formState = reactive({
  articleTitle: '',
  menuId: undefined,
  articleContent: ''
})

const menuOptions = ref<IdNameVO[]>([])

const labelCol = { span: 4 }
const wrapperCol = { span: 20 }

// 打开模态框
const openModal = async (menus: IdNameVO[]) => {
  visible.value = true
  menuOptions.value = menus

  console.log('menus', menuOptions.value )
  resetForm()
}

// 重置表单
const resetForm = () => {
  formState.articleTitle = ''
  formState.menuId = undefined
  formState.articleContent = ''
}

// 提交表单
const handleSubmit = async () => {
  confirmLoading.value = true
  try {
    try {
      await formRef.value.validate()
    } catch (error) {
      confirmLoading.value = false
      return
    }

    await createArticle({
      articleTitle: formState.articleTitle,
      menuId: formState.menuId,
      articleContent: formState.articleContent
    })

    message.success('新增文章成功')
    emit('fetchArticleList')
    visible.value = false
  } catch (error) {
    console.error('新增文章失败', error)
    message.error('新增文章失败')
  } finally {
    confirmLoading.value = false
  }
}

const handleCancel = () => {
  visible.value = false
}

const emit = defineEmits(['fetchArticleList'])

defineExpose({
  openModal
})

onMounted(() => {
})
</script>
