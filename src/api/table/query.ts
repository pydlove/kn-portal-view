import request from '../../utils/request'
export function talkQuestion(data: any) {
  return request({
    url: '/talk/question',
    data,
    method: 'post'
  })
}

export function queryPreviewData(data: any) {
  return request({
    url: '/talk/preview',
    data,
    method: 'post'
  })
}