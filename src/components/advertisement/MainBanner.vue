<template>
  <div class="cloud-banner-wrapper" @click="goToCurrentBanner">
    <div class="cloud-banner-title">
      <span class="cloud-banner-red">【双11】</span>
      <span>腾讯云服务器本站读者专享</span>
    </div>
    <div class="cloud-banner-container">
      <div
        class="cloud-banner-slide"
        v-for="(banner, index) in visibleBanners"
        :key="index"
        :class="{ 'active': banner.index === currentBannerIndex }"
      >
        <img
          v-if="shouldLoadImage(banner.image, banner.index)"
          :src="banner.image"
          :alt="banner.title"
          class="cloud-icon"
          @load="markImageAsLoaded(banner.image)"
        />
        <div class="cloud-banner-text">
          <div class="banner-title">{{ banner.title }}</div>
          <div class="banner-subtitle">{{ banner.subtitle }}</div>
        </div>
      </div>
    </div>

    <!-- 指示器 -->
    <div class="banner-indicators" v-if="cloudBanners.length > 1">
      <span
        v-for="(banner, index) in cloudBanners"
        :key="index"
        class="indicator"
        :class="{ 'active': index === currentBannerIndex }"
        @click.stop="setCurrentBannerIndex(index)"
      ></span>
    </div>
  </div>
</template>

<script setup lang="ts">

import {computed, onMounted, ref} from "vue";

import txCloudImage from '../../assets/images/cloud/tx_475_250.png';
import txAiCloudImage from '../../assets/images/cloud/tx_ai_960_540.png';
import imCloudImage from '../../assets/images/cloud/im.png';

const loadedImages = ref<Set<string>>(new Set());

// 检查图片是否应该加载
const shouldLoadImage = (imageSrc: string, index: number) => {
  // 当前图片或下一张图片才加载
  const currentIndex = currentBannerIndex.value;
  const nextIndex = (currentIndex + 1) % cloudBanners.value.length;

  return index === currentIndex || index === nextIndex || loadedImages.value.has(imageSrc);
};

// 标记图片为已加载
const markImageAsLoaded = (imageSrc: string) => {
  loadedImages.value.add(imageSrc);
};

const cloudBanners = ref<Array<{
  title: string;
  subtitle: string;
  image: string;
  link: string;
}>>([]);

// 当前Banner索引
const currentBannerIndex = ref(0);

// 鼠标是否悬停在Banner上
const isBannerHovered = ref(false);

// 只渲染当前和下一张图片以减少资源消耗
const visibleBanners = computed(() => {
  if (cloudBanners.value.length === 0) return [];

  const currentIndex = currentBannerIndex.value;
  const nextIndex = (currentIndex + 1) % cloudBanners.value.length;

  return [
    { ...cloudBanners.value[currentIndex], index: currentIndex },
    { ...cloudBanners.value[nextIndex], index: nextIndex }
  ];
});

const initCloudBanners = () => {
  // 可以从配置文件、API或环境变量中获取
  cloudBanners.value = [
    {
      title: '腾讯云服务器限时优惠',
      subtitle: '高性能云服务器，低至￥99/年',
      image: txCloudImage,
      link: 'https://curl.qcloud.com/H9ROhsBA'
    },
    {
      title: '【腾讯云】AI 驱动 · 智领未来',
      subtitle: '4核4G3M云服务器低至 79元/年',
      image: txAiCloudImage,
      link: 'https://curl.qcloud.com/t4hW6ANm'
    },
    {
      title: '【腾讯云】语音识别准确率高',
      subtitle: '限时特惠，最低14.9元起',
      image: imCloudImage,
      link: 'https://curl.qcloud.com/ftUqNHzA'
    }
  ];
};

// 跳转到当前Banner链接
const goToCurrentBanner = () => {
  if (cloudBanners.value.length > 0) {
    const currentBanner = cloudBanners.value[currentBannerIndex.value];
    if (currentBanner.link) {
      window.open(currentBanner.link, '_blank');
    }
  }
};

// 设置当前Banner索引
const setCurrentBannerIndex = (index: number) => {
  currentBannerIndex.value = index;
};

onMounted(() => {

  initCloudBanners()

  setInterval(() => {
    if (!isBannerHovered.value && cloudBanners.value.length > 0) {
      currentBannerIndex.value = (currentBannerIndex.value + 1) % cloudBanners.value.length;
    }
  }, 3000); // 每3秒切换一次
})
</script>

<style scoped>

.cloud-banner-red {
  color: red;
}

.cloud-banner-title {
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 5px;
  text-align: center;
}

/* 翻页式Banner样式 */
.cloud-banner-wrapper {
  margin: 15px;
  padding: 8px;
  background: linear-gradient(135deg, #006eff, #0052cc);
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 110, 255, 0.3);
  position: relative;
  overflow: hidden;
  height: 200px;
}

.cloud-banner-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.cloud-banner-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
  transform: translateZ(0); /* 启用硬件加速 */
  flex-direction: column;
}

.cloud-banner-slide.active {
  opacity: 1;
}

.cloud-icon {
  width: 200px;
  height: 105px;
  max-height: 105px;
  object-fit: contain;
  flex-shrink: 0;
  border-radius: 4px;
}

.cloud-banner-text {
  flex: 1;
  color: white;
  text-align: center;
  margin: 0 10px;
  min-width: 0;
  margin-top: 10px;
}

.banner-title {
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.banner-subtitle {
  font-size: 10px;
  opacity: 0.9;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cloud-banner-arrow {
  flex-shrink: 0;
  font-size: 16px;
  color: white;
  margin-left: 5px;
}

/* 指示器样式 */
.banner-indicators {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.indicator.active {
  background-color: white;
}

.fullstack-page .cloud-banner-wrapper {
  background: linear-gradient(135deg, #0052cc, #003da6);
}

.fullstack-page.light-theme .cloud-banner-wrapper {
  background: linear-gradient(135deg, #006eff, #0052cc);
}
</style>
