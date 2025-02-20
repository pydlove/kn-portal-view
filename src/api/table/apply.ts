import request from '../../utils/request'
export function onSubmitApply(data: any) {
  return request({
    url: '/apply/submit',
    data,
    method: 'post'
  })
}

export function getApplyPage(data: any) {
  return request({
    url: '/apply/list',
    data,
    method: 'get'
  })
}

export function updateApply(data: any) {
  return request({
    url: '/apply/update',
    data,
    method: 'post'
  })
}

export function batchUpdateApply(data: any) {
  return request({
    url: '/apply/batch-update',
    data,
    method: 'post'
  })
}
