<!-- src/views/kn/home/index.vue -->
<template>
  <div class="home-container">
    <!-- Banner 区域 -->
    <section class="banner">
      <div class="banner-content">
        <h1 class="banner-title">欢迎来到 Java 技术小窝</h1>
        <p class="banner-subtitle">
          一站式 Java 技术学习平台，从基础到高级，构建完整的知识体系，帮你了解系统化的进阶路径
        </p>
        <div class="banner-actions">
          <button class="btn btn-primary" @click="goToLearning">开始学习</button>
          <button class="btn btn-secondary" @click="goToAbout">关于本站</button>
        </div>
        <!-- 添加向下滚动提示 -->
        <div class="scroll-down" @click="scrollToContent">
          <img src="../../../assets/images/down.png" class="down-icon">
        </div>
      </div>
      <div class="banner-overlay"></div>
      <!-- Main Content -->
      <div v-if="isMobile" class="mb-start-line"></div>
    </section>

    <main class="main-content">
      <div class="content-wrapper">
        <div class="text-content">
          <h1 class="title">体系化征服Java全栈，打造高薪工程师核心能力</h1>

          <div class="description">
            <div>
              <p> ▸ 底层攻坚（JVM/集合/JUC）</p>
              <p>▸ 工程化实践（Git/Maven/日志）</p>
              <p> ▸ 架构核心（SpringCloud/微服务/Zookeeper）</p>
              <p> ▸ 数据生态（MySQL/Redis/Kafka/Clickhouse）</p>
              <p>▸ 分布式体系（Dubbo/Nacos/RPC/分布式事务）</p>
              <p>▸ 流式计算（Flink/实时数据处理）</p>
            </div>

            <div>
              <p>▸ 云原生矩阵（K8S/容器化/Etcd/云原生）</p>
              <p>▸ 安全架构（权限框架/加密/网络安全）</p>
              <p>▸ 高并发场景（三高/缓存设计/分库分表）</p>
              <p>▸ 领域驱动（DDD/复杂业务建模）</p>
              <p>▸ 智能演进（AI&大模型/技术融合）</p>
              <p>▸ 实战专题（生产问题排查/场景问题）</p>
              <p>▸ 架构师成长（架构师能力提升/技术决策）</p>
            </div>
          </div>

          <div class="features">
            <div class="feature">
              <h3>筑基工程</h3>
              <p>从字节码到分布式锁的深度修炼,<br>
                JVM字节码指令集精讲,<br>
                并发编程的happens-before法则,<br>
                数据结构与算法工程化应用</p>
            </div>
            <div class="feature">
              <h3>体系构建</h3>
              <p>你的技术雷达图该更新了,<br>
                Spring响应式编程与传统架构对比,<br>
                云原生时代的新基础设施选型,<br>
                从单体到ServiceMesh的演进路径</p>
            </div>
            <div class="feature">
              <h3>全栈突破</h3>
              <p>用Java技术栈撬动DevOps效能,
                容器化CI/CD流水线设计,
                前后端协同开发模式实践,
                生产级监控告警体系搭建</p>
            </div>
          </div>
        </div>

        <div class="illustration">
          <img src="../../../assets/images/logo-new.png"
               alt="Einstein-style character holding books">
          <div class="action-buttons">
            <button class="btn btn-primary" @click="goToFullStack">全栈知识体系</button>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <Footer/>

    <ReturnTop @scrollToTop="scrollToTop"/>
  </div>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router'
import {onMounted, onBeforeUnmount} from 'vue'
import Footer from '../../../components/Footer.vue'
import ReturnTop from '../../../components/ReturnTop.vue'
import {doScrollToTop, isMobile} from "@/utils/util";
import {goToMainPage} from "@/views/kn/main/main";

const router = useRouter()

const scrollToTop = () => {
  doScrollToTop('.home-container')
}

const goToLearning = () => {
  goToMainPage(router, 1, 'menu')
}

const goToAbout = () => {
  goToMainPage(router, 1138, 'menu')
}

const goToFullStack = () => {
  goToMainPage(router, 1, 'menu')
}

