<template>
  <div class="navigation-container">
    <!-- 登录模态框 -->
    <div v-if="!isLoggedIn" class="login-overlay">
      <div class="login-modal">
        <div class="login-header">
          <h2>系统登录</h2>
          <p>请输入您的账号和密码</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="username">用户名</label>
            <div class="input-wrapper">
              <i class="fas fa-user"></i>
              <input
                id="username"
                v-model="loginForm.username"
                type="text"
                placeholder="请输入用户名"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label for="password">密码</label>
            <div class="input-wrapper">
              <i class="fas fa-lock"></i>
              <input
                id="password"
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <button
              type="submit"
              class="login-button"
              :disabled="loginLoading"
            >
              <i v-if="loginLoading" class="fas fa-spinner fa-spin"></i>
              {{ loginLoading ? '登录中...' : '登录' }}
            </button>
          </div>

          <div v-if="loginError" class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            {{ loginError }}
          </div>
        </form>
      </div>
    </div>

    <!-- 主页面内容 -->
    <div v-else>
      <!-- 头部标题 -->
      <div class="header">
        <div class="header-content">
          <div>
            <h1 class="title">系统导航中心</h1>
            <p class="subtitle">请选择您要访问的功能模块</p>
          </div>
          <div class="user-info">
            <span>欢迎，{{ loggedInUser }}</span>
            <button @click="logout" class="logout-button">
              <i class="fas fa-sign-out-alt"></i>
              退出
            </button>
          </div>
        </div>
      </div>

      <!-- 导航网格 -->
      <div class="nav-grid">
        <div
          v-for="item in navItems"
          :key="item.id"
          class="nav-card"
          @click="navigateTo(item.path)"
        >
          <div class="icon-wrapper" :style="{ backgroundColor: item.color }">
            <i :class="item.icon"></i>
          </div>
          <div class="card-content">
            <h3 class="card-title">{{ item.title }}</h3>
            <p class="card-description">{{ item.description }}</p>
          </div>
        </div>
      </div>

      <!-- 底部提示 -->
      <div class="footer">
        <p>点击任意卡片进入相应功能模块</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { doLogin } from '@/api/index/index'
import md5 from 'crypto-js/md5'

// 定义导航项类型
interface NavItem {
  id: number
  title: string
  description: string
  icon: string
  path: string
  color: string
}

// 登录表单类型
interface LoginForm {
  username: string
  password: string
}

// 登录响应类型
interface LoginResponse {
  success: boolean
  username: string
  token: string
}

// 使用路由
const router = useRouter()

// 登录状态
const isLoggedIn = ref(false)
const loggedInUser = ref('')
const loginLoading = ref(false)
const loginError = ref('')

// 登录表单数据
const loginForm = reactive<LoginForm>({
  username: '',
  password: ''
})

// 导航项数据
const navItems = ref<NavItem[]>([
  {
    id: 1,
    title: '菜单管理',
    description: '管理菜单新增、删除、编辑等',
    icon: 'fas fa-users',
    path: '/menu',
    color: '#4e73df'
  },
  {
    id: 2,
    title: '文章管理',
    description: '用于添加、修改、删除文章',
    icon: 'fas fa-chart-bar',
    path: '/article',
    color: '#1cc88a'
  },
  {
    id: 3,
    title: '系统设置',
    description: '配置系统参数和基础信息',
    icon: 'fas fa-cog',
    path: '/system-settings',
    color: '#36b9cc'
  },
  {
    id: 4,
    title: '消息中心',
    description: '查看系统通知和消息',
    icon: 'fas fa-envelope',
    path: '/message-center',
    color: '#f6c23e'
  },
  {
    id: 5,
    title: '文档管理',
    description: '管理系统文档和资料库',
    icon: 'fas fa-file-alt',
    path: '/document-management',
    color: '#e74a3b'
  },
  {
    id: 6,
    title: '日志审计',
    description: '查看系统操作日志',
    icon: 'fas fa-clipboard-list',
    path: '/log-audit',
    color: '#858796'
  }
])

