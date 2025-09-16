import request from '../../utils/request'

export function getArticlePage(data: {pageNum: number; pageSize: number}) {
  return request({
    url: '/article/page',
    data,
    method: 'get'
  })
}

export function createArticle(data: any) {
  return request({
    url: '/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(id: number, data: any) {
  return request({
    url: `/article/update/${id}`,
    method: 'put',
    data
  })
}

export function deleteArticle(id: number) {
  return request({
    url: `/article/delete/${id}`,
    method: 'delete'
  })
}
