<template>
  <a-layout-header class="header">
    <div class="logo">
      <img :src="logo" alt="logo"/>
      <span>一表通</span>
    </div>
    <a-menu mode="horizontal" :selected-keys="selectedKeys">
      <a-menu-item v-for="(menu, index) in menus" :key="menu.menuCode"
                   @click="handleMenuClick(menu.menuCode)">
        <router-link :to="menu.menuUrl">{{ menu.menuName }}</router-link>
      </a-menu-item>
    </a-menu>
    <div class="right-section">
      <a-popover
        placement="bottom"
        trigger="hover"
        :visible="popoverVisible"
        @visible-change="handlePopoverVisibleChange"
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
        <a-badge :count="messageCount" :offset="[10, 0]">
          <BellOutlined/>
        </a-badge>
      </a-popover>
      <a-dropdown trigger="click">
        <span class="ant-dropdown-link">
          <UserOutlined/>
          <span class="ant-dropdown-icon-sizer"/>
        </span>
        <template #overlay>
          <a-menu>
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
const selectedKeys = ref([]);
const menus = ref([]);
const menusJson = sessionStorage.getItem('_menus');
if (menusJson) {
  try {
    const parsedMenus = JSON.parse(menusJson);
    if (Array.isArray(parsedMenus)) {
      menus.value = parsedMenus;
      selectedKeys.value = [parsedMenus[0].menuCode];
    }
  } catch (error) {
    console.error('解析 _menus 时出错:', error);
  }
}

const messageData = ref([]);
const messageCount = ref(5);
const popoverVisible = ref(false);

const handleMenuClick = (menuCode) => {
  selectedKeys.value = [menuCode];
};

const doLogout = async () => {
  try {
    await logout();
    // 登出成功后导航到登录页
    window.location.href='login';
  } catch (error) {
    console.error('登出失败:', error);
    message.error('登出失败，请重试');
  }
};

// watch(
//   () => route.name,
//   (newName) => {
//     if (newName) {
//       selectedKeys.value = [newName];
//     } else {
//       selectedKeys.value = [];
//     }
//   },
//   {immediate: true}
// );

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
});
</script>
<style scoped>
.header {
  background-color: #fff;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #434343;
  border-bottom: 1px solid #e8e8e8;
}

.logo {
  display: flex;
  align-items: center;
}

.logo img {
  width: 32px;
  height: 32px;
  margin-right: 8px;
}

.right-section {
  display: flex;
  align-items: center;
}

.ant-menu-horizontal {
  border-bottom: 0px !important;
}

.ant-dropdown-link {
  cursor: pointer;
  padding: 0 8px;
}

.ant-dropdown-icon-sizer {
  font-size: 0;
  line-height: 0;
}

.anticon {
  font-size: 18px;
  margin-right: 16px;
}

.notification-content {
  max-width: 200px;
  padding: 8px;
}

.notification-content p {
  margin: 4px 0;
}

/* 使用 :deep() 替换 /deep/ */
:deep(.ant-scroll-number) {
  right: 18px !important;
}

:deep(.ant-popover-content) {
  width: 400px !important;
  max-height: 300px !important;
  left: -63px !important;
}

:deep(.ant-popover-arrow) {
  right: 20px !important;
}

.no-message {
  width: 200px;
  height: 200px;
}
</style>

