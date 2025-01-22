<!--
 * @Author: chenamin
 * @LastModifiedBy: chenamin
 * @Date: 2024-11-30 17:26:12
 * @LastEditTime: 2024-12-23 15:39:54
 * @FilePath: /cbdt-data-classification-categorization-front/src/components/Icon/SvgIcon.vue
 * @Description: file content6
-->
<template>
  <svg aria-hidden="true" :class="className" :style="{ width, height }">
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

// 定义组件的 props
const props = defineProps({
  icon: {
    type: String,
    required: true
  },
  prefix: {
    type: String,
    default: 'icon'
  },
  color: {
    type: String
  },
  //svg宽度
  width: {
    type: String,
    default: '16px'
  },
  //svg高度
  height: {
    type: String,
    default: '16px'
  },
  className: {
    type: String,
    default: ''
  }
})

// 计算属性 symbolId
const symbolId = computed(() => `#${props.prefix}-${props.icon}`)
</script>

<style scoped>
</style>
