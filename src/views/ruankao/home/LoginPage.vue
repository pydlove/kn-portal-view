<!-- src/views/login/LoginPage.vue -->
<template>
  <div class="login-page">
    <div class="login-wrapper">
      <UserAuth
        :standalone="true"
        @login-success="handleLoginSuccess"
        @close="handleLoginSuccess"
      />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import UserAuth from '@/components/ruankao/UserAuth.vue'

const router = useRouter()

// 处理登录成功事件
const handleLoginSuccess = () => {
  // 获取重定向路径或跳转到首页
  const redirect = router.currentRoute.value.query.redirect || '/rk/home'
  router.push(redirect)
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.login-wrapper {
  width: 100%;
  max-width: 600px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
</style>
