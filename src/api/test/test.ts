import request from '../../utils/request'

export function getTestPage(data: { name: string; page: number; rows: number }) {
  return request({
    url: '/test/page',
    data,
    method: 'get'
  })
}
