import { ruankaoRequest } from '@/utils/request'

// 用户注册
export function registerUser(data: {
  username: string
  password: string
  confirmPassword: string
  verificationCode: string
}) {
  return ruankaoRequest({
    url: '/rk_user/register',
    method: 'post',
    data
  })
}

// 用户登录
export function loginUser(data: {
  username: string
  password: string
  verificationCode: string
}) {
  return ruankaoRequest({
    url: '/rk_user/login',
    method: 'post',
    data
  })
}
export function onLogout() {
  return ruankaoRequest({
    url: '/rk_user/logout',
    method: 'get',
  })
}

// 发送验证码
export function getVerificationCode(data: {
  key: string
}) {
  return ruankaoRequest({
    url: '/rk_user/get-code',
    method: 'post',
    data
  })
}

export function getVerificationKey() {
  return ruankaoRequest({
    url: '/rk_user/get-key',
    method: 'get',
  });
}
