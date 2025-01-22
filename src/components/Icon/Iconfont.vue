<!--
 * @Author: chenamin
 * @LastModifiedBy: chenamin
 * @Date: 2024-11-30 17:26:12
 * @LastEditTime: 2024-12-23 16:53:50
 * @FilePath: /cbdt-data-classification-categorization-front/src/components/Icon/Iconfont.vue
 * @Description: file content
-->
<template>
  <svg aria-hidden="true" :class="svgClass" :style="wrapStyle">
    <use :xlink:href="iconClassName" :fill="color" />
  </svg>
</template>

<script lang="ts" setup>
import { isString } from 'lodash-es'
import { computed } from 'vue'
// 定义组件的 props
const props = defineProps({
  iconName: {
    type: String,
    required: true
  },
  color: {
    type: String
  },
  size: {
    type: String,
    default: '1em'
  },
  width: {
    type: String
  },
  height: {
    type: String
  },
  className: {
    type: String,
    default: ''
  }
})

// 计算属性 symbolId
const iconClassName = computed(() => `#${props.iconName}`)
// 给图标添加上类名
const svgClass = computed(() => {
  if (props.className) {
    return `svg-icon ${props.className}`
  }
  return 'svg-icon'
})

const wrapStyle = computed(() => {
  const { color, size, width, height } = props

  const _size = isString(size) ? parseFloat(size) : size
  const _width = isString(width) ? parseFloat(width) : width
  const _height = isString(height) ? parseFloat(height) : height
  if (width && height) {
    return {
      color,
      width: `${_width}px`,
      height: `${_height}px`
    }
  }
  return {
    color,
    width: `${_size}px`,
    height: `${_size}px`
  }
})
</script>

<style scoped>
.svg-icon {
  position: relative;
  fill: currentColor;
  vertical-align: -2px;
}
</style>
