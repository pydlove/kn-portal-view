<!--
 * @Author: chenamin
 * @LastModifiedBy: chenamin
 * @Date: 2024-11-29 20:37:05
 * @LastEditTime: 2024-12-14 16:24:06
 * @FilePath: /cbdt-data-classification-categorization-front/src/layout/menu/ThirdMenu.vue
 * @Description: file content
-->
<template>
  <template v-if="thirdMenus?.length">
    <div class="bar app-nav-bar" style="height: 48px">
      <wb-horizontal-scroll class="wb-horizontal-scroll hydrated" theme="light" style="--parent-background-color: rgb(0, 0, 0)">
        <div class="app-nav-items">
          <a
            :class="['navigation-item', menu === currentRoute.name ? 'active' : '']"
            v-for="{ url, menuName, menu, child } in thirdMenus"
            :key="menu"
            @click="toPage({ url, menu, child })"
          >
            <div class="inner">
              <wb-text class="wb-text hydrated" size="m" tag="div"> <slot></slot>{{ menuName }}</wb-text>
            </div>
          </a>
          <!-- <a class="navigation-item active">
            <div class="inner">
              <wb-text class="wb-text hydrated" size="m" tag="div"> <slot></slot>Notifications</wb-text>
            </div>
          </a> -->
        </div>
      </wb-horizontal-scroll>
    </div>
    <div class="app-nav-spacer" style="height: 48px"></div>
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLoginStore } from '@/store/modules/login'
import { getFirstUrl } from '@/utils/index'

const currentRoute = useRoute()
const router = useRouter()
const loginStore = useLoginStore()

const thirdMenus = computed(() => {
  // get name
  const { name, meta } = currentRoute
  const { customMenu } = meta
  // get menu
  const { menusMap = {} } = loginStore
  const menuInfo = menusMap?.[name] || menusMap?.[customMenu] || {}
  const { brotherMenus, level } = menuInfo || {}
  if (level > 1 && brotherMenus?.length) {
    return brotherMenus
  }
  return []
})

// jump to page
const toPage = ({ url, child }) => {
  //  jump to the first authorized page
  if (child?.length) {
    const firstUrl = getFirstUrl(child)
    router.push({ path: firstUrl })
    return
  }
  router.push({ path: url })
}
</script>

<style scoped lang="scss">
@use '../scss/bar.scss';
@use '../scss/navigation-item.scss';
</style>
