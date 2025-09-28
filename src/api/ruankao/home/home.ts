import {ruankaoRequest} from '../../../utils/request'

export function getRkMenuList(data: {}) {
  return ruankaoRequest({
    url: '/rk_menus/list',
    data,
    method: 'get'
  })
}

export function getRkRootMenus(data: {}) {
  return ruankaoRequest({
    url: '/rk_menus/root',
    data,
    method: 'get'
  })
}

export function getRkSubMenus(data: { parentMenuId: number }) {
  return ruankaoRequest({
    url: '/rk_article/titleList',
    data,
    method: 'get'
  })
}

export function getRkArticle(data: { articleId: number }) {
  return ruankaoRequest({
    url: '/rk_article/get',
    data,
    method: 'get'
  })
}

export function searchRkArticleFulltext(data: {
  content: string,
  pageNum: number;
  pageSize: number
}) {
  return ruankaoRequest({
    url: '/rk_article/search/page',
    data,
    method: 'get'
  })
}
