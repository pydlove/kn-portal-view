<!--
 * @Author: chenamin
 * @LastModifiedBy: chenamin
 * @Date: 2024-11-28 17:54:56
 * @LastEditTime: 2024-12-24 14:23:09
 * @FilePath: /cbdt-data-classification-categorization-front/src/layout/index.vue
 * @Description: file content
-->
<template>
  <div class="app-main-content-wrapper">
    <page-header />
    <Layout.Content class="app-main-content">
      <template v-if="!!currentRoute.meta.customContentWidth">
        <View />
      </template>
      <template v-else>
        <wb-grid class="wb-grid hydrated">
          <View />
        </wb-grid>
      </template>
    </Layout.Content>
    <page-footer />
  </div>
</template>

<script lang="ts" setup>
import { Layout } from 'ant-design-vue'
import { useRoute } from 'vue-router'
import View from './View.vue'
import PageHeader from './Header.vue'
import PageFooter from './Footer.vue'
const currentRoute = useRoute()
</script>
<style lang="scss" scoped>
.app-main-content-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.app-main-content {
  flex: 1;
}
</style>
