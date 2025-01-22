/*
 * @Author: chenamin
 * @LastModifiedBy: chenamin
 * @Date: 2024-12-06 10:42:31
 * @LastEditTime: 2024-12-09 14:15:48
 * @FilePath: /cbdt-data-classification-categorization-front/src/hooks/usePageInfo.ts
 * @Description: file content
 */
/**
 * Obtain permission for buttons on the current page
 */

import { useLoginStore } from '@/store/modules/login'
import { useRoute } from 'vue-router'

interface MenuItem {
  btnsAuth?: IBtnsAuth
  [key: string]: any
}

export interface IBtnsAuth {
  [key: string]: string
}
export function usePageInfo(pageKey?: string) {
  const loginStore = useLoginStore()
  const route = useRoute()
  const name = pageKey || route.name

  if (!name) return {}
  const menu: MenuItem = loginStore.menusMap?.[name] || {}
  const { btnsAuth } = menu
  return { btnsAuth }
}
