import {ref} from "vue";

export const isMobile = ref(false) // 添加移动端检测

// 返回顶部功能
export const doScrollToTop = (id: any) => {
  // 获取文章内容容器元素
  const element = document.querySelector(id)
  if (element) {
    // 平滑滚动到顶部
    element.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
}

// 检测是否为移动端
export const checkIsMobile = () => {
  isMobile.value = window.innerWidth <= 768
  console.log('isMobile:', isMobile.value)
}

