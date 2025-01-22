/*
 * @Author: chenamin
 * @LastModifiedBy: chenamin
 * @Date: 2024-11-28 19:57:12
 * @LastEditTime: 2024-12-20 13:54:27
 * @FilePath: /cbdt-data-classification-categorization-front/src/store/modules/global.ts
 * @Description: file content
 */
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { store } from '@/store'

export const useGlobalStore = defineStore(
  'global',
  () => {
    const repeatSubmit = ref<boolean>(false)
    const setRepeatSubmit = (bool: boolean) => {
      repeatSubmit.value = bool
    }

    return {
      repeatSubmit,
      setRepeatSubmit,
      themeConfig: {
        token: {
          colorPrimary: '#0078d6',
          borderRadius: 2,
          fontSize: 16
        }
      }
    }
  },
  {
    persist: {
      pick: []
    }
  }
)

export function useGlobalStoreWithOut() {
  return useGlobalStore(store)
}
