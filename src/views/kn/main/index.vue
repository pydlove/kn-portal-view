<!-- src/views/kn/main/index.vue -->
<template>
  <div :key="menuId">
    <div v-if="isMobile" class="main-container">
      <Sidebar
        ref="sidebarRef"
        class="sidebar-container"
        :class="{ 'sidebar-hidden': isSidebarHidden }"
        :activeMenuId="menuId"
        :title="title"
        @handleArticleSelected="handleArticleSelected"
      ></Sidebar>

      <div class="content-container">
        <div class="article-content">
          <div v-if="articleContent && articleContent.articleContent">
            <div>
              <div class="article-title">
                {{ articleContent.articleTitle }}
              </div>
            </div>

            <!-- 显示富文本的内容，支持md格式的 -->
            <div class="markdown-content"
                 v-html="renderedMarkdown"></div>
          </div>
          <div v-else class="empty-content">
            请耐心等待作者创作
          </div>
        </div>

      </div>

    </div>

    <div v-else class="main-container">
      <Sidebar
        ref="sidebarRef"
        class="sidebar-container"
        :class="{ 'sidebar-hidden': isSidebarHidden }"
        :activeMenuId="menuId"
        @handleArticleSelected="handleArticleSelected"
        @doPcToggleSidebar="toggleSidebar"
      ></Sidebar>

      <!-- 显示侧边栏的按钮 -->
      <div
        v-if="isSidebarHidden"
        class="sidebar-toggle-btn"
        @click="showSidebar"
      >
        ▶
      </div>

      <div class="content-container">
        <div class="article-content">
          <div v-if="articleContent && articleContent.articleContent">
            <div>
              <div class="article-title">
                {{ articleContent.articleTitle }}
              </div>
            </div>

            <!-- 显示富文本的内容，支持md格式的 -->
            <div class="markdown-content"
                 v-html="renderedMarkdown"></div>
          </div>
          <div v-else class="empty-content">
            请耐心等待作者创作
          </div>
        </div>

        <div class="toc-container">

          <div>
            <!-- 显示文章的目录 -->
            <div class="toc-header">文章目录</div>
            <div class="toc-wrapper">
              <div v-if="tocList.length > 0" class="toc-content">
                <ul class="toc-list">
                  <li
                    v-for="item in tocList"
                    :key="item.id"
                    :class="['toc-item', `toc-level-${item.level}`]"
                  >
                    <a
                      href="javascript:void(0)"
                      @click.prevent="scrollToSection(item.title)"
                      :title="item.title"
                    >
                      {{ truncateText(item.title, 15) }}
                    </a>
                  </li>
                </ul>
              </div>
              <div v-else class="empty-toc">
                暂无目录
              </div>
            </div>
          </div>

          <!-- 翻页式Banner -->
          <MainBanner />
        </div>

        <RightTool ref="rightToolRef" @toggleSidebar="toggleSidebar"
                   @scrollToTop="scrollToTop"/>
      </div>

    </div>

    <Footer/>
  </div>
</template>

<!-- src/views/kn/main/index.vue -->
<script setup lang="ts">
import {useRoute} from 'vue-router'
import Sidebar from '../../../components/Sidebar.vue'
import Footer from '../../../components/Footer.vue'
import RightTool from '../../../components/RightTool.vue'
import {ref, watch, computed, onMounted, nextTick} from "vue"
import {marked} from 'marked'
// 引入 Prism.js
import Prism from 'prismjs'
// 引入 Prism.css 样式
import 'prismjs/themes/prism-tomorrow.css'
// 引入需要的语言支持
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-xml-doc'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-properties'
import mermaid from 'mermaid'
import {TitleItem} from "@/components/Sidebar.vue";
import MainBanner from "@/components/advertisement/MainBanner.vue";
import {getArticle} from "@/api/kn/home/home";
import {ArticleVO} from "@/views/kn/console/article/type";
import {checkIsMobile, doScrollToTop, isMobile} from "@/utils/util";
import {setStorageArticle} from "./main";


