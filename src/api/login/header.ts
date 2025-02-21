import request from '../../utils/request'

export function readMessage(data: any) {
  return request({
    url: '/message/read',
    data,
    method: 'post'
  })
}

export function messagePage(data: any) {
  return request({
    url: '/message/page',
    data,
    method: 'get'
  })
}

interface HeaderDataItem {
  id: number
  content: string
  msgType: number
  opStatus: number
  chOpStatus: string
}

export {HeaderDataItem}
