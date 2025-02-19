<template>
  <div class="login-container">
    <div class="login-card">
      <h2>欢迎登录
        <!--        <span class="login-system">一张表系统</span>-->
      </h2>

      <input type="text" v-model="username" placeholder="请输入用户名"/>
      <input type="password" v-model="password" placeholder="请输入密码"/>
      <button @click="login">登录</button>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import {getRandomCode, onLogin} from "@/api/login/login";
import {encrypt} from '@/utils/index'
import { useRouter } from 'vue-router'
import { useLoginStore } from '@/store/modules/login'

const username = ref('admin');
const password = ref('123456');
const router = useRouter()
const loginStore = useLoginStore()

const login = async () => {

  console.log(username.value, password.value)
  // const {randomCode, randomId} = await getRandomCode()
  // const userPwd = encrypt(password.value, randomCode)
  // console.log(userPwd)
  const usernameValue = username.value
  const passwordValue = password.value

  try {
    const res = await loginStore.login({ usernameValue, passwordValue })
    // const res = await onLogin({username, userPwd, randomId})
    console.log(res)
    router.push({
      path: '/test'
    })

  } catch (e) {}
}

</script>

<style scoped>
.login-system {
  font-size: 16px;
  margin-left: 10px;
  color: rgb(42, 40, 40);
  font-weight: normal;
}

.login-container {
  background-image: url('@/assets/images/background.jpg');
  background-size: cover; /* 或者其他你需要的背景大小 */
  background-position: center; /* 或者其他你需要的背景位置 */
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f5f9;
}

.login-card {
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 400px;
  min-height: 340px;
  padding: 20px 20px 40px;
}

h2 {
  margin-bottom: 50px;
}

input {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 3px;
  margin-bottom: 20px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}
</style>
