// src/api/menu.ts
import request from '../../utils/request'

export function doLogin(username: string, password: string) {
  return request({
    url: '/login/do',
    data: {
      username,
      password
    },
    method: 'get'
  })
}
