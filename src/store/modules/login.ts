/*
 * @Author: chenamin
 * @LastModifiedBy: chenamin
 * @Date: 2024-11-28 19:57:12
 * @LastEditTime: 2024-12-27 18:00:45
 * @FilePath: /cbdt-data-classification-categorization-front/src/store/modules/login.ts
 * @Description: file content
 */
import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'
import { store } from '@/store'
import { resetRouter, router } from '@/router'
import { encrypt, getMenuInfoMap, getFirstUrl } from '@/utils/index'
import { onLogin, onLogout, onSSO, getRandomCode } from '@/api/login/login'

export const useLoginStore = defineStore(
  'login',
  () => {
    const token = ref<string>()
    const passToken = ref<boolean>(false)
    // const menus = ref<RouteRecordRaw[]>(JSON.parse(sessionStorage.getItem('_menus') || '[]'))
    // const menusMap = ref(JSON.parse(sessionStorage.getItem('_menusMap') || '{}'))
    const userName = ref('')
    // const customLastMenu = ref<null | { menuName: string }>(null)
    // const loginPageUrl = ref(sessionStorage.getItem('_loginPageUrl') || '')

    // 清空登录态(token、userName...)
    const clearLoginStatus = () => {
      token.value = ''
      userName.value = ''
      // menusMap.value = {}
      // menus.value = []
      // resetRouter()
      setTimeout(() => {
        sessionStorage.clear()
      })
    }
    // save token
    const setToken = (_token: string) => {
      token.value = _token
      sessionStorage.setItem('_token', _token)
    }
    // SSO
    // const sso = async () => {
    //   try {
    //     let firstUrl
    //     const res = await onSSO({})
    //
    //     console.log(res)
    //
    //     const { menusAuthList = [], userName: _userName, responseCode: responseCode, loginPageUrl: _loginPageUrl } = res || {}
    //
    //     if (responseCode === 200) {
    //       const _menusMap = getMenuInfoMap({ menusList: menusAuthList })
    //
    //       sessionStorage.setItem('_menusMap', JSON.stringify(_menusMap))
    //       sessionStorage.setItem('_menus', JSON.stringify(menusAuthList))
    //       sessionStorage.setItem('_loginPageUrl', _loginPageUrl)
    //       console.log('_loginPageUrl', _loginPageUrl)
    //
    //       menus.value = menusAuthList
    //       menusMap.value = _menusMap
    //       userName.value = _userName
    //       loginPageUrl.value = _loginPageUrl
    //       firstUrl = getFirstUrl(menusAuthList)
    //     } else if (responseCode === 401 && loginPageUrl) {
    //       window.location.href = _loginPageUrl
    //       return
    //     } else {
    //       firstUrl = 'no-permission'
    //     }
    //
    //     return Promise.resolve({
    //       firstUrl,
    //       response: res
    //     })
    //   } catch (error) {
    //     return Promise.reject(error)
    //   }
    // }

    const login = async (params: API.LoginDto) => {
      try {
        const { randomCode, randomId } = await getRandomCode()
        const userPwd = encrypt(params.passwordValue, randomCode)
        const username = params.usernameValue
        const res = await onLogin({ username, userPwd, randomId })
        // const { menusAuthList = [], userName: _userName } = res || []
        // const _menusMap = getMenuInfoMap({ menusList: menusAuthList })

        // const hasPermission = Object.values(_menusMap).some((item: any) => item.viewable)
        //
        // if (!hasPermission) {
        //   // message.error('This is an error message')
        //   return
        // }
        // sessionStorage.setItem('_menusMap', JSON.stringify(_menusMap))
        // sessionStorage.setItem('_menus', JSON.stringify(menusAuthList))
        // menus.value = menusAuthList
        // menusMap.value = _menusMap
        // userName.value = _userName
        // const firstUrl = getFirstUrl(menusAuthList)

        return Promise.resolve({
          // firstUrl,
          response: res
        })
      } catch (error) {
        return Promise.reject(error)
      }
    }

    const logout = async () => {
      await onLogout({ userName: userName.value })
      jumpToLogin()
    }

    // Jump to SSO page
    // const jumpToSso = () => {
    //   router.push({
    //     path: '/sso'
    //   })
    //   clearLoginStatus()
    // }

    const jumpToLogin = () => {
      clearLoginStatus()
      router.push({
        path: '/login'
      })

    }

    return {
      token,
      // menusMap,
      // menus,
      userName,
      // customLastMenu,
      // loginPageUrl,
      login,
      logout,
      setToken,
      clearLoginStatus,
      jumpToLogin,
      // jumpToSso,
      // sso
    }
  },
  {
    persist: {
      pick: ['token', 'userName']
    }
  }
)

export function useLoginStoreWithOut() {
  return useLoginStore(store)
}
