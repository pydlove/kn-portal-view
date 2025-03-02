import request from '../../utils/request'
export function getAllTable() {
  return request({
    url: '/table/all',
    method: 'get'
  })
}

export function tableDetail(data: any) {
  return request({
    url: '/table/tableInfo',
    data,
    method: 'get'
  })
}