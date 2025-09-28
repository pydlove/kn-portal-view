// main.ts
import {Router} from "vue-router";

export const goToRkMainPage = (router: Router, rootMenuId: number, type: string, selectFirst: boolean = true) => {
  router.push({
    name: 'RkMain',
    query: {
      menuId: rootMenuId,
      selectFirst: selectFirst,
      time: new Date().getTime(),
      type: type
    }
  });
};

export const getRkStorageArticle = () => {
  return JSON.parse(sessionStorage.getItem('selectedRkArticle') || '{}');
};

export const setRkStorageArticle = (rootMenuId: number, menuId: number, articleId: number, title: string) => {
  // 存储选中的文章信息
  const articleInfo = {
    rootMenuId: rootMenuId,
    menuId: menuId,
    articleId: articleId,
    title: title,
    timestamp: Date.now()
  };
  sessionStorage.setItem('selectedRkArticle', JSON.stringify(articleInfo));
};
