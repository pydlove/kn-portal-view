<template>
  <a-layout-header class="header">
    <div class="logo">
      <img :src="logo" alt="logo" class="logo-img"/>
      <span class="logo-text">一表通</span>
    </div>
    <a-menu mode="horizontal" :selected-keys="selectedKeys" class="main-menu">
      <a-menu-item v-for="(menu, index) in menus" :key="menu.menuCode"
                   @click="handleMenuClick(menu.menuCode)">
        <router-link :to="menu.menuUrl" class="menu-link">{{
            menu.menuName
          }}
        </router-link>
      </a-menu-item>
    </a-menu>
    <div class="right-section">
      <a-popover
        placement="bottom"
        trigger="hover"
        :visible="popoverVisible"
        @visible-change="handlePopoverVisibleChange"
        class="message-popover"
      >
        <template #content>
          <div class="notification-content">
            <p v-if="messageData.length > 0" v-for="(message, index) in messageData"
               :key="index">
              消息{{ index + 1 }}: {{ message.content }}
            </p>
            <p v-else>
              <img class="no-message" :src="noMessage"/>
            </p>
          </div>
        </template>
        <a-badge :count="messageCount" :offset="[10, 0]" class="message-badge">
          <BellOutlined class="message-icon"/>
        </a-badge>
      </a-popover>
      <a-dropdown trigger="click" class="user-dropdown">
        <span class="ant-dropdown-link">
          <UserOutlined class="user-icon"/>
          <span class="user-name">{{ username }}</span>
          <span class="ant-dropdown-icon-sizer"/>
        </span>
        <template #overlay>
          <a-menu class="user-menu">
            <a-menu-item key="logout" @click="doLogout">登出</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </a-layout-header>
</template>
<script setup>
import logo from '@/assets/images/logo.png';
import noMessage from '@/assets/images/no_message.png';
import {onMounted, ref, watch} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {Badge, Dropdown, Menu, Popover, message} from 'ant-design-vue';
import {BellOutlined, UserOutlined} from '@ant-design/icons-vue';
import {readMessage, messagePage} from '@/api/login/header.ts';
import {logout} from '@/api/login/login.ts';

const route = useRoute();
const router = useRouter();
const username = ref('');
const selectedKeys = ref([]);
const menus = ref([]);
const menusJson = sessionStorage.getItem('_menus');
if (menusJson) {
  try {
    const parsedMenus = JSON.parse(menusJson);
    if (Array.isArray(parsedMenus)) {
      menus.value = parsedMenus;
      let menuCode = sessionStorage.getItem('menuCode');
      console.log(menuCode);
      if (menuCode) {
        selectedKeys.value = [menuCode];
        // 根据 menuCode 找到对应的 menuUrl 并进行路由导航
        const activeMenu = parsedMenus.find(menu => menu.menuCode === menuCode);
        if (activeMenu) {
          router.push({ path: activeMenu.menuUrl });
        }
      } else {
        selectedKeys.value = [parsedMenus[0].menuCode];
        // 导航到默认的第一个菜单项
        router.push({ path: parsedMenus[0].menuUrl });
      }
    }
  } catch (error) {
    console.error('解析 _menus 时出错:', error);
  }
}

const messageData = ref([]);
const messageCount = ref(0);
const popoverVisible = ref(false);

const handleMenuClick = (menuCode) => {
  sessionStorage.setItem('menuCode', menuCode);
  selectedKeys.value = [menuCode];
  const activeMenu = menus.value.find(menu => menu.menuCode === menuCode);
  if (activeMenu) {
    router.push({path: activeMenu.menuUrl});
  }
};

const doLogout = async () => {
  try {
    await logout();
    // 登出成功后导航到登录页
    window.location.href = 'login';
  } catch (error) {
    console.error('登出失败:', error);
    message.error('登出失败，请重试');
  }
};

// 处理 popover 显示状态变化
const handlePopoverVisibleChange = async (visible) => {
  if (visible) {
    popoverVisible.value = true;
    try {
      // 遍历 messageData 获取消息的 id 数组
      const messageIds = messageData.value.map((message) => message.id);
      console.log(messageIds);
      await readMessage({ids: messageIds});
      setTimeout(() => {
        fetchMessages();
      }, 5000);
    } catch (error) {
      console.error('标记消息为已读失败:', error);
    }
  } else {
    setTimeout(() => {
      popoverVisible.value = false;
    }, 3000);
  }
};

const fetchMessages = async () => {
  try {
    const res = await messagePage({
      page: 1,
      rows: 10,
    });
    console.log('header', res);
    messageCount.value = res.total;
    messageData.value = res.rows;
  } catch (error) {
    console.error('获取消息失败:', error);
  }
};

onMounted(() => {
  fetchMessages();
  username.value = sessionStorage.getItem('username');
});
</script>

<style scoped>
.header {
  background-color: #ffffff;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #333;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  height: 70px;
}

.main-menu {
  background-color: #ffffff;
  height: 70px !important;
  line-height: 70px !important;
}

.logo {
  display: flex;
  align-items: center;
}

.logo-img {
  width: 40px;
  height: 40px;
  margin-right: 12px;
  transition: transform 0.2s ease-in-out;
}

.logo-img:hover {
  transform: scale(1.1);
}

.logo-text {
  font-size: 20px;
  font-weight: 600;
  color: #007bff;
}

.main-menu {
  border-bottom: none;
}

.menu-link {
  font-size: 16px;
  color: #333;
  padding: 16px 20px;
  transition: color 0.2s ease-in-out;
}

.menu-link:hover {
  color: #007bff;
}

.right-section {
  display: flex;
  align-items: center;
}

.message-popover {
  margin-right: 24px;
}

.message-badge {
  margin-right: 16px;
}

.message-icon {
  font-size: 20px;
  color: #333;
  transition: color 0.2s ease-in-out;
}

.message-icon:hover {
  color: #007bff;
}

.user-dropdown {
  margin-right: 16px;
}

.user-icon {
  font-size: 20px;
  color: #333;
  transition: color 0.2s ease-in-out;
}

.user-icon:hover {
  color: #007bff;
}

.notification-content {
  max-width: 300px;
  padding: 16px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.notification-content p {
  margin: 8px 0;
  font-size: 14px;
  color: #333;
}

.no-message {
  width: 200px;
  height: 200px;
  display: block;
  margin: 0 auto;
}

:deep(.ant-scroll-number) {
  right: 18px !important;
}

:deep(.ant-popover-content) {
  width: 300px !important;
  max-height: 300px !important;
  left: -63px !important;
}

:deep(.ant-popover-arrow) {
  right: 20px !important;
}

.user-menu {
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.user-menu.ant-menu-item {
  font-size: 14px;
  color: #333;
  transition: background-color 0.2s ease-in-out;
}

.user-menu.ant-menu-item:hover {
  background-color: #f8f9fa;
}

.user-name {
  margin-left: 5px;
}
</style>
