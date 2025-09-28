// src/api/menu.ts
import request, {defaultRequest} from '../../../utils/request'

export function doLogin(username: string, password: string) {
  return defaultRequest({
    url: '/login/do',
    data: {
      username,
      password
    },
    method: 'get'
  })
}
