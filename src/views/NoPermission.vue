<!-- src/views/NoPermission.vue -->
<template>
  <div class="no-permission-page">
    <div class="permission-container">
      <div class="permission-graphic">
        <div class="lock-icon">
          <i class="fas fa-lock"></i>
        </div>
        <div class="permission-image">
          <img class="null-img" alt="No permission" src="@/assets/images/null.jpg" />
        </div>
      </div>

      <div class="permission-content">
        <h1 class="permission-title">访问被拒绝</h1>
        <p class="permission-message">
          抱歉，您没有权限访问此页面。<br>
          如果您认为这是错误，请联系系统管理员。
        </p>
        <div class="permission-details">
          <p><i class="fas fa-exclamation-circle"></i> 权限不足</p>
          <p><i class="fas fa-user-shield"></i> 需要更高权限等级</p>
        </div>

        <div class="permission-actions">
          <button class="btn btn-primary" @click="goHome">
            <i class="fas fa-home"></i>
            返回首页
          </button>
          <button class="btn btn-secondary" @click="contactAdmin">
            <i class="fas fa-headset"></i>
            联系管理员
          </button>
        </div>
      </div>
    </div>

    <div class="permission-footer">
      <p>© 2023 系统名称. 保留所有权利.</p>
    </div>
  </div>
</template>

<script setup lang="ts" name="NoPermissionPage">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const contactAdmin = () => {
  // 这里可以添加联系管理员的逻辑，例如打开邮件客户端或聊天窗口
  alert('请联系系统管理员获取相应权限')
}
</script>

<style lang="scss" scoped>
.no-permission-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5587b 0%, #f88b48 100%);
  padding: 20px;
  box-sizing: border-box;
}

.permission-container {
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

.permission-graphic {
  flex: 1;
  margin-bottom: 30px;

  @media (min-width: 768px) {
    margin-bottom: 0;
    margin-right: 30px;
  }
}

.lock-icon {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #f5587b 0%, #f88b48 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;

  i {
    font-size: 50px;
    color: white;
  }

  @media (min-width: 768px) {
    width: 120px;
    height: 120px;

    i {
      font-size: 60px;
    }
  }
}

.permission-image {
  .null-img {
    width: 100%;
    max-width: 300px;
    height: auto;
    border-radius: 10px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
}

.permission-content {
  flex: 1;
}

.permission-title {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 20px;

  @media (min-width: 768px) {
    font-size: 36px;
  }
}

.permission-message {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 30px;

  @media (min-width: 768px) {
    font-size: 18px;
  }
}

.permission-details {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 30px;
  text-align: left;

  p {
    margin: 10px 0;
    color: #555;
    display: flex;
    align-items: center;
    gap: 10px;

    i {
      color: #f5587b;
    }
  }
}

.permission-actions {
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

.permission-footer {
  margin-top: 30px;
  color: rgba(255, 255, 255, 0.8);

  p {
    font-size: 14px;
    text-align: center;
  }
}

// 响应式设计
@media (max-width: 767px) {
  .permission-container {
    padding: 30px 20px;
  }

  .permission-title {
    font-size: 24px;
  }

  .permission-message {
    font-size: 14px;
  }

  .permission-details {
    padding: 15px;
  }

  .btn {
    padding: 10px 20px;
    font-size: 14px;
  }
}
</style>
