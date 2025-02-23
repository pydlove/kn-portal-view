import { type RouteRecordRaw } from 'vue-router'
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
    meta: { hideHeader: false },
    component: import('@/views/login/index.vue')
  },
  {
    path: '/login',
    name: 'login',
    meta: { hideHeader: true },
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/apply',
    name: 'apply',
    meta: { hideHeader: false },
    component: () => import('@/views/table/apply/index.vue')
  },
  {
    path: '/query',
    name: 'query',
    meta: { hideHeader: false },
    component: () => import('@/views/table/query/index.vue')
  },
  {
    path: '/test',
    name: 'test',
    meta: { hideHeader: false },
    component: () => import('@/views/test/index.vue')
  },
]