// 检查登录状态
const checkLoginStatus = () => {
  const user = localStorage.getItem('loggedInUser')
  const token = localStorage.getItem('authToken')

  console.log('checkLoginStatus', user, token)

  if (user && token) {
    isLoggedIn.value = true
    loggedInUser.value = user
  }
}

// 页面加载时检查登录状态
onMounted(() => {
  checkLoginStatus()
})

// 处理登录
const handleLogin = async () => {
  if (!loginForm.username || !loginForm.password) {
    loginError.value = '请输入用户名和密码'
    return
  }

  loginLoading.value = true
  loginError.value = ''

  try {
    // 对密码进行MD5加密
    const encryptedPassword = md5(loginForm.password).toString()

    // 调用登录接口，传递加密后的密码
    const response: LoginResponse = await doLogin(loginForm.username, encryptedPassword)

    if (response.success) {
      // 登录成功，保存用户信息和token
      isLoggedIn.value = true
      loggedInUser.value = response.username || loginForm.username

      // 保存到localStorage
      localStorage.setItem('loggedInUser', response.username || loginForm.username)
      if (response.token) {
        localStorage.setItem('authToken', response.token)
      }

      // 清空表单
      loginForm.username = ''
      loginForm.password = ''
    } else {
      loginError.value = response.message || '登录失败'
    }
  } catch (error: any) {
    loginError.value = error.message || '登录失败，请稍后重试'
  } finally {
    loginLoading.value = false
  }
}

// 退出登录
const logout = () => {
  isLoggedIn.value = false
  loggedInUser.value = ''
  loginForm.username = ''
  loginForm.password = ''

  // 清除localStorage中的登录信息
  localStorage.removeItem('loggedInUser')
  localStorage.removeItem('authToken')

  // 可选：重定向到登录页或首页
  // router.push('/login')
}

// 导航到指定路径
const navigateTo = (path: string) => {
  router.push(path)
}

// 页面可见性变化时检查登录状态（处理标签页切换等情况）
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    checkLoginStatus()
  }
})
</script>

<style scoped>
.navigation-container {
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  box-sizing: border-box;
}

/* 登录模态框样式 */
.login-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.login-modal {
  background: white;
  border-radius: 15px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 400px;
  padding: 30px;
  animation: modalAppear 0.3s ease;
}

@keyframes modalAppear {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  color: #333;
  font-size: 24px;
  margin-bottom: 10px;
}

.login-header p {
  color: #666;
  font-size: 14px;
}

.login-form .form-group {
  margin-bottom: 20px;
}

.login-form label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
}

.input-wrapper {
  position: relative;
}

.input-wrapper i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.input-wrapper input {
  width: 100%;
  padding: 12px 15px 12px 45px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.input-wrapper input:focus {
  border-color: #667eea;
  outline: none;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.login-button {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  color: #e74a3b;
  text-align: center;
  font-size: 14px;
  margin-top: 10px;
}

.error-message i {
  margin-right: 5px;
}

/* 主页面样式 */
.header {
  text-align: center;
  margin-bottom: 40px;
  padding-top: 20px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.title {
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 10px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.subtitle {
  color: rgba(255, 255, 255, 0.85);
  font-size: 1.2rem;
  font-weight: 300;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
  color: white;
  font-size: 1rem;
}

.logout-button {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  padding: 8px 15px;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;
}

.logout-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.nav-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
  max-width: 1200px;
  margin: 0 auto;
}

.nav-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.nav-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25);
}

.icon-wrapper {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.nav-card:hover .icon-wrapper {
  transform: scale(1.1);
}

.icon-wrapper i {
  font-size: 3.5rem;
  color: white;
}

.card-content {
  padding: 20px;
  text-align: center;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
}

.card-description {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.5;
}

.footer {
  text-align: center;
  margin-top: 40px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }

  .title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .header-content {
    flex-direction: column;
    text-align: center;
  }

  .user-info {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .navigation-container {
    padding: 15px;
  }

  .nav-grid {
    grid-template-columns: 1fr;
  }

  .header {
    margin-bottom: 30px;
  }

  .login-modal {
    margin: 0 20px;
    padding: 20px;
  }
}
</style>
