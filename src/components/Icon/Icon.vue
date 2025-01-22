<!--
 * @Author: chenamin
 * @LastModifiedBy: chenamin
 * @Date: 2024-12-23 15:09:47
 * @LastEditTime: 2024-12-23 16:49:22
 * @FilePath: /cbdt-data-classification-categorization-front/src/components/Icon/Icon.vue
 * @Description: file content
-->
<template>
  <template v-if="type === 'icon-font'">
    <IconFont v-bind="{ ...$attrs, ...props }" :type="iconName" />
  </template>
  <template v-else-if="type === 'svg'">
    <SvgIcon v-bind="{ ...$attrs, ...props }" :name="iconName" class="anticon" />
  </template>
</template>

<script setup lang="ts">
import { withDefaults } from 'vue'
import SvgIcon from './SvgIcon.vue'
import IconFont from './Iconfont.vue'
const props = withDefaults(
  defineProps<{
    type?: 'icon-font' | 'svg'
    iconName: string
    color?: string
    size?: string | number
    width?: string | number
    height?: string | number
  }>(),
  {
    type: 'icon-font',
    size: 16
  }
)
</script>

<style lang="less" scoped></style>
