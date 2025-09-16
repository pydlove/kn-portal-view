<!-- src/views/ErrorPage.vue -->
<template>
  <div class="error-page">
    <div class="error-container">
      <div class="error-graphic">
        <div class="error-number">404</div>
        <div class="error-image">
          <img class="null-img" alt="Page not found" src="@/assets/images/null.jpg" />
        </div>
      </div>

      <div class="error-content">
        <h1 class="error-title">哎呀！页面迷路了</h1>
        <p class="error-message">
          抱歉，您访问的页面不存在或已被移除。<br>
          请检查您的网址是否正确，或返回首页继续浏览。
        </p>

        <div class="error-actions">
          <button class="btn btn-primary" @click="goHome">
            <i class="fas fa-home"></i>
            返回首页
          </button>
          <button class="btn btn-secondary" @click="goBack">
            <i class="fas fa-arrow-left"></i>
            返回上一页
          </button>
        </div>
      </div>
    </div>

    <div class="error-footer">
      <p>如果您认为这是系统错误，请联系管理员</p>
    </div>
  </div>
</template>

<script setup lang="ts" name="ErrorPage">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.go(-1)
}
</script>

<style lang="scss" scoped>
.error-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  box-sizing: border-box;
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 800px;
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  padding: 40px;
  text-align: center;
  backdrop-filter: blur(10px);

  @media (min-width: 768px) {
    flex-direction: row;
    text-align: left;
    padding: 50px;
  }
}

.error-graphic {
  flex: 1;
  margin-bottom: 30px;

  @media (min-width: 768px) {
    margin-bottom: 0;
    margin-right: 30px;
  }
}

.error-number {
  font-size: 80px;
  font-weight: 800;
  color: #667eea;
  margin-bottom: 20px;
  text-shadow: 3px 3px 0 rgba(0, 0, 0, 0.1);

  @media (min-width: 768px) {
    font-size: 100px;
  }
}

.error-image {
  .null-img {
    width: 100%;
    max-width: 300px;
    height: auto;
    border-radius: 10px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
}

.error-content {
  flex: 1;
}

.error-title {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 20px;

  @media (min-width: 768px) {
    font-size: 36px;
  }
}

.error-message {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 30px;

  @media (min-width: 768px) {
    font-size: 18px;
  }
}

.error-actions {
  display: flex;
  flex-direction: column;
  gap: 15px;

  @media (min-width: 768px) {
    flex-direction: row;
  }

  .btn {
    padding: 12px 25px;
    border: none;
    border-radius: 50px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }

    &:active {
      transform: translateY(-1px);
    }
  }

  .btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  .btn-secondary {
    background: #f1f3f4;
    color: #333;
  }
}

.error-footer {
  margin-top: 30px;
  color: rgba(255, 255, 255, 0.8);

  p {
    font-size: 14px;
    text-align: center;
  }
}

// 响应式设计
@media (max-width: 767px) {
  .error-container {
    padding: 30px 20px;
  }

  .error-number {
    font-size: 60px;
  }

  .error-title {
    font-size: 24px;
  }

  .error-message {
    font-size: 14px;
  }

  .btn {
    padding: 10px 20px;
    font-size: 14px;
  }
}
</style>
