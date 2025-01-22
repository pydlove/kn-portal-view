<!--
 * @Author: chenamin
 * @LastModifiedBy: chenamin
 * @Date: 2024-11-12 10:07:51
 * @LastEditTime: 2024-12-26 10:56:06
 * @FilePath: /cbdt-data-classification-categorization-front/src/layout/Header.vue
 * @Description: file content
-->
<template>
  <header>
    <div class="headers">
      <wb-grid full-width>
        <wb-grid-row class="wbgrid-header">
          <wb-grid-col mq1="12" class="header-contents">
            <div class="wbheader-left">
              <button class="" @click="toggleMenu">
                <div class="nav-icon">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </button>
              <a class="logo" @click="toPage({ url: '/todo/list' })">
                <span class="logo-container">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 15">
                    <g class="mbos">
                      <path
                        d="m13.53,14.24v.48c-1.32-.11-1.51-.13-2.23-.13h-.04c-.76,0-1.3.04-2.33.13v-.48c1.32-.13,1.53-.26,1.49-1.86l-.3-10.4-3.76,12.41h-.26L2.4,2.01l-.32,10.37c-.04,1.6.17,1.73,1.49,1.86v.48c-.82-.09-1.25-.13-1.84-.13h-.02c-.54,0-1.08.06-1.71.13v-.48c1.19-.13,1.43-.28,1.47-1.86l.3-9.86c.04-1.58-.15-1.73-1.34-1.86V.19c1.32.11,1.51.13,2.01.13.54,0,.84-.02,1.17-.06l3.16,10.68L9.99.26c.3.04.71.06,1.1.06.5,0,.69-.02,2.01-.11v.48c-1.19.11-1.38.26-1.34,1.84l.3,9.86c.04,1.58.28,1.73,1.47,1.86Z"
                      ></path>
                      <path
                        d="m23.79,10.79c0,2.38-1.84,3.89-4.09,3.89h-4.97v-.48c1.19-.07,1.4-.26,1.4-1.73V2.44c0-1.47-.22-1.66-1.4-1.73V.24h4.34c2.51,0,4.06,1.36,4.06,3.46,0,1.64-1.06,2.85-2.55,3.35,1.82.32,3.2,1.71,3.2,3.74ZM17.79.84v6.07h.99c1.82,0,2.62-1.17,2.62-3.05s-.8-3.03-2.62-3.03h-.99Zm4.26,9.94c0-2.01-.78-3.26-2.55-3.26h-1.71v5.68c0,.61.13.86,1.06.86h.65c1.77,0,2.55-1.25,2.55-3.29Z"
                      ></path>
                      <path d="m25.18,13.79c0-.63.43-1.1,1.08-1.1s1.08.48,1.08,1.1-.43,1.1-1.08,1.1-1.08-.48-1.08-1.1Z"></path>
                      <path
                        d="m28.4,7.46C28.4,2.59,30.67.02,33.41.02s5.01,2.57,5.01,7.44-2.27,7.44-5.01,7.44-5.01-2.57-5.01-7.44Zm8.28,0c0-4.26-1.06-6.87-3.26-6.87s-3.26,2.62-3.26,6.87,1.06,6.87,3.26,6.87,3.26-2.62,3.26-6.87Z"
                      ></path>
                      <path
                        d="m48.06,10.94c0,2.12-1.69,3.96-3.98,3.96-1.23,0-2.33-.54-2.92-1.32l-.56,1.43h-.3v-4.95h.43c.37,2.68,1.32,4.28,3.29,4.28,1.66,0,2.64-.97,2.64-2.55s-.84-2.53-2.23-3.35l-1.58-.93c-1.47-.86-2.42-1.94-2.42-3.85,0-2.33,1.77-3.63,3.52-3.63,1.23,0,2.18.69,2.68,1.45l.43-1.47h.3v4.32h-.39c-.35-2.1-1.3-3.74-2.94-3.74-1.45,0-2.29.99-2.29,2.51,0,1.38.76,2.12,2.01,2.85l1.88,1.1c1.51.89,2.42,2.01,2.42,3.89Z"
                      ></path>
                    </g>
                    <g class="portal-claim">
                      <path
                        d="m69.1,4.54c0,2.9-2.12,4.32-4.95,4.32h-2.51v5.81h-2.01V.24h4.52c2.83,0,4.95,1.43,4.95,4.3Zm-2.12.02c0-1.9-1.08-2.77-2.96-2.77h-2.38v5.53h2.38c1.88,0,2.96-.86,2.96-2.77Z"
                      ></path>
                      <path
                        d="m70.24,9.53c0-3.31,1.99-5.34,4.78-5.34s4.78,2.03,4.78,5.34-1.97,5.36-4.78,5.36-4.78-2.03-4.78-5.36Zm7.56,0c0-2.53-1.08-3.89-2.79-3.89s-2.79,1.36-2.79,3.89,1.08,3.91,2.79,3.91,2.79-1.36,2.79-3.91Z"
                      ></path>
                      <path
                        d="m87.53,4.28v1.73c-.35-.06-.71-.06-1.04-.06-1.43,0-2.55,1.08-2.55,3.29v5.45h-1.9V4.41h1.82v1.92c.52-1.28,1.53-2.14,2.92-2.14.26,0,.52.02.76.09Z"
                      ></path>
                      <path
                        d="m94.77,13.16v1.4c-.56.22-1.21.32-1.99.32-1.45,0-2.49-.73-2.49-2.51v-6.59h-1.9v-1.38h1.9v-2.16l1.9-.69v2.85h2.46v1.38h-2.46v6.2c0,1.17.43,1.45,1.1,1.45.56,0,.97-.11,1.47-.28Z"
                      ></path>
                      <path
                        d="m102.42,14.68c-.06-.5-.11-1.17-.15-1.77-.63,1.25-1.69,1.99-3.24,1.99-1.77,0-3.05-1.02-3.05-2.85,0-2.01,1.49-2.85,3.24-3.26,1.21-.28,2.07-.41,2.94-.54v-.6c0-1.51-.84-2.03-2.12-2.03-1.04,0-1.99.6-2.03,1.79h-1.56c.04-1.97,1.66-3.2,3.7-3.2,2.38,0,3.93,1.23,3.93,3.63v4.17c0,.93.09,1.84.17,2.68h-1.84Zm-.26-4.13v-1.17c-.71.13-1.43.26-2.29.5-1.38.37-1.92.99-1.92,2.05s.63,1.62,1.58,1.62c1.47,0,2.64-1.17,2.64-3Z"
                      ></path>
                      <path
                        d="m110.2,14.72c-.32.09-.78.17-1.38.17-1.21,0-2.05-.58-2.05-2.07V.24h1.9v12.13c0,.89.35,1.08.76,1.08.32,0,.58-.06.78-.13v1.4Z"
                      ></path>
                    </g>
                  </svg> </span
              ></a>
              <!-- <a class="mr24 circle-hover" @click="toggleMenu"> -->
              <!-- <SvgIcon icon="generalMenu" color="#fff" /> -->
              <!-- </a> -->
              <div class="breadcrumbs" data-on="contrast">
                <wb-horizontal-scroll
                  theme="dark"
                  class="wb-horizontal-scroll hydrated"
                  style="--parent-background-color: var(--wb-color-background-main)"
                >
                  <wb-breadcrumbs class="wb-breadcrumbs hydrated">
                    <wb-breadcrumb class="initial-breadcrumb wb-breadcrumb hydrated"></wb-breadcrumb>
                    <template v-for="item in breadcrumbs" :key="item">
                      <wb-breadcrumb
                        :class="['wb-breadcrumb', 'hydrated', item.url ? '' : 'bread-default']"
                        @click="toPage({ url: item.url })"
                        >{{ item.menuName }}</wb-breadcrumb
                      >
                    </template>
                  </wb-breadcrumbs>
                  <span style=""><slot name="breadcrumbs"></slot> </span>
                </wb-horizontal-scroll>
              </div>
            </div>

            <!-- logout -->
            <!-- <div class="wbheader-right">
              <a-dropdown placement="bottomLeft" arrow>
                <wb-avatar size="m" class="wb-avatar hydrated avatar-icons" tabindex="0">
                  <wb-icon name="bds/user/24" class="wb-icon hydrated" aria-hidden="true"></wb-icon>
                </wb-avatar>
                <template #overlay>
                  <a-menu>
                    <a-menu-item>
                      <a href="javascript:;" @click="logout">退出</a>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </div> -->
          </wb-grid-col>
        </wb-grid-row>
      </wb-grid>
    </div>
    <!-- content bar: menu tab level 3 or custom tab -->
    <template v-if="isShowContentBar">
      <content-bar></content-bar>
    </template>
    <!-- content header -->
    <template v-if="isShowContentHeader">
      <content-header></content-header>
    </template>
    <!-- side menu: level 1 and level 2  -->
    <a-drawer v-model:open="open" class="sidebar-content" root-class-name="sidebar-wrapper" placement="left">
      <AsideMenu @toggle-menu="toggleMenu" />
    </a-drawer>
  </header>