const sidebarRef = ref(null)
const title = ref<TitleItem>('')
const route = useRoute()
const menuId = ref<number>(route.query.menuId || null)
const tocList = ref<Array<{ id: string, title: string, level: number }>>([])
const articleContent = ref<ArticleVO>({} as ArticleVO)

// 控制侧边栏显示/隐藏的状态
const isSidebarHidden = ref(false)
const isSidebarAnimating = ref(false)

// 切换侧边栏显示/隐藏
const toggleSidebar = () => {
  isSidebarAnimating.value = true
  isSidebarHidden.value = !isSidebarHidden.value
}

// 显示侧边栏
const showSidebar = () => {
  isSidebarAnimating.value = true
  isSidebarHidden.value = false
}

// 处理文章选择
const handleArticleSelected = async (article: number) => {

  title.value = article;

  // 存储选中的文章信息
  const articleInfo = {
    rootMenuId: menuId.value,
    menuId: title.value.menuId,
    articleId: title.value.articleId,
    title: title.value.title,
    timestamp: Date.now()
  };
  sessionStorage.setItem('selectedArticle', JSON.stringify(articleInfo));

  await loadArticleContent()
}

// 文本截断函数
const truncateText = (text: string, maxLength: number) => {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

// 生成目录
const generateTOC = (markdown: string) => {
  if (!markdown) return

  const lines = markdown.split('\n')
  const toc: Array<{ id: string, title: string, level: number }> = []

  lines.forEach(line => {
    const headingMatch = line.match(/^(#{1,6})\s+(.*)/)
    if (headingMatch) {
      const level = headingMatch[1].length
      let title = headingMatch[2]

      // 将 title 中的两个连续星号替换成空字符串
      title = title.replace(/\*\*/g, '');

      // 修正对象属性，第一个属性应该是 id 而不是 title
      toc.push({id: title, title, level})
    }
  })

  tocList.value = toc
}

// 滚动到指定章节
const scrollToSection = (id: string) => {

  let newId = id.replace(/\*\*/g, '').trim();
  const element = document.getElementById(newId)
  if (element) {
    // 添加平滑滚动效果
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })

    // 添加临时高亮效果
    element.style.backgroundColor = '#40a9ff'
    setTimeout(() => {
      element.style.backgroundColor = ''
    }, 1000)
  }
}

// 返回顶部功能
const scrollToTop = () => {
  // 获取文章内容容器元素
  doScrollToTop('.article-content')
}

// 加载文章内容
const loadArticleContent = async () => {

  // 修正判断条件
  if (!title.value || !title.value.articleId) return

  try {
    // 获取文章内容
    const articleData = await getArticle({articleId: title.value.articleId})
    articleContent.value = articleData
    console.log('文章内容:', articleData)

    // 生成目录
    generateTOC(articleData.articleContent)
  } catch (error) {
    console.error('加载文章内容失败:', error)
  }
}

const checkFirstArticle = () => {
  if (sidebarRef.value && sidebarRef.value.firstArticle) {
    title.value = sidebarRef.value.firstArticle
    setStorageArticle(menuId.value, sidebarRef.value.firstArticle.menuId, sidebarRef.value.firstArticle.articleId, sidebarRef.value.firstArticle.title)
    loadArticleContent()
    return true; // 表示成功选中了第一个文章
  } else {
    // 如果还没有获取到 firstArticle，继续检查
    setTimeout(checkFirstArticle, 100)
    return false;
  }
}

onMounted(() => {

  checkIsMobile()

  mermaid.initialize({
    startOnLoad: true,
    theme: 'dark',
    securityLevel: 'loose'
  });

  nextTick(() => {
    doMenuChange()
  })
})

const doMenuChange = () => {
  const storedArticle = sessionStorage.getItem('selectedArticle');
  if (!storedArticle) {
    const shouldSelectFirst = route.query.selectFirst === 'true';

    if (shouldSelectFirst) {
      setTimeout(() => {
        checkFirstArticle();
      }, 300);
    } else if (!title.value || !title.value.articleId) {
      setTimeout(() => {
        checkFirstArticle();
      }, 200);
    }
  }
}

// 监听路由变化
watch(
  () => route.query,
  (query) => {
    menuId.value = query.menuId || ''
    let type = query.type || ''

    // 清空当前文章内容
    articleContent.value = {} as ArticleVO;
    title.value = {articleId: 0, title: ''};
    tocList.value = [];

    // 检查是否有存储的文章信息
    nextTick(() => {
      if (type == 'search') {
        const storedArticle = sessionStorage.getItem('selectedArticle');
        if (storedArticle) {
          const article = JSON.parse(storedArticle);
          console.log('storedArticle', article)
          handleArticleSelected(article);

          sidebarRef.value.checkHasSelectedArticle();
        }
      } else {
        doMenuChange()
      }
    });
  }
)

// 自定义marked渲染器，为标题添加ID
const renderer = new marked.Renderer();
renderer.heading = function ({text, depth}: { text: string; depth: number }) {

  let content = text.replace(/\*\*/g, '');

  return `<h${depth} id="${content}">${content}</h${depth}>`;
};

renderer.code = function ({text, lang, escaped}: {
  text: string;
  lang: string;
  escaped: boolean
}) {

  if (lang === 'mermaid') {
    return `<div class="mermaid">${text}</div>`;
  }

  // 处理XML文档代码块
  if (lang === 'xml' || lang === 'xml-doc') {
    console.log('XML文档代码块', text)

    const safeText = text.replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
    return `<pre><code class="language-xml">${safeText}</code></pre>`;
  }

  // 处理SQL代码块
  if (lang === 'sql') {
    const safeText = text.replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
    return `<pre><code class="language-sql">${safeText}</code></pre>`;
  }

  // 其他代码块保持原有处理
  return `<pre><code class="language-${lang}">${text}</code></pre>`;
};

// 渲染Markdown内容
const renderedMarkdown = computed(() => {
  if (!articleContent.value || !articleContent.value.articleContent) return ''
  marked.setOptions({renderer})
  return marked(articleContent.value.articleContent)
})

// 监听渲染后的内容变化，执行语法高亮 + Mermaid 渲染
watch(renderedMarkdown, () => {
  nextTick(() => {
    // 语法高亮
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach((block) => {
      Prism.highlightElement(block);
    });

    // 渲染mermaid图表
    const mermaidBlocks = document.querySelectorAll('.markdown-content .mermaid');
    mermaidBlocks.forEach((block, index) => {
      const mermaidCode = block.textContent || '';
      const mermaidId = `mermaid-${Date.now()}-${index}`;

      try {
        mermaid.render(mermaidId, mermaidCode).then((result: {
          svg: string;
          bindFunctions?: (element: Element) => void
        }) => {
          const {svg, bindFunctions} = result;

          // 直接将 SVG 字符串插入到 block 中
          block.innerHTML = svg;

          // 如果有绑定函数，则应用到新创建的 SVG 元素上
          if (bindFunctions) {
            const svgElement = block.querySelector('svg');
            if (svgElement) {
              bindFunctions(svgElement);
            }
          }

        });
      } catch (error) {
        console.error('Mermaid rendering error:', error);
        block.innerHTML = '<p>图表渲染失败</p>';
      }
    });

  });
});

</script>

<style scoped>

/* 添加显示侧边栏的按钮样式 */
.sidebar-toggle-btn {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  background-color: #40a9ff;
  color: white;
  width: 20px;
  height: 60px;
  border-radius: 0 10px 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1000;
  transition: all 0.3s ease;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
}

.sidebar-toggle-btn:hover {
  background-color: #1890ff;
  width: 25px;
}

.fullstack-page .toc-container {
  color: #ffffff;
  background-color: #31383f;
  font-size: 0.9rem;
}

.fullstack-page a {
  color: #ffffff;
  background-color: #31383f;
}

.fullstack-page.light-theme .content-container {
  background: #eee;
}

.fullstack-page.light-theme .article-content {
  background: #ffffff;
}

.fullstack-page.light-theme .toc-container {
  color: #333;
  background-color: #ffffff;
  border-left: 1px solid #d9d9d9;
}

.fullstack-page.light-theme a {
  color: #333;
  background-color: #ffffff;
}

.fullstack-page .content-container {
  background: #2b313a;
}

.fullstack-page .article-content {
  background: #22272e;
}

.main-container {
  display: flex;
  height: calc(100vh - 120px);
  overflow: hidden;
}

.main-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
}

