import {type RouteRecordRaw} from 'vue-router'

export interface IMeta {
  customMenu?: string
  customTailMenus?: { menuName: string; url?: string }[]
  customContentWidth?: boolean
  customContentBar?: boolean // background: black
  customContentHeader?: boolean // background: grey
  showBack?: boolean
}

export const BASIC_ROUTES: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'root',
    meta: {hideHeader: false},
    component: import('@/views/kn/home/index.vue')
  },

  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/kn/home/index.vue')
  },

  {
    path: '/main',
    name: 'main',
    component: () => import('@/views/kn/main/index.vue')
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('@/views/test/index.vue')
  },

  {
    path: '/noAuth',
    name: 'noAuth',
    meta: {hideHeader: true},
    component: () => import('@/views/NoPermission.vue')
  },
  {
    path: '/error',
    name: 'error',
    meta: {hideHeader: true},
    component: () => import('@/views/ErrorPage.vue')
  },
  {
    path: '/index',
    name: 'index',
    meta: {hideHeader: true},
    component: () => import('@/views/kn/console/index/index.vue')
  },
  {
    path: '/menu',
    name: 'menu',
    meta: {hideHeader: true},
    component: () => import('@/views/kn/console/menu/index.vue')
  },
  {
    path: '/article',
    name: 'article',
    meta: {hideHeader: true},
    component: () => import('@/views/kn/console/article/index.vue')
  }

]
