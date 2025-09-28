<!-- src/views/kn/console/menu/EditArticle.vue -->
<template>
  <a-modal
    v-model:open="visible"
    title="编辑菜单"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirm-loading="confirmLoading"
  >
    <a-form
      :model="formState"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      ref="formRef"
    >
      <a-form-item
        label="菜单名称"
        name="menuName"
        :rules="[{ required: true, message: '请输入菜单名称' }]"
      >
        <a-input v-model:value="formState.menuName" />
      </a-form-item>

      <a-form-item label="菜单URL" name="menuUrl">
        <a-input v-model:value="formState.menuUrl" />
      </a-form-item>

      <a-form-item
        label="菜单级别"
        name="menuLevel"
        :rules="[{ required: true, message: '请选择菜单级别' }]"
      >
        <a-select
          v-model:value="formState.menuLevel"
          placeholder="请选择菜单级别"
          @change="handleLevelChange"
        >
          <a-select-option :value="1">一级菜单</a-select-option>
          <a-select-option :value="2">二级菜单</a-select-option>
          <a-select-option :value="3">三级菜单</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        v-if="formState.menuLevel !== 1"
        label="上级菜单"
        name="parentId"
        :rules="[{ required: formState.menuLevel !== 1, message: '请选择上级菜单' }]"
      >
        <a-tree-select
          v-model:value="formState.parentId"
          style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :tree-data="parentMenuTree"
          placeholder="请选择上级菜单"
          tree-default-expand-all
          :field-names="{ children: 'childrenMenu', label: 'menuName', value: 'id' }"
        />
      </a-form-item>

      <a-form-item label="排序" name="orderNo">
        <a-input-number v-model:value="formState.orderNo" :min="0" style="width: 100%" />
      </a-form-item>

      <a-form-item label="状态" name="enabledStatus">
        <a-radio-group v-model:value="formState.enabledStatus">
          <a-radio :value="1">启用</a-radio>
          <a-radio :value="0">禁用</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item label="菜单描述" name="menuDesc">
        <a-textarea
          v-model:value="formState.menuDesc"
          :rows="3"
          placeholder="请输入菜单描述"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import {reactive, ref, watch} from 'vue'
import {getRkLevelMenus, getRkMenuDetail, updateRkMenu} from '@/api/ruankao/menu/menu'
import {message} from 'ant-design-vue'
import type {RkMenu} from './type'

const visible = ref(false)
const confirmLoading = ref(false)
const formRef = ref()

const formState = reactive({
  id: 0,
  menuName: '',
  menuDesc: '',
  menuUrl: '',
  parentId: 0,
  menuLevel: 1,
  orderNo: 0,
  enabledStatus: 1
})

const parentMenuTree = ref<RkMenu[]>([])

const props = defineProps<{
  menu: RkMenu | null
}>()

const labelCol = { span: 6 }
const wrapperCol = { span: 18 }

watch(
  () => props.menu,
  (newVal) => {
    if (newVal) {
      Object.assign(formState, newVal)
    }
  },
  { immediate: true }
)

const handleLevelChange = async (value: number) => {
  let res: any
  if (value === 2) {
    res = await getRkLevelMenus(1)
  } else if (value === 3) {
    res = await getRkLevelMenus(2)
  }

  parentMenuTree.value = res
}

// 打开模态框
const openModal = async () => {
  visible.value = true

  // 获取菜单详情
  if (props.menu?.id) {
    try {
      const res: any = await getRkMenuDetail(props.menu.id)
      Object.assign(formState, res.data)
    } catch (error) {
      console.error('获取菜单详情失败', error)
      message.error('获取菜单详情失败')
    }
  }
}

// 提交表单
const handleSubmit = async () => {
  confirmLoading.value = true
  try {
    await formRef.value.validate()

    // 构建请求参数
    const menuData = {
      ...formState
    }
    console.log("menu Data", menuData)

    await updateRkMenu(formState.id, menuData)
    message.success('编辑菜单成功')
    emit('fetchData')
    visible.value = false
  } catch (error) {
    console.error('编辑菜单失败', error)
    message.error('编辑菜单失败')
  } finally {
    confirmLoading.value = false
  }
}

const handleCancel = () => {
  visible.value = false
}

const emit = defineEmits(['fetchData'])

defineExpose({
  openModal,
})
</script>
