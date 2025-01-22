import { createRouter, createWebHistory } from 'vue-router'
import { basicRoutes } from './routes'
import { whiteNameList } from './constant'
import type { App } from 'vue'
import { createRouterGuards } from './guards'
// console.log(import.meta.env.BASE_URL, 'meta.env.BASE_URL')
export const router = createRouter({
  history: createWebHistory('/data-cc'),
  routes: basicRoutes
})

// reset router
export function resetRouter() {
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !whiteNameList.some((n) => n === name)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export async function setupRouter(app: App) {
  // 创建路由守卫
  createRouterGuards(router, whiteNameList)
  app.use(router)
  // 路由准备就绪后挂载APP实例
  await router.isReady()
}
export default router
