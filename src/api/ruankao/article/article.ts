import {ruankaoRequest} from '../../../utils/request'

export function getRkArticlePage(data: {pageNum: number; pageSize: number}) {
  return ruankaoRequest({
    url: '/rk_article/page',
    data,
    method: 'get'
  })
}

export function createRkArticle(data: any) {
  return ruankaoRequest({
    url: '/rk_article/create',
    method: 'post',
    data
  })
}

export function updateRkArticle(id: number, data: any) {
  return ruankaoRequest({
    url: `/rk_article/update/${id}`,
    method: 'put',
    data
  })
}

export function deleteRkArticle(id: number) {
  return ruankaoRequest({
    url: `/rk_article/delete/${id}`,
    method: 'delete'
  })
}
