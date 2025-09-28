import {defaultRequest} from "@/utils/request";

export function getArticlePage(data: {pageNum: number; pageSize: number}) {
  return defaultRequest({
    url: '/article/page',
    data,
    method: 'get'
  })
}

export function createArticle(data: any) {
  return defaultRequest({
    url: '/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(id: number, data: any) {
  return defaultRequest({
    url: `/article/update/${id}`,
    method: 'put',
    data
  })
}

export function deleteArticle(id: number) {
  return defaultRequest({
    url: `/article/delete/${id}`,
    method: 'delete'
  })
}
