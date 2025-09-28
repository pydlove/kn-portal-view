// src/store/modules/login.ts
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { store } from '@/store'
import { router } from '@/router'
import { encrypt } from "@/utils"
import { getRandomCode, onLogin, onLogout } from "@/api/console/login/login"

export const useLoginStore = defineStore(
  'login',
  () => {
    const token = ref<string>()
    const userName = ref('')

    // 清空登录态(token、userName...)
    const clearLoginStatus = () => {
      token.value = undefined
      userName.value = ''
      sessionStorage.removeItem('_token')
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
    }

    // 保存 token
    const setToken = (_token: string) => {
      token.value = _token
      sessionStorage.setItem('_token', _token)
    }

    const login = async (params: API.LoginDto) => {
      try {
        const { randomCode, randomId } = await getRandomCode()
        const userPwd = encrypt(params.passwordValue, randomCode)
        const username = params.usernameValue
        const res = await onLogin({ username, userPwd, randomId })

        const { menuList = [], userName: _userName, token: resToken } = res || []

        // 设置token到store和localStorage
        if (resToken) {
          setToken(resToken)
          localStorage.setItem('token', resToken)
        }

        sessionStorage.setItem('_menus', JSON.stringify(menuList))
        sessionStorage.setItem('username', _userName)
        userName.value = _userName
        const firstUrl = menuList[0]

        return Promise.resolve({
          firstUrl,
          response: res
        })
      } catch (error) {
        return Promise.reject(error)
      }
    }

    const logout = async () => {
      try {
        await onLogout({ userName: userName.value })
      } finally {
        jumpToLogin()
      }
    }

    const jumpToLogin = () => {
      clearLoginStatus()
      router.push({
        path: '/login'
      })
    }

    // 处理未授权情况，根据服务类型跳转到不同的登录页面
    const jumpToNoAuth = (serviceType?: string) => {
      // 清除认证信息
      clearLoginStatus()

      // 根据服务类型跳转到不同的登录页面
      if (serviceType === 'ruankao') {
        router.push('/rk/login')
      } else {
        // 其他服务默认跳转到通用登录页
        router.push('/login')
      }
    }

    return {
      token,
      userName,
      login,
      logout,
      setToken,
      clearLoginStatus,
      jumpToNoAuth,
      jumpToLogin
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
