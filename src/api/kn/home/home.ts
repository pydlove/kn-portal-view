import {defaultRequest} from '../../../utils/request'

export function getMenuList(data: {}) {
  return defaultRequest({
    url: '/menus/list',
    data,
    method: 'get'
  })
}

export function getRootMenus(data: {}) {
  return defaultRequest({
    url: '/menus/root',
    data,
    method: 'get'
  })
}

export function getSubMenus(data: {parentMenuId: number}) {
  return defaultRequest({
    url: '/article/titleList',
    data,
    method: 'get'
  })
}

export function getArticle(data: {articleId: number}) {
  return defaultRequest({
    url: '/article/get',
    data,
    method: 'get'
  })
}

export function searchArticleFulltext(data: {content: string, pageNum: number; pageSize: number}) {
  return defaultRequest({
    url: '/article/search/page',
    data,
    method: 'get'
  })
}
