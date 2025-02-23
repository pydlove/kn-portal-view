import request from '../../utils/request'
export function getAllRole(data: any) {
  return request({
    url: '/role/all',
    data,
    method: 'get'
  })
}
