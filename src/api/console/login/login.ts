import {defaultRequest} from '../../../utils/request'
export function onLogin(data: any) {
  return defaultRequest({
    url: '/login/do',
    data,
    method: 'post'
  })
}
export function onLogout(data: any) {
  return defaultRequest({
    url: '/login/logout',
    data
  })
}

export function getRandomCode(data?: any) {
  return defaultRequest({
    url: '/login/random-code',
    data
  })
}

export function logout(data: any) {
  return defaultRequest({
    url: '/login/logout',
    data,
    method: 'get'
  })
}
export function onSSO(data: any) {
  return defaultRequest({
    url: '/login/sso',
    data,
    method: 'get'
  })
}

