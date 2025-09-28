<template>
  <div class="auth-wrapper">
    <div class="auth-container">
      <!-- 标题区域 -->
      <div class="auth-header">
        <h2 class="auth-title">{{ isLogin ? '欢迎回来' : '创建账户' }}</h2>
        <p class="auth-subtitle">{{ isLogin ? '登录您的账户' : '注册新账户' }}</p>
      </div>

      <!-- 切换标签 -->
      <div class="auth-tabs">
        <button
          :class="{ active: isLogin }"
          @click="switchToLogin"
          class="tab-btn"
        >
          登录
        </button>
        <button
          :class="{ active: !isLogin }"
          @click="switchToRegister"
          class="tab-btn"
        >
          注册
        </button>
      </div>

      <!-- 登录表单 -->
      <form v-if="isLogin" @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label for="loginUsername" class="form-label">用户名</label>
          <input
            id="loginUsername"
            v-model="loginForm.username"
            type="text"
            required
            placeholder="请输入用户名"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="loginPassword" class="form-label">密码</label>
          <input
            id="loginPassword"
            v-model="loginForm.password"
            type="password"
            required
            placeholder="请输入密码"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="loginCaptcha" class="form-label">验证码</label>
          <div class="captcha-wrapper">
            <input
              id="loginCaptcha"
              v-model="loginForm.verificationCode"
              type="text"
              required
              placeholder="请输入计算结果"
              class="form-input captcha-input"
            />
            <div class="captcha-question" @click="generateCaptcha">
              {{ captchaQuestion }}
            </div>
          </div>
        </div>

        <button type="submit" class="submit-btn" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>

        <div class="form-footer">
          <span class="footer-text">还没有账户？</span>
          <a href="#" @click.prevent="switchToRegister" class="footer-link">立即注册</a>
        </div>
      </form>

      <!-- 注册表单 -->
      <form v-else @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label for="regUsername" class="form-label">用户名</label>
          <input
            id="regUsername"
            v-model="registerForm.username"
            type="text"
            required
            placeholder="请输入用户名"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="regPassword" class="form-label">密码</label>
          <input
            id="regPassword"
            v-model="registerForm.password"
            type="password"
            required
            placeholder="请输入密码（至少8位）"
            class="form-input"
            @input="onPasswordInput"
          />
          <!-- 密码强度显示 -->
          <div v-if="showPasswordStrength" class="password-strength">
            <div class="strength-bar">
              <div
                class="strength-fill"
                :style="{
              width: passwordStrength ? (passwordStrength.passed / 5 * 100) + '%' : '0%',
              backgroundColor: passwordStrength ? passwordStrength.color : '#f0f0f0'
            }">
              </div>
            </div>
            <div
              class="strength-text"
              :style="{ color: passwordStrength ? passwordStrength.color : '#666' }">
              {{ passwordStrength ? passwordStrength.text : '请输入密码' }}
            </div>
            <div class="strength-requirements">
              <div
                class="requirement"
                :class="{ valid: passwordStrength?.checks.length, invalid: !passwordStrength?.checks.length }">
                <span class="requirement-icon">{{ passwordStrength?.checks.length ? '✓' : '✗' }}</span>
                至少8个字符
              </div>
              <div
                class="requirement"
                :class="{ valid: passwordStrength?.checks.hasUpperCase, invalid: !passwordStrength?.checks.hasUpperCase }">
                <span class="requirement-icon">{{ passwordStrength?.checks.hasUpperCase ? '✓' : '✗' }}</span>
                包含大写字母 (A-Z)
              </div>
              <div
                class="requirement"
                :class="{ valid: passwordStrength?.checks.hasLowerCase, invalid: !passwordStrength?.checks.hasLowerCase }">
                <span class="requirement-icon">{{ passwordStrength?.checks.hasLowerCase ? '✓' : '✗' }}</span>
                包含小写字母 (a-z)
              </div>
              <div
                class="requirement"
                :class="{ valid: passwordStrength?.checks.hasNumbers, invalid: !passwordStrength?.checks.hasNumbers }">
                <span class="requirement-icon">{{ passwordStrength?.checks.hasNumbers ? '✓' : '✗' }}</span>
                包含数字 (0-9)
              </div>
              <div
                class="requirement"
                :class="{ valid: passwordStrength?.checks.hasSpecialChar, invalid: !passwordStrength?.checks.hasSpecialChar }">
                <span class="requirement-icon">{{ passwordStrength?.checks.hasSpecialChar ? '✓' : '✗' }}</span>
                包含特殊字符 (!@#$%^&*等)
              </div>
            </div>
            <div v-if="passwordStrength && passwordStrength.level === 'weak'" class="weak-password-warning">
              <a-alert
                message="密码强度不足"
                description="请确保密码满足所有要求以提高账户安全性"
                type="warning"
                show-icon
                banner
              />
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="regConfirmPassword" class="form-label">确认密码</label>
          <input
            id="regConfirmPassword"
            v-model="registerForm.confirmPassword"
            type="password"
            required
            placeholder="请再次输入密码"
            class="form-input"
          />
          <div v-if="registerForm.confirmPassword && registerForm.password !== registerForm.confirmPassword" class="password-mismatch">
            <a-alert
              message="密码不匹配"
              description="两次输入的密码不一致，请重新输入"
              type="error"
              show-icon
              banner
            />
          </div>
        </div>

        <div class="form-group">
          <label for="regCaptcha" class="form-label">验证码</label>
          <div class="captcha-wrapper">
            <input
              id="regCaptcha"
              v-model="registerForm.verificationCode"
              type="text"
              required
              placeholder="请输入公众号验证码"
              class="form-input captcha-input"
            />
            <div class="qrcode-section">
              <img src="../../assets/images/gzh_code.jpg" alt="公众号二维码"
                   class="qrcode-img" @click="getVerificationCodeHandler"/>
              <p class="qrcode-tip">扫码关注公众号发送<span class="verification-key">“验证码{{ verificationKey }}”</span></p>
              <a href="#"
                 @click.prevent="getVerificationCodeHandler"
                 class="resend-link"
                 :class="{ 'disabled': refreshDisabled }">
                {{ refreshButtonText }}
              </a>
            </div>
          </div>
        </div>

        <button type="submit" class="submit-btn" :disabled="loading">
          {{ loading ? '注册中...' : '注册' }}
        </button>

        <div class="form-footer">
          <span class="footer-text">已有账户？</span>
          <a href="#" @click.prevent="switchToLogin" class="footer-link">立即登录</a>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>import {ref, reactive, onMounted, computed} from 'vue'
import {message, Alert as AAlert} from 'ant-design-vue'
import {
  registerUser,
  loginUser,
  getVerificationKey
} from '@/api/ruankao/login/login.ts'

// 状态管理
const isLogin = ref(true)
const loading = ref(false)
const captchaQuestion = ref('')
const verificationKey = ref('')
const lastRefreshTime = ref(0)
const refreshDisabled = ref(false)
const refreshCooldown = ref(3000) // 3秒冷却时间
const showPasswordStrength = ref(false)

const emit = defineEmits(['close', 'login-success'])

const props = defineProps({
  standalone: {
    type: Boolean,
    default: false
  }
})

// 表单数据
const loginForm = reactive({
  username: '',
  password: '',
  verificationCode: ''
})

const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  verificationCode: ''
})

