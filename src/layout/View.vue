<!--
 * @Author: chenamin
 * @LastModifiedBy: chenamin
 * @Date: 2024-11-29 20:37:05
 * @LastEditTime: 2024-12-18 15:12:21
 * @FilePath: /cbdt-data-classification-categorization-front/src/layout/View.vue
 * @Description: file content
-->
<template>
  <div :class="classObject">
    <router-view v-slot="{ Component }">
      <template v-if="Component">
        <Suspense>
          <!-- <Transition
            :name="transitionName"
            mode="out-in"
            appear
            @before-leave="overflow = 'hidden'"
            @after-leave="overflow = 'auto'"
          >
            <keep-alive :include="keepAliveComponents"> -->
          <component :is="Component" :key="route.fullPath" />
          <!-- </keep-alive> -->
          <!-- </Transition> -->
          <template #fallback> 正在加载... </template>
        </Suspense>
      </template>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useKeepAliveStore } from '@/store/modules/keepAlive'

const route = useRoute()
const keepAliveStore = useKeepAliveStore()
console.log(route, 'route')

// 缓存的路由组件列表
const keepAliveComponents = computed(() => keepAliveStore.list)
/** 过渡动画 */
const transitionName = computed(() => {
  const name = route.meta?.transitionName
  if (name === false) {
    return ''
  }
  return name ?? 'fade-slide'
})

// className 配置
const classObject = computed(() => {
  const className = route.meta?.className || []
  if (typeof className === 'string') {
    return ['page-content-wrapper', className]
  }
  return ['page-content-wrapper', ...className]
})
</script>

<style lang="scss" scoped>
.page-content-wrapper {
  background: #fff;
  border-radius: 4px;
}
.blank-bg {
  background: none;
}
</style>
