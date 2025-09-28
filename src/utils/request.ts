// src/utils/request.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import Qs from 'qs'
import { checkStatus } from './index'
import { useLoginStoreWithOut } from '@/store/modules/login'
import { useGlobalStoreWithOut } from '@/store/modules/global'
import { message } from 'ant-design-vue'

// 定义服务基础URL常量
export const SERVICE_BASE_URLS = {
  DEFAULT: '/kn-service',
  RUANKAO: '/ruankao-service'
  // 可以继续添加其他服务的baseURL
} as const

// API配置接口
interface IApiConfig extends AxiosRequestConfig {
  setRepeatLoading?: {
    repeatSubmit: boolean
  }
  isHandleError?: boolean // 是否统一处理接口失败（提示信息）
}

// 默认请求头
const defaultHeader = {
  'Cache-Control': 'no-cache',
  Accept: 'application/json',
  'Content-Type': 'application/json;charset=utf-8'
}

// 创建请求实例的工厂函数
function createService(baseURL: string): AxiosInstance {
  const service: AxiosInstance = axios.create({
    baseURL,
    timeout: 300000,
    headers: {
      ...defaultHeader
    }
  })

  // 请求拦截器
  service.interceptors.request.use(
    (config) => {
      // 添加token到请求头
      const loginStore = useLoginStoreWithOut()

      // 优先从store获取token，其次从sessionStorage获取
      let token = loginStore.token
      if (!token) {
        token = sessionStorage.getItem('_token') || localStorage.getItem('token') || ''
        if (token) {
          loginStore.setToken(token)
        }
      }

      if (token && config.headers) {
        config.headers['token'] = token
      }

      // 数据格式转换
      if (['post', 'delete', 'patch', 'put'].includes(config.method?.toLowerCase() || '')) {
        const contentType = config.headers['Content-Type']
        if (typeof contentType === 'string') {
          if (contentType.includes('multipart')) {
            // multipart/form-data 类型处理
          } else if (contentType.includes('json')) {
            // application/json 类型处理
            config.data = JSON.stringify(config.data)
          } else {
            // application/x-www-form-urlencoded 类型处理
            config.data = Qs.stringify(config.data)
          }
        }
      }
      return config
    },
    (error) => {
      console.error('Request Error:', error)
      return Promise.reject(error)
    }
  )

  // 响应拦截器
  service.interceptors.response.use(
    (response) => {
      const loginStore = useLoginStoreWithOut()
      const { token } = response.headers

      if (token) {
        loginStore.setToken(token)
        localStorage.setItem('token', token)
      }

      const { status } = response || {}
      // Token验证失败或请求超时，重定向到登录页
      if (status === 401 || status === 408) {
        // 根据 baseURL 判断是哪个服务返回的 401
        const baseURL = response?.config?.baseURL || ''
        if (baseURL.includes(SERVICE_BASE_URLS.RUANKAO)) {
          loginStore.jumpToNoAuth('ruankao')
        } else {
          loginStore.jumpToNoAuth()
        }
        return Promise.resolve({})
      }

      if (response) {
        return Promise.resolve(checkStatus(response))
      }
    },
    (error) => {
      if (axios.isCancel(error)) {
        return Promise.reject({ msg: error.message || 'Request Cancel' })
      }

      if (error.response) {
        const { status, config } = error.response
        // 认证失败处理
        if (status === 401) {
          const loginStore = useLoginStoreWithOut()
          // 根据请求的 baseURL 判断是哪个服务
          const baseURL = config?.baseURL || ''
          if (baseURL.includes(SERVICE_BASE_URLS.RUANKAO)) {
            loginStore.jumpToNoAuth('ruankao')
          } else {
            loginStore.jumpToNoAuth()
          }
          return
        }

        if (status === 400) {
          message.error({ content: error.response.data.data, key: 'error' })
        }
        return Promise.reject(error.response?.data)
      } else if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
        return Promise.reject({ msg: 'Request Timeout' })
      } else {
        return Promise.reject(error)
      }
    }
  )

  return service
}

// 为不同服务创建请求实例
const services = {
  default: createService(SERVICE_BASE_URLS.DEFAULT),
  ruankao: createService(SERVICE_BASE_URLS.RUANKAO)
  // 可以继续添加其他服务实例
}

// 通用请求函数
const request = async (serviceType: keyof typeof services, opt: IApiConfig, isThrowErr = true) => {
  const globalStore = useGlobalStoreWithOut()
  const { setRepeatLoading, headers = {}, ...restOpt } = opt || {}

  let options: AxiosRequestConfig = {
    method: 'get',
    ...restOpt,
    headers: { ...defaultHeader, ...headers }
  }

  const { repeatSubmit } = setRepeatLoading || {}

  // 防止重复提交
  if (repeatSubmit && globalStore.repeatSubmit) {
    return
  }

  try {
    if (options.method?.toLowerCase() === 'get') {
      options.params = { ...options.data }
    }

    if (repeatSubmit) {
      globalStore.setRepeatSubmit(true)
    }

    const service = services[serviceType] || services.default
    const res = await service(options)

    const { data } = res
    return data
  } catch (err: any) {
    // 处理响应错误
    console.log(err, 'err')
    const { error } = err
    const { message: messageText = '' } = (error as { code?: number; message?: string }) || {}

    if (opt.isHandleError !== false) {
      if (messageText) {
        message.error({ content: messageText, key: 'error' })
      }
    }

    if (isThrowErr) {
      throw error
    } else {
      return error
    }
  } finally {
    if (repeatSubmit) {
      globalStore.setRepeatSubmit(false)
    }
  }
}

// 导出针对不同服务的请求方法
export const defaultRequest = (opt: IApiConfig, isThrowErr = true) =>
  request('default', opt, isThrowErr)

export const ruankaoRequest = (opt: IApiConfig, isThrowErr = true) =>
  request('ruankao', opt, isThrowErr)

// 如果需要添加新服务，可以这样扩展：
// export const newServiceRequest = (opt: IApiConfig, isThrowErr = true) =>
//   request('newService', opt, isThrowErr)

export default request
