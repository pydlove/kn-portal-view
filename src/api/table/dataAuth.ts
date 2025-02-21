import request from '../../utils/request'
export function checkAccessAuth(data: any) {
  return request({
    url: '/auth/check',
    data,
    method: 'get'
  })
}

