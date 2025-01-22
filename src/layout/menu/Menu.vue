<template>
  <div class="sidebar">
    <div
      :class="['sidebar-section', openKeys.includes(menu) ? 'open' : '']"
      v-for="{ menu, menuName, child, url } in menus"
      :key="menu"
    >
      <!-- has children -->
      <template v-if="child?.length">
        <!-- parent menu -->
        <div class="label" @click="onExpand(menu)">
          <wb-text class="wb-text hydrated" size="m" tag="div">{{ menuName }}</wb-text>
          <wb-icon
            data-v-5528ecef=""
            slot="icon"
            class="wb-icon hydrated"
            aria-hidden="true"
            name="bds/chevron-down/24"
          ></wb-icon>
        </div>
        <!-- child menu -->
        <div class="nav-wrapper">
          <nav>
            <template v-for="{ menuName: subMenuName, url: subUrl, menu: subMenu, child: subChild } in child" :key="subMenu">
              <a
                :class="['nav-item', selectedKeys.includes(subMenu) ? 'active' : '']"
                target=""
                @click="toPage({ url: subUrl, menu: subMenu, child: subChild })"
              >
                <svg-icon :iconName="ICON_MENUS?.[subMenu]?.iconName" :size="ICON_MENUS?.[subMenu]?.size || 24" />
                <!-- <wb-icon class="service wb-icon hydrated" aria-hidden="true" name="tag/24"></wb-icon> -->
                <wb-text class="wb-text hydrated" size="m" tag="div">{{ subMenuName }}</wb-text>
              </a>
            </template>
          </nav>
        </div>
      </template>
      <!-- without children -->
      <template v-else>
        <div class="label" @click="toPage({ url, menu, child })">
          <wb-text class="wb-text hydrated" size="m" tag="div">{{ menuName }}</wb-text>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLoginStore } from '@/store/modules/login'
import { getFirstUrl } from '@/utils/index'
import {ICON_MENUS} from "./constant"
// import { TooltipStateManager } from 'ag-grid-community'

const emit = defineEmits(['toggle-menu'])

const loginStore = useLoginStore()
const currentRoute = useRoute()
const router = useRouter()
const openKeys = ref<string[]>([])
const selectedKeys = ref<string[]>([currentRoute.name as string])

const menus = computed(() => loginStore.menus)
console.log('menus', menus.value)
console.log(currentRoute, 'currentRoute')
console.log(currentRoute.name, 'selectedKeys')
// 获取当前打开的子菜单
const getOpenKeys = () => {
  return currentRoute.meta.openMenu ?? (currentRoute.matched.slice(1).map((n) => n.name) as string[])
}

// Follow page route changes to switch menu selection status
watch(
  () => currentRoute.fullPath,
  () => {
    selectedKeys.value = [currentRoute.meta?.customMenu ?? currentRoute.name] as string[]
    if (currentRoute.name === 'login') return
    openKeys.value = getOpenKeys()
  },
  {
    immediate: true
  }
)

const onExpand = (menu) => {
  if (menu === openKeys?.value?.[0]) {
    openKeys.value = []
  } else {
    openKeys.value = [menu]
  }
  console.log(openKeys, 'openKeys')
  // openKeys.value = openKeys.value.length ? [] : getOpenKeys()
}
// jump to page
const toPage = ({ url, child }) => {
  //  jump to the first authorized page
  if (child?.length) {
    const firstUrl = getFirstUrl(child)
    emit('toggle-menu')
    router.push({ path: firstUrl })
    return
  }
  emit('toggle-menu')
  router.push({ path: url })
}
</script>

<style lang="scss" scoped>
.menu-container {
  width: 100%;
  overflow: auto;

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  & > :deep(.ant-menu) {
    justify-content: center;
    width: 100%;
  }
}
.sidebar {
  box-sizing: border-box;
  // position: fixed;
  z-index: calc(var(--z-index-sidebar) + 1);
  // top: 0;
  // left: 0;
  width: auto;
  min-width: 320px;
  height: 100%;
  color: var(--wb-grey-20);
  background-color: var(--wb-white);
}
.sidebar-section.open[data-v-5528ecef] {
  background: var(--wb-grey-90);
}
.sidebar-section {
  box-sizing: border-box;
  position: relative;
  display: flex;
  gap: 0;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: auto;
  margin-top: 8px;
  cursor: pointer;
}
.sidebar-section + .sidebar-section {
  margin-top: 4px;
}
.sidebar-section .label :is(wb-text, wb-icon) {
  -webkit-user-select: none;
  user-select: none;
  color: var(--wb-grey-45);
}
.sidebar-section.open {
  background: var(--wb-grey-90);
}
.sidebar-section.open .label wb-text {
  color: var(--wb-grey-20);
}
.sidebar-section .label {
  display: flex;
  justify-content: space-between;
  position: relative;
  box-sizing: border-box;
  width: 100%;
  padding: 4px 10px 4px 16px;
}
.sidebar-section .label wb-icon {
  transition: transform 0.2s ease-in-out;
}
.sidebar-section.open .label wb-icon {
  transform: rotate(180deg);
}
.nav-wrapper {
  box-sizing: border-box;
  display: grid;
  grid-template-rows: 0fr;
  transition: 0.3s;
  overflow: hidden;
  width: 100%;
  padding: 0 8px;
}
.nav-wrapper nav {
  min-height: 0;
}
.sidebar-section.open .nav-wrapper {
  grid-template-rows: 1fr;
}
@media (hover: hover) and (pointer: fine) {
  .sidebar-section.open .label:hover {
    background: var(--wb-grey-80);
  }
  .sidebar-section > .label:hover {
    background: var(--wb-grey-90);
  }
  .sidebar-section .label:hover wb-text {
    color: var(--wb-grey-20);
  }
}

// ---------------
.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 6px;
  margin-bottom: 4px;
  border-radius: 2px;
  text-decoration: none;
}
.nav-item wb-text,
.nav-item .svg-icon {
  color: var(--wb-grey-45);
}
.nav-item.active wb-text,
.nav-item.active .svg-icon {
  font-weight: 700;
  color: var(--wb-grey-20);
}
.nav-item:last-child {
  margin-bottom: 8px;
}
.favorite {
  color: var(--wb-grey-70);
  --size: 16px;
  cursor: pointer;
  margin-left: auto;
}
.favorite.active {
  color: var(--wb-blue-45);
}
.favorite.disabled {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}
@media (hover: hover) and (pointer: fine) {
  .nav-item:hover {
    background: var(--wb-grey-80);
  }
  .nav-item:hover :is(wb-text, wb-icon):not(.favorite) {
    color: var(--wb-grey-20);
  }
  .favorite:hover {
    color: var(--wb-grey-60);
  }
  .favorite.active:hover {
    color: var(--wb-blue-20);
  }
}
</style>