// 密码强度检查
const passwordStrength = computed(() => {
  const password = registerForm.password
  if (!password) return null

  const checks = {
    length: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>[\]\\/`~;_+=-]/.test(password)
  }

  const passedChecks = Object.values(checks).filter(Boolean).length
  const strengthLevels = [
    { level: 'weak', text: '弱', color: '#ff4d4f' },
    { level: 'medium', text: '中等', color: '#faad14' },
    { level: 'strong', text: '强', color: '#52c41a' }
  ]

  if (passedChecks <= 2) return { ...strengthLevels[0], checks, passed: passedChecks }
  if (passedChecks <= 4) return { ...strengthLevels[1], checks, passed: passedChecks }
  return { ...strengthLevels[2], checks, passed: passedChecks }
})

// 密码输入处理
const onPasswordInput = () => {
  showPasswordStrength.value = true
}

// 计算刷新按钮文本
const refreshButtonText = computed(() => {
  if (refreshDisabled.value) {
    const elapsed = Date.now() - lastRefreshTime.value
    const remaining = Math.ceil((refreshCooldown.value - elapsed) / 1000)
    return `请等待 ${remaining} 秒`
  }
  return '点击刷新发送内容'
})

// 切换到登录
const switchToLogin = () => {
  isLogin.value = true
}

// 切换到注册
const switchToRegister = () => {
  isLogin.value = false
  getVerificationCodeHandler()
  // 切换到注册时重置密码强度显示
  showPasswordStrength.value = false
  registerForm.password = ''
  registerForm.confirmPassword = ''
}

// 生成计算验证码
const generateCaptcha = () => {
  const num1 = Math.floor(Math.random() * 10) + 1
  const num2 = Math.floor(Math.random() * 20) + 1
  const operators = ['+', '-', '*']
  const operator = operators[Math.floor(Math.random() * operators.length)]

  captchaQuestion.value = `${num1} ${operator} ${num2} = ?`
  // 计算正确答案（用于验证）
  switch (operator) {
    case '+':
      window.correctAnswer = num1 + num2
      break
    case '-':
      window.correctAnswer = num1 - num2
      break
    case '*':
      window.correctAnswer = num1 * num2
      break
  }
}

// 发送验证码
const getVerificationCodeHandler = async () => {
  // 检查冷却时间
  const now = Date.now()
  if (refreshDisabled.value || (now - lastRefreshTime.value) < refreshCooldown.value) {
    const remaining = Math.ceil((refreshCooldown.value - (now - lastRefreshTime.value)) / 1000)
    if (remaining > 0) {
      message.warning(`请等待 ${remaining} 秒后再刷新`)
      return
    }
  }

  try {
    // 设置冷却状态
    refreshDisabled.value = true
    lastRefreshTime.value = now

    verificationKey.value = await getVerificationKey();
    console.log('verificationKey', verificationKey.value)

    // 冷却时间结束后启用按钮
    setTimeout(() => {
      refreshDisabled.value = false
    }, refreshCooldown.value)
  } catch (error) {
    refreshDisabled.value = false
    message.error('刷新失败，请重试')
  }
}

// 处理登录
const handleLogin = async () => {
  if (!loginForm.username || !loginForm.password || !loginForm.verificationCode) {
    message.error('请填写完整信息')
    return
  }

  // 验证计算验证码
  if (parseInt(loginForm.verificationCode) !== window.correctAnswer) {
    message.error('验证码错误')
    generateCaptcha()
    return
  }

  loading.value = true
  try {
    // 调用登录API
    const response = await loginUser({
      username: loginForm.username,
      password: loginForm.password,
      verificationCode: loginForm.verificationCode
    })

    if (response && response.success) {
      message.success('登录成功')
      // 存储token等信息
      localStorage.setItem('token', response.token)
      localStorage.setItem('userInfo', JSON.stringify(response.user))

      // 通知父组件登录成功
      emit('login-success', response)

      // 如果不是独立页面模式，则关闭弹窗
      if (!props.standalone) {
        // 关闭弹窗
        emit('close')
      }
    } else {
      message.error(response?.message || '登录失败')
      generateCaptcha()
    }
  } catch (error) {
    message.error('登录请求失败')
    generateCaptcha()
  } finally {
    loading.value = false
  }
}

// 处理注册
const handleRegister = async () => {
  if (!registerForm.username || !registerForm.password ||
    !registerForm.confirmPassword || !registerForm.verificationCode) {
    message.error('请填写完整信息')
    return
  }

  // 验证密码强度
  if (!passwordStrength.value || passwordStrength.value.level === 'weak') {
    message.error('密码强度不足，请按要求设置密码')
    return
  }

  if (registerForm.password !== registerForm.confirmPassword) {
    message.error('两次密码输入不一致')
    return
  }

  loading.value = true
  try {
    // 调用注册API
    const response = await registerUser({
      username: registerForm.username,
      password: registerForm.password,
      confirmPassword: registerForm.confirmPassword,
      verificationCode: registerForm.verificationCode
    })

    if (response && response.data) {
      message.success('注册成功，请登录')
      switchToLogin()
    } else {
      message.error('注册失败')
    }
  } catch (error) {
    message.error('注册请求失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  generateCaptcha()
})
</script>

<style scoped>
.password-strength {
  margin-top: 8px;
}

.strength-bar {
  height: 6px;
  background-color: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
}

.strength-fill {
  height: 100%;
  border-radius: 3px;
  transition: all 0.3s ease;
}

.strength-text {
  font-size: 12px;
  font-weight: 500;
}

.strength-requirements {
  font-size: 12px;
  color: #666;
  margin-top: 5px;
  padding: 8px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.requirement {
  display: flex;
  align-items: center;
  margin-bottom: 3px;
}

.requirement.valid {
  color: #52c41a;
}

.requirement.invalid {
  color: #ff4d4f;
}

.requirement-icon {
  margin-right: 5px;
  font-size: 12px;
  width: 12px;
}

.weak-password-warning {
  margin-top: 10px;
}

.password-mismatch {
  margin-top: 10px;
}

.resend-link {
  color: #667eea;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  padding: 5px 10px;
  border-radius: 4px;
}

.resend-link:hover:not(.disabled) {
  text-decoration: underline;
  background-color: rgba(102, 126, 234, 0.1);
}

.resend-link.disabled {
  color: #ccc;
  cursor: not-allowed;
  text-decoration: none;
}

.resend-link.disabled:hover {
  background-color: transparent;
}

.auth-wrapper {
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 600px;
}

.auth-container {
  width: 100%;
  height: 100%;
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
  border-radius: 5px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.auth-header {
  text-align: center;
  padding: 35px 20px 25px;
  background: linear-gradient(120deg, #667eea, #764ba2);
  color: white;
  flex-shrink: 0;
}

.auth-title {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 10px;
  letter-spacing: 1px;
}

.auth-subtitle {
  font-size: 18px;
  font-weight: 400;
  margin: 0;
  opacity: 0.95;
}

.auth-tabs {
  display: flex;
  background: #f0f2f5;
  flex-shrink: 0;
}

.tab-btn {
  flex: 1;
  padding: 20px 0;
  border: none;
  background: transparent;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  color: #666;
}

.tab-btn.active {
  color: #667eea;
  background: #ffffff;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 4px;
  background: linear-gradient(to right, #667eea, #764ba2);
  border-radius: 4px;
}

.auth-form {
  padding: 30px 40px;
  flex: 1;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 25px;
}

.form-label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  color: #333;
  font-size: 16px;
}

.form-input {
  width: 100%;
  padding: 16px 18px;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: #ffffff;
  box-sizing: border-box;
  font-weight: 500;
}

.form-input:focus {
  border-color: #667eea;
  outline: none;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.15);
}

.captcha-wrapper {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.captcha-input {
  flex: 1;
}

.captcha-question {
  padding: 16px 20px;
  background: linear-gradient(120deg, #667eea, #764ba2);
  color: white;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 18px;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
  user-select: none;
}

.captcha-question:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.5);
}
.qrcode-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 2px dashed #ddd;
}

.qrcode-img {
  width: 180px;
  height: 180px;
  margin-bottom: 15px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.qrcode-tip {
  font-size: 15px;
  color: #555;
  margin: 0 0 10px;
  text-align: center;
  font-weight: 500;
  line-height: 1.6;
}

.verification-key {
  display: inline-block;
  background: linear-gradient(120deg, #667eea, #764ba2);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 16px;
  letter-spacing: 1px;
  box-shadow: 0 3px 10px rgba(102, 126, 234, 0.3);
  margin: 0 2px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(102, 126, 234, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(102, 126, 234, 0);
  }
}

.resend-link {
  color: #667eea;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
}

.resend-link:hover {
  text-decoration: underline;
}

.submit-btn {
  width: 100%;
  padding: 18px;
  background: linear-gradient(120deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
  margin-top: 10px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
}

.submit-btn:disabled {
  background: #bfc9d4;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.form-footer {
  text-align: center;
  margin-top: 30px;
  padding-top: 25px;
  border-top: 1px solid #eee;
}

.footer-text {
  color: #666;
  font-size: 16px;
}

.footer-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  margin-left: 8px;
  transition: all 0.3s ease;
  font-size: 16px;
}

.footer-link:hover {
  color: #764ba2;
  text-decoration: underline;
}

/* 滚动条样式 */
.auth-form::-webkit-scrollbar {
  width: 6px;
}

.auth-form::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.auth-form::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

.auth-form::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>
