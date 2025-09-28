// src/api/menu.ts
import {ruankaoRequest} from '../../../utils/request'

// 获取菜单列表
export function getRkMenuPage(data: {menuName: string, pageNum: number; pageSize: number}) {
  return ruankaoRequest({
    url: '/rk_menus/page',
    data,
    method: 'get'
  })
}

// 创建菜单
export function createRkMenu(data: any) {
  return ruankaoRequest({
    url: '/rk_menus/create',
    method: 'post',
    data
  })
}

// 更新菜单
export function updateRkMenu(id: number, data: any) {
  return ruankaoRequest({
    url: `/rk_menus/update/${id}`,
    method: 'put',
    data
  })
}

// 删除菜单
export function deleteRkMenu(id: number) {
  return ruankaoRequest({
    url: `/rk_menus/delete/${id}`,
    method: 'delete'
  })
}

// 获取菜单详情
export function getRkMenuDetail(id: number) {
  return ruankaoRequest({
    url: `/rk_menus/detail/${id}`,
    method: 'get'
  })
}

/**
 * get first level menu
 */
export function getRkRootMenus() {
  return ruankaoRequest({
    url: `/rk_menus/root`,
    method: 'get'
  })
}

export function getRkLevelMenus(level: number) {
  return ruankaoRequest({
    url: `/rk_menus/level/${level}`,
    method: 'get'
  })
}

export function getRkAllMenus() {
  return ruankaoRequest({
    url: `/rk_menus/all`,
    method: 'get'
  })
}
