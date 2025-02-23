import request from '../../utils/request'
export function getAllTable(data: any) {
  return request({
    url: '/table/all',
    data,
    method: 'get'
  })
}
