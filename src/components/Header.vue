<template>
  <a-layout-header class="header">
    <div class="logo">
      <img :src="logo" alt="logo" />
      <span>一表通</span>
    </div>
    <a-menu mode="horizontal" :selected-keys="selectedKeys">
      <a-menu-item key="workbench">
        <router-link to="/workbench">智能查询</router-link>
      </a-menu-item>
      <a-menu-item key="test">
        <router-link to="/test">测试</router-link>
      </a-menu-item>
      <a-menu-item key="apply">
        <router-link to="/apply">申请审批</router-link>
      </a-menu-item>
    </a-menu>
    <div class="right-section">
      <a-popover placement="bottom" trigger="hover" @visible-change="handlePopoverVisibleChange">
        <template #content>
          <div class="notification-content">
            <p>消息1: 您有一条新消息</p>
            <p>消息2: 项目更新通知</p>
            <p>消息3: 任务提醒</p>
          </div>
        </template>
        <a-badge :count="messageCount" :offset="[10, 0]">
          <BellOutlined />
        </a-badge>
      </a-popover>
      <a-dropdown trigger="click">
        <span class="ant-dropdown-link">
          <UserOutlined />
          <span class="ant-dropdown-icon-sizer" />
        </span>
        <template #overlay>
          <a-menu>
            <a-menu-item key="option1">选项1</a-menu-item>
            <a-menu-item key="option2">选项2</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </a-layout-header>
</template>

<script setup>
import logo from '@/assets/images/logo.png';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { Badge, Dropdown, Menu, Popover, message } from 'ant-design-vue';
import { BellOutlined, UserOutlined } from '@ant-design/icons-vue';
// import { readMessage } from '@/api/login/header';

// 获取当前路由信息
const route = useRoute();
// 用于存储当前选中菜单项的 key
const selectedKeys = ref([]);

// 消息提示的数量
const messageCount = ref(5); // 你可以根据需要动态设置这个值

// 监听路由 name 的变化，更新选中项
watch(
  () => route.name,
  (newName) => {
    if (newName) {
      selectedKeys.value = [newName];
    } else {
      selectedKeys.value = [];
    }
  },
  {immediate: true}
);

// 处理 popover 显示状态变化
const handlePopoverVisibleChange = (visible) => {
  if (visible) {
      message.success('消息已读')
  }
};
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

/deep/ .ant-scroll-number {
  right: 18px !important;
}
</style>
