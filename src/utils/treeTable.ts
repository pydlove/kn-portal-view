import { TreeProps } from 'ant-design-vue'

export const convertEmptyChildToUndefined = (tree: any) => {
  if (Array.isArray(tree)) {
    tree.forEach((node: any) => {
      if (Array.isArray(node.child) && node.child.length === 0) {
        node.child = null
      } else if (Array.isArray(node.child)) {
        convertEmptyChildToUndefined(node.child)
      }
    })
  }
  return tree
}

export const convertEmptyChildToArray = (tree: any) => {
  if (Array.isArray(tree)) {
    tree.forEach((node: any) => {
      if (node.child === null) {
        node.child = []
      } else if (Array.isArray(node.child)) {
        convertEmptyChildToArray(node.child)
      }
    })
  }
  return tree
}

// 树形遍历获取所有keys
export const getAllKeys = (treeList: TreeProps['treeData']) => {
  const expandKeys: string[] = []
  const addNameToTree = (tree: any) => {
    tree.forEach((node: any) => {
      expandKeys.push(node.id)
      if (node.children) {
        addNameToTree(node.children)
      }
    })
  }
  addNameToTree(treeList)
  return expandKeys
}

// Determine if it is regular
export const isRegExp = (value: string) => {
  try {
    new RegExp(value)
    return true
  } catch (e) {
    return false
  }
}
