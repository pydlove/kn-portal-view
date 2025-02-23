import request from '../../utils/request'
export function getUserPage(data: any) {
  return request({
    url: '/user/page',
    data,
    method: 'get'
  })
}

export function addUser(data: any) {
  return request({
    url: '/user/add',
    data,
    method: 'post'
  })
}

export function updateUser(data: any) {
  return request({
    url: '/user/update',
    data,
    method: 'post'
  })
}

export function deleteUser(data: any) {
  return request({
    url: '/user/delete',
    data,
    method: 'post'
  })
}

