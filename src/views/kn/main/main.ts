// main.ts
import {Router} from "vue-router";

export const goToMainPage = (router: Router, rootMenuId: number, type: string) => {
  router.push({
    name: 'main',
    query: {
      menuId: rootMenuId,
      selectFirst: 'true',
      time: new Date().getTime(),
      type: type
    }
  });
};

export const getStorageArticle = () => {
  return JSON.parse(sessionStorage.getItem('selectedArticle') || '{}');
};

export const setStorageArticle = (rootMenuId: number, menuId: number, articleId: number, title: string) => {
  // 存储选中的文章信息
  const articleInfo = {
    rootMenuId: rootMenuId,
    menuId: menuId,
    articleId: articleId,
    title: title,
    timestamp: Date.now()
  };
  sessionStorage.setItem('selectedArticle', JSON.stringify(articleInfo));
};
