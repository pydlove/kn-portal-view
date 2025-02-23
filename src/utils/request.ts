import axios, { AxiosInstance } from 'axios'
import Qs from 'qs' // Import the qs module to serialize post type data
import { checkStatus } from './index'
import { useLoginStoreWithOut } from '@/store/modules/login'
import { useGlobalStoreWithOut } from '@/store/modules/global'
import { message } from 'ant-design-vue'

interface IApiConfig {
  url: string
  method?: string
  data?: any
  setRepeatLoading?: {
    repeatSubmit: boolean
  }
  baseURL?: string
  isHandleError?: string // Whether to handle interface failure uniformly (prompt information)
  [x: string]: any
}

// Configuration for canceling duplicate requests
let cancel,
  promiseArr = {}
const CancelToken = axios.CancelToken
const source = CancelToken.source()

const defaultHeader = {
  'Cache-Control': 'no-cache',
  Accept: 'application/json',
  'Content-Type': 'application/json;charset=utf-8'
}

const service: AxiosInstance = axios?.create({
  timeout: 300000,
  headers: {
    ...defaultHeader
  }
})

service.interceptors.request.use(
  (config) => {
    // Add token to request header
    const loginStore = useLoginStoreWithOut()
    const token = loginStore.token

    // console.log(token, ' request token ')
    if (token && config.headers) {
      config.headers['token'] = token
    }
    // Globally add cancelToken
    config.cancelToken = source.token
    cancel = source.cancel
    // Cancel the ongoing identical request when a new request is initiated
    if (promiseArr[config.url]) {
      // promiseArr[config.url] = cancel
    } else {
      promiseArr[config.url] = cancel
    }

    if (['post', 'delete', 'patch', 'put'].includes(config.method.toLocaleLowerCase())) {
      const contentType = config.headers['Content-Type']
      // Convert data format based on Content-Type
      if (typeof contentType === 'string') {
        if (contentType.includes('multipart')) {
          // type 'multipart/form-data;'
          // config.data = data;
        } else if (contentType.includes('json')) {
          // type 'application/json;'
          // raw body "{name:"nowThen",age:"18"}"(ordinary string)
          config.data = JSON.stringify(config.data)
        } else {
          // type 'application/x-www-form-urlencoded;'
          // raw body name=nowThen&age=18
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

service.interceptors.response.use(
  (response) => {
    const loginStore = useLoginStoreWithOut()
    const { token } = response.headers

    // console.log(token, ' request token ')
    if (token) {
      loginStore.setToken(token)
    }

    // Interface status is 401
    const { status } = response || {}
    // Token verification failed, re-login or request timed out, redirect to login page
    if (status === 401 || status === 408) {
      promiseArr = {}
      loginStore.jumpToLogin()
      return Promise.resolve({})
    }
    if (response) {
      return Promise.resolve(checkStatus(response))
    }
  },
  (error) => {
    // console.error('Response Error:', error)
    if (axios.isCancel(error)) {
      return Promise.reject({ msg: error.message || 'Request Cancel' })
    }
    if (error.response) {
      const { status } = error.response
      // Determine if authentication fails, redirect to login page if so
      if (status === 401) {
        const loginStore = useLoginStoreWithOut()
        // message.error('The user information is invalid. Please login again')
        loginStore.jumpToLogin()
        return
      }
      if (status === 400) {
        console.log(error.response.data)
        message.error({ content: error.response.data.data, key: 'error' })
      }
      return Promise.reject(error.response?.data)
    } else if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
      promiseArr = {}
      // setTimeout(() => {
      //   jumpToLogin()
      // }, 3000)
      return Promise.reject({ msg: 'Request Timeout' })
    } else {
      return Promise.reject(error)
    }
  }
)

/**
 * @description:
 * @param {*} opt
 * @param {*} isThrowErr
 * @return {*}
 */
const request = async (opt: IApiConfig, isThrowErr = true) => {
  const globalStore = useGlobalStoreWithOut()
  const { setRepeatLoading, headers = {}, ...restOpt } = opt || {}
  let options = {
    method: 'get',
    isHandleError: true,
    headers: { ...defaultHeader, ...headers },
    baseURL: '/one-table-service',
    ...restOpt
  }

  const { repeatSubmit } = setRepeatLoading || {}
  // Prevent duplicates
  if (repeatSubmit && globalStore.repeatSubmit) {
    return
  }
  try {
    if (['get'].includes(options.method.toLowerCase())) {
      options.params = { ...options.data }
    }
    // remove spaces before and after parameter values and parameters with null values before the request
    // moveSpaceBeforeAndAfter(options.params)

    if (repeatSubmit) {
      globalStore.setRepeatSubmit(true)
    }
    const res = await service(options)
    delete promiseArr[options.url]

    const { data } = res
    return data
  } catch (err: any) {
    // handle response message
    console.log(err, 'err')
    const { error } = err
    const { message: messageText = '' } = (error as { code?: number; message?: string }) || {}
    if (options.isHandleError) {
      if (messageText) {
        message.error({ content: messageText, key: 'error' })
      }
    }
    delete promiseArr[options.url]
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

export default request
