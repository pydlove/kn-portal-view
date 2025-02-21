<template>
  <ConfigProvider :theme="globalStore.themeConfig">
    <Header v-if="!$route.meta.hideHeader" />
    <div :class="!$route.meta.hideHeader? 'main-pages':'login-page'">
      <RouterView />
    </div>
  </ConfigProvider>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ConfigProvider } from 'ant-design-vue'
import { useGlobalStore } from '@/store/modules/global'
import Header from './components/Header.vue';

const globalStore = useGlobalStore()
</script>

<style scoped>
.main-pages {
  flex: 1;
  height: 100%;
  max-height: 100%;
  width: 80%;
  margin: 0 auto;
}
.login-page {
  flex: 1;
  height: 100%;
  max-height: 100%;
}
</style>