// 滚动到内容区域
const scrollToContent = () => {
  const contentElement = isMobile.value ?
    document.querySelector('.mb-start-line') : document.querySelector('.main-content');

  if (contentElement) {
    contentElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}

// 组件挂载时添加平滑滚动行为
onMounted(() => {
  document.documentElement.style.scrollBehavior = 'smooth';
})

// 组件销毁前恢复默认滚动行为
onBeforeUnmount(() => {
  document.documentElement.style.scrollBehavior = 'auto';
})
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  overflow: auto;
  height: calc(100vh - 120px);
}

/* Banner 样式 */
.banner {
  position: relative;
  height: 100vh;
  min-height: 600px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: white;
  text-align: center;
}

.banner-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  padding: 0 20px;
}

.banner-title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.banner-subtitle {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  line-height: 50px;
}

.banner-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.scroll-down {
  position: absolute;
  bottom: -200px;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
  animation: bounce 2s infinite;
}

.down-icon {
  width: 50px;
  height: 50px;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0) translateX(-50%);
  }
  40% {
    transform: translateY(-20px) translateX(-50%);
  }
  60% {
    transform: translateY(-10px) translateX(-50%);
  }
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('https://example.com/banner-pattern.png') center/cover;
  opacity: 0.2;
  z-index: 1;
}

.btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 50px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.btn-primary {
  background-color: #096dd9;
  color: white;
}

.btn-primary:hover {
  background-color: #1890ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.btn-secondary {
  background-color: transparent;
  color: white;
  border: 2px solid white;
}

.btn-secondary:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.main-content {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
  min-height: 800px;
}

.content-wrapper {
  display: flex;
  justify-content: space-between;
}

.text-content {
  flex: 1;
  max-width: 800px;
  text-align: left;
}

.title {
  font-size: 2.1rem;
  margin-bottom: 1.5rem;
}

.description {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  display: flex;
  flex-wrap: nowrap;
}

.action-buttons {
  gap: 1rem;
  margin-bottom: 3rem;
  margin-top: 2rem;
}

.features {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap; /* 允许换行 */
  justify-content: center;
  margin-top: 2rem;
}

.feature {
  flex: 1;
  min-width: 280px; /* 最小宽度 */
  padding: 0 1.5rem 1.5rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #e0e0e0;
  background: #e6f7ff;
}

.feature:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.feature h3 {
  color: #096dd9;
  margin-bottom: 0.8rem;
  font-size: 1.3rem;
  font-weight: 600;
}

.feature p {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #333;
  margin: 0;
}

.illustration {
  flex: 1;
  max-width: 300px;
  text-align: center;
  margin-left: 50px;
  margin-top: 30px;
}

.illustration img {
  max-width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.illustration-text {
  font-size: 1.5rem;
  margin-top: 1rem;
  font-weight: bold;
  color: #ffffff;
}

@media (max-width: 768px) {
  .banner {
    height: 100vh;
    min-height: 500px;
  }

  .banner-title {
    font-size: 2rem;
  }

  .banner-subtitle {
    font-size: 1.2rem;

  }

  .content-wrapper {
    flex-direction: column;
  }

  .text-content {
    max-width: 100%;
    text-align: center;
  }

  .features {
    flex-direction: column;
    gap: 1.5rem;
  }

  .feature {
    margin-bottom: 1rem;
    min-width: 100%;
  }

  .illustration {
    margin-left: 0;
    margin-top: 20px;
    flex: unset;
    max-width: 100%;
  }

  .home-container {
    height: calc(100vh - 50px);
  }

  .scroll-down {
    bottom: -100px;
  }

  .banner-title {
    margin-top: 10px;
  }

  .banner-subtitle {
    font-size: 16px;
    line-height: 32px;
  }

  .title {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .description {
    display: flex;
    flex-wrap: wrap;
    justify-content: left;
    margin-bottom: 10px;
  }

  .description p {
    text-align: left;
    font-size: 14px;
    margin: 10px 0;
  }

  .features {
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .feature {
    margin: 5px 0;
  }

  .content-wrapper {
    display: unset;
  }

  .mb-start-line {
    position: relative;
    bottom: -324px;
  }
}
</style>
