import cryptoJs from 'crypto-js'
/**
 * 处理对应的返回状态等错误信息
 * @param {*} response
 */
export function checkStatus(response: any) {
  const status = response.status || -1 // -1 自己定义，连接错误的status

  if ((status >= 200 && status < 300) || status === 304) {
    // 如果http状态码正常，则直接返回数据
    return response.data
  } else {
    let errorInfo = ''
    switch (status) {
      case 400:
        errorInfo = 'Invalid Request'
        break
      case 401:
        errorInfo = 'Access token is invalid or expired'
        break
      default:
        errorInfo = 'Connection Error'
    }
    return {
      status,
      msg: errorInfo
    }
  }
}

export const encrypt = (value = '', randomCode = '') => {
  const c = cryptoJs
  if (!c || !randomCode) {
    return value
  } else {
    const key = randomCode.slice(0, 16)
    const iv = randomCode.slice(randomCode.length - 16, randomCode.length)
    const encrypted = c.AES.encrypt(c.enc.Utf8.parse(value), c.enc.Utf8.parse(key), {
      iv: c.enc.Utf8.parse(iv),
      mode: c.mode.CBC,
      padding: c.pad.Pkcs7
    })
    //return encrypted.ciphertext.toString();   // 二进制结果
    return encrypted.toString() // base64结果
  }
}
interface MenuFunctionAuthTO {
  code: string
  viewable: boolean
}
//获取页面操作map
export const getMenuInfoMap = ({
  menusList = [],
  map = undefined,
  parentMenuNames = [],
  parentMenus = [],
  level = 0
}: {
  menusList: any[]
  map?: any
  parentMenuNames?: { url: string; menuName: string }[]
  parentMenus?: string[]
  level?: number
}) => {
  if (!map) {
    map = {}
  }
  menusList.forEach((item) => {
    const { menu, viewable, menuName, url, child, menuFunctionsAuthList = [] } = item
    const btnsAuth: { [key: string]: boolean } = {}
    ;(menuFunctionsAuthList as MenuFunctionAuthTO[]).forEach((item) => {
      btnsAuth[item.code] = item.viewable
    })
    map[menu] = {
      operable: viewable,
      viewable,
      menuName,
      parentMenuNames,
      parentMenus,
      menuFunctionsAuthList,
      btnsAuth,
      brotherMenus: level > 1 ? menusList : [],
      level,
      url
    }

    if (child?.length) {
      getMenuInfoMap({
        menusList: child,
        map,
        parentMenuNames: [...parentMenuNames, { url, menuName }],
        parentMenus: [...parentMenus, menu],
        level: level + 1
      })
    }
  })
  return map
}
/**
 * @description: 递归地获取数组中第一个有效的URL
 * @param {any} arr
 * @return {*}
 */
export const getFirstUrl = (arr: any[]): string => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]?.child?.length) {
      const url = getFirstUrl(arr[i]?.child)
      if (url) {
        return url
      }
    } else {
      const { url, viewable } = arr[i] || {}
      if (viewable && url) {
        return url
      }
    }
  }
  return ''
}