.sidebar-container {
  flex-shrink: 0;
  transition: all 0.3s ease;
}

/* 侧边栏隐藏样式 */
.sidebar-hidden {
  transform: translateX(-100%);
  position: absolute;
  z-index: -1;
  opacity: 0;
  width: 0 !important;
}

.article-title {
  text-align: left;
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 20px 0;
  padding: 25px 30px;
  color: #2c3e50;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-bottom: 3px solid #40a9ff;
  border-radius: 8px 8px 0 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  position: relative;
  line-height: 1.4;
}

/* 暗色主题下的文章标题样式 */
.fullstack-page.light-theme .article-title {
  color: #ffffff;
  background: linear-gradient(135deg, #2d3748 0%, #22272e 100%);
  border-bottom: 3px solid #40a9ff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* 暗色主题下的文章标题样式 */
.fullstack-page .article-title {
  color: #ffffff;
  background: linear-gradient(135deg, #2d3748 0%, #22272e 100%);
  border-bottom: 3px solid #40a9ff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* 在标题下方添加装饰线 */
.article-title::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 30px;
  right: 30px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #40a9ff, transparent);
}

.content-container {
  display: flex;
  flex: 1;
  overflow: hidden;
  min-height: 0; /* 防止子元素溢出 */
}

.article-content {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
}

.empty-content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  font-size: 1.2rem;
}

.toc-container {
  max-width: 270px;
  min-width: 270px;
  background-color: #f8f9fa;
  border-left: 1px solid rgba(255, 255, 255, 0.1)
}

.toc-wrapper {
  overflow-y: auto;
  height: calc(100Vh - 425px);
}

.fullstack-page.light-theme .toc-header {
  border-bottom: 1px solid #d9d9d9;
}

.fullstack-page .toc-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.toc-header {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  line-height: 50px;
  padding-left: 20px;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
  padding-left: 10px;
}

.toc-item {
  margin-bottom: 8px;
  cursor: pointer;
  position: relative;
}

.toc-item a {
  text-decoration: none;
  transition: color 0.2s;
  display: block;
  padding: 4px 8px;
  border-radius: 4px;
  outline: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.toc-item a:hover {
  background-color: #e9ecef;
  color: #1890ff;
  font-weight: 600;
}

.toc-level-1 a {
  font-weight: bold;
  padding-left: 0;
}

.toc-level-2 a {
  padding-left: 15px;
}

.toc-level-3 a {
  padding-left: 30px;
}

.toc-level-4 a {
  padding-left: 45px;
}

.toc-level-5 a {
  padding-left: 60px;
}

.toc-level-6 a {
  padding-left: 75px;
}

.empty-toc {
  color: #999;
  font-style: italic;
  text-align: center;
}

@media (max-width: 768px) {

  .article-content {
    flex: 1;
    padding: 10px;
    overflow-y: auto;
  }

  .article-title {
    font-size: 16px;
    font-weight: 700;
    padding: 10px;
    line-height: 24px;
    margin-bottom: 10px;
    margin-top: 10px;
  }

  .main-container {
    height: calc(100vh - 100px);
  }
}
</style>


