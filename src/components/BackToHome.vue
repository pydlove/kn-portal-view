<!-- src/components/BackToHome.vue -->
<template>
  <div class="back-to-home" @click="goToHome">
    <div class="home-button">
      <img class="back-to-home-img" src="../assets/images/home.png">
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToHome = () => {
  router.push('/index')
}
</script>

<style scoped>
.back-to-home-img {
  width: 30px;
  height: 30px;
}

.back-to-home {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
}

.home-button {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.home-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.home-button i {
  font-size: 20px;
  color: white;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .back-to-home {
    bottom: 20px;
    right: 20px;
  }

  .home-button {
    width: 45px;
    height: 45px;
  }

  .home-button i {
    font-size: 18px;
  }
}
</style>
