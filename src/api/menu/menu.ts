// src/api/menu.ts
import request from '../../utils/request'

// 获取菜单列表
export function getMenuPage(data: {pageNum: number; pageSize: number}) {
  return request({
    url: '/menus/page',
    data,
    method: 'get'
  })
}

// 创建菜单
export function createMenu(data: any) {
  return request({
    url: '/menus/create',
    method: 'post',
    data
  })
}

// 更新菜单
export function updateMenu(id: number, data: any) {
  return request({
    url: `/menus/update/${id}`,
    method: 'put',
    data
  })
}

// 删除菜单
export function deleteMenu(id: number) {
  return request({
    url: `/menus/delete/${id}`,
    method: 'delete'
  })
}

// 获取菜单详情
export function getMenuDetail(id: number) {
  return request({
    url: `/menus/detail/${id}`,
    method: 'get'
  })
}

/**
 * get first level menu
 */
export function getRootMenus() {
  return request({
    url: `/menus/root`,
    method: 'get'
  })
}

export function getLevelMenus(level: number) {
  return request({
    url: `/menus/level/${level}`,
    method: 'get'
  })
}

export function getAllMenus() {
  return request({
    url: `/menus/all`,
    method: 'get'
  })
}
