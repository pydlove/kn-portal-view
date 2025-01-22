import type { WhiteNameList } from './constant'
import type { Router } from 'vue-router'
import { useLoginStore } from '@/store/modules/login'
export function createRouterGuards(router: Router, whiteNameList: WhiteNameList) {
  router.beforeEach(async (to, from, next) => {
    next()
  })

  // router.afterEach((to, from) => {})

  router.onError((error) => {
    console.error('路由错误', error)
  })
}
