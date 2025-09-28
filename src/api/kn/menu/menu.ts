// src/api/menu.ts
import {defaultRequest} from '../../../utils/request'

// 获取菜单列表
export function getMenuPage(data: {menuName: string, pageNum: number; pageSize: number}) {
  return defaultRequest({
    url: '/menus/page',
    data,
    method: 'get'
  })
}

// 创建菜单
export function createMenu(data: any) {
  return defaultRequest({
    url: '/menus/create',
    method: 'post',
    data
  })
}

// 更新菜单
export function updateMenu(id: number, data: any) {
  return defaultRequest({
    url: `/menus/update/${id}`,
    method: 'put',
    data
  })
}

// 删除菜单
export function deleteMenu(id: number) {
  return defaultRequest({
    url: `/menus/delete/${id}`,
    method: 'delete'
  })
}

// 获取菜单详情
export function getMenuDetail(id: number) {
  return defaultRequest({
    url: `/menus/detail/${id}`,
    method: 'get'
  })
}

/**
 * get first level menu
 */
export function getRootMenus() {
  return defaultRequest({
    url: `/menus/root`,
    method: 'get'
  })
}

export function getLevelMenus(level: number) {
  return defaultRequest({
    url: `/menus/level/${level}`,
    method: 'get'
  })
}

export function getAllMenus() {
  return defaultRequest({
    url: `/menus/all`,
    method: 'get'
  })
}
