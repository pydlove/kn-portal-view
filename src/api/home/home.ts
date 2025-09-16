import request from '../../utils/request'

export function getMenuList(data: {}) {
  return request({
    url: '/menus/list',
    data,
    method: 'get'
  })
}

export function getRootMenus(data: {}) {
  return request({
    url: '/menus/root',
    data,
    method: 'get'
  })
}

export function getSubMenus(data: {parentMenuId: number}) {
  return request({
    url: '/article/titleList',
    data,
    method: 'get'
  })
}

export function getArticle(data: {articleId: number}) {
  return request({
    url: '/article/get',
    data,
    method: 'get'
  })
}
