import request from '../../utils/request'
export function getAllTable() {
  return request({
    url: '/table/all',
    method: 'get'
  })
}
