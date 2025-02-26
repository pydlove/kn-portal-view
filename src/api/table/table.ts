import request from '../../utils/request'
export function getAllTable() {
  return request({
    url: '/table/all',
    method: 'get'
  })
}

export function tableDetail() {
  return request({
    url: '/table/tableInfo',
    method: 'get'
  })
}