<!-- src/components/Footer.vue -->
<template>
  <footer class="footer">
    <div class="footer-bottom">
      <div class="footer-info">
        <span>&copy; {{ currentYear }} Java 技术小窝. 保留所有权利.</span>
        <div style="padding-top: 5px">
          <img src="../assets/images/beian.png" class="beian-icon">
        </div>
        <span class="ft-ba">
          <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">
            浙ICP备2025200943号
          </a>
        </span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentYear = computed(() => new Date().getFullYear())

const goToHome = () => {
  router.push({ name: 'home' })
}

const goToAbout = () => {
  router.push({ name: 'about' })
}

const goToContact = () => {
  router.push({ name: 'contact' })
}

const openSocial = (platform: string) => {
  // 根据平台打开相应的社交媒体链接
  switch (platform) {
    case 'github':
      window.open('https://github.com/your-repo', '_blank')
      break
    case 'wechat':
      // 可以显示微信二维码弹窗
      alert('请扫描网站首页的微信二维码关注我们')
      break
    default:
      break
  }
}
</script>

<style scoped>
.beian-icon {
  width: 20px;
  height: 20px;
}

.fullstack-page .footer {
  color: #adbac7;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.fullstack-page.light-theme .footer {
  background-color: #f5f5f5;
  border-top: 1px solid #d9d9d9;
}

.footer {
  font-size: 14px;
  height: 50px;
}

.footer-info {
  gap: 10px;
  text-align: center;
  line-height: 50px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.footer-info a {
  color: #539bf5;
  text-decoration: none;
}

.footer-info a:hover {
  text-decoration: underline;
}

.ft-ba {
  margin-left: 5px;
}

@media (max-width: 768px) {
  .ft-ba {
    margin-left: 5px
  }

  .footer {
    font-size: 12px;
  }

}
</style>
