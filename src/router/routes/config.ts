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
    component: import('@/views/test/index.vue')
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('@/views/test/index.vue')
  },
]
