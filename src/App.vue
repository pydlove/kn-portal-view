<template>
  <ConfigProvider :theme="globalStore.themeConfig">
    <Header v-if="!$route.meta.hideHeader" />
    <div :class="!$route.meta.hideHeader ? 'main-pages' : 'login-page'" ref="mainContainer">
      <RouterView />
    </div>
  </ConfigProvider>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { ConfigProvider } from 'ant-design-vue'
import { useGlobalStore } from '@/store/modules/global'
import Header from './components/Header.vue';

const globalStore = useGlobalStore()
const mainContainer = ref<HTMLElement | null>(null)

onMounted(() => {
  if (mainContainer.value) {
    mainContainer.value.style.height = `${window.innerHeight}px`
  }

  window.addEventListener('resize', () => {
    if (mainContainer.value) {
      mainContainer.value.style.height = `${window.innerHeight}px`
    }
  })
})
</script>

<style scoped>
.main-pages {
  flex: 1;
  height: 100%;
  max-height: 100%;
  width: 100%;
  margin: 0 auto;
  background: #f8f9fa;
}
.login-page {
  flex: 1;
  height: 100%;
  max-height: 100%;
}
</style>
