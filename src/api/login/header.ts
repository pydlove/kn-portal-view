import request from '../../utils/request'
export function readMessge(data: any) {
  return request({
    url: '/message/read',
    data,
    method: 'post'
  })
}
