import request from '../../utils/request'
export function onLogin(data: any) {
  return request({
    url: '/login/do',
    data,
    method: 'post'
  })
}
export function onLogout(data: any) {
  return request({
    url: '/login/logout',
    data
  })
}

export function getRandomCode(data?: any) {
  return request({
    url: '/login/random-code',
    data
  })
}

export function onSSO(data: any) {
  return request({
    url: '/login/sso',
    data,
    method: 'get'
  })
}