</template>

<script setup lang="ts" name="GlobalHeader">
import { useRoute, useRouter } from 'vue-router'
import AsideMenu from './menu/Menu.vue'
import { useLoginStore } from '@/store/modules/login'
import { ref, computed, watch } from 'vue'
import ContentBar from '@/components/ContentBar/index.vue'
import ContentHeader from '@/components/ContentHeader/index.vue'
const loginStore = useLoginStore()
const currentRoute = useRoute()
const router = useRouter()
const open = ref<boolean>(false)

const isShowContentBar = computed(() => {
  const { meta } = currentRoute
  const { customContentBar } = meta
  return customContentBar ? false : true
})
const isShowContentHeader = computed(() => {
  const { meta } = currentRoute
  const { customContentHeader } = meta
  return customContentHeader ? false : true
})

const breadcrumbs = computed(() => {
  // if it is not a route in the menu data, you need to manually add it in the route configuration meta
  const { name, meta } = currentRoute
  const { customMenu, customTailMenus = [] } = meta
  // get menu
  const { menusMap = {} } = loginStore
  const menuInfo = menusMap?.[customMenu] || menusMap?.[name] || {}
  const { parentMenuNames = [], menuName, url } = menuInfo || {}
  const lastMenu = loginStore.customLastMenu ? [loginStore.customLastMenu] : customTailMenus
  const tailMenus = [...(menuName ? [{ menuName: menuName, url }] : []), ...(Array.isArray(lastMenu) ? lastMenu : [])]
  return [...parentMenuNames, ...tailMenus]
})

watch(
  () => currentRoute.fullPath,
  () => {
    loginStore.customLastMenu = null
  },
  {
    immediate: true
  }
)
const logout = () => {
  loginStore.logout()
}
const toggleMenu = () => {
  open.value = !open.value
}

// jump to page
const toPage = ({ url }) => {
  if (!url) return
  router.push({ path: url })
}
</script>

<style lang="scss" scoped>
@use './scss/global-header.scss';
@use './scss/button.scss';
@use './scss/logo.scss';
@use './scss/breadcrumb.scss';
</style>
<style lang="scss">
.sidebar-wrapper {
  box-shadow: var(--wb-shadow-m);
}
.sidebar-content {
  .ant-drawer-body {
    padding: 0 8px 17px;
  }
}
</style>
