<template>
  <ConfigProvider :theme="globalStore.themeConfig">
    <RouterView />
  </ConfigProvider>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ConfigProvider } from 'ant-design-vue'
import { useGlobalStore } from '@/store/modules/global'
const globalStore = useGlobalStore()
</script>

<style scoped>
.main-pages {
  flex: 1;
  height: 100%;
  max-height: 100%;
}
</style>
