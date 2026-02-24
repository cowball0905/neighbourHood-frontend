<template>
  <el-container class="app-layout">
    <el-header class="app-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="app-title" @click="goToHome" style="cursor: pointer;">{{ $t('appName') }}</h1>
        </div>
        <div class="header-right">
          <NuxtLink :to="`/notifications`">
            <el-badge :value="notificationCount" class="notification-badge">
              <el-button text :icon="Bell" />
            </el-badge>
          </NuxtLink>
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              <el-avatar :size="32" :src="userAvatar" />
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  {{ $t('profile') }}
                </el-dropdown-item>
                <el-dropdown-item command="settings">
                  {{ $t('settings') }}
                </el-dropdown-item>
                <el-dropdown-item command="language">
                  {{ $t('language') }}
                </el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  {{ $t('logout') }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </el-header>

    <el-container class="main-content">
      <el-aside class="app-sidebar">
        <div class="sidebar-header">
          <el-button type="primary" class="create-post-btn" @click="goToCreatePost">
            <template #icon>
              <el-icon><Plus /></el-icon>
            </template>
            {{ $t('createNewPost') }}
          </el-button>
        </div>

        <el-menu :default-active="activeMenuPath" class="sidebar-menu">
          <el-menu-item index="/home" @click="handleMenuClick('/home')" :class="{ 'menu-active': activeMenuPath.includes('/home') }">
            <el-icon><HomeFilled /></el-icon>
            <span>{{ $t('home') }}</span>
          </el-menu-item>
          <el-menu-item index="/posts" @click="handleMenuClick('/posts')" :class="{ 'menu-active': activeMenuPath.includes('/posts') }">
            <el-icon><DocumentCopy /></el-icon>
            <span>{{ $t('posts') }}</span>
          </el-menu-item>
          <el-menu-item index="/chat" @click="handleMenuClick('/chat')" :class="{ 'menu-active': activeMenuPath.includes('/chat') }">
            <el-icon><ChatLineRound /></el-icon>
            <span>{{ $t('messages') }}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-main class="app-main">
        <slot></slot>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { navigateTo } from '#app'
import {Storage} from "../utils/storage"
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import {
  HomeFilled,
  DocumentCopy,
  Location,
  Plus,
  Bell,
  ChatLineRound,
} from '@element-plus/icons-vue'
import { getNotifications } from '~/api/notification'
import type { Notification, User } from '~/types/common'
import { useAuthStore } from '../stores/useAuthStore'

const router = useRouter()
const notifications = ref<Notification[]>()
const route = useRoute()
const { locale, t , setLocale } = useI18n()
const notificationCount = ref()
const activeMenuPath = ref(route.path)
const userProfile = ref<any>(null)
const userStore = useAuthStore();



const {subscribe,unsubscribe} = useSocket();
const {user} = useUser();

const userAvatar = computed(() => {
  return userProfile.value?.avatar || 'https://cube.elemecdn.com/0/88/03b0f476b63c5258a53e1b43f2ecb3.svg'
})

onMounted(async ()=>{
  subscribe(`/topic/user/${user?.value?.uuid}`, (msg: any) => {
    const notification = JSON.parse(msg.body);
    notifications.value?.push(notification);
    notificationCount.value = notifications.value?.length
  });
  const [error, data, options]= await getNotifications();
  if(!error && data){
    notifications.value = data?.data
    notificationCount.value = notifications.value?.length
  }
})

onUnmounted(()=>{
  unsubscribe(`/topic/user/${user?.value?.uuid}`);
})

const loadUserProfile = () => {
  const savedProfile = localStorage.getItem('userProfile')
  if (savedProfile) {
    userProfile.value = JSON.parse(savedProfile)
  }
}

onMounted(() => {
  loadUserProfile()
  
  window.addEventListener('storage', () => {
    loadUserProfile()
  })
})

const handleMenuClick = (path: string) => {
  navigateTo(path)
}

const goToHome = () => {
  router.push('/home')
}

const handleCommand = (command: string) => {
  if (command === 'logout') {
    userStore.logout()
    router.push('/')
  } else if (command === 'language') {
    const newLocale = locale.value === 'en' ? 'zh' : 'en'
    Storage.set('locale', newLocale); 
    setLocale(newLocale)
  }
}

const goToCreatePost = () => {
  router.push('/create-post')
}
</script>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f5f7fa;
}

.app-header {
  background: white;
  border-bottom: 1px solid #e5e5e5;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  padding: 0 !important;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 20px;
}

.header-left {
  flex: 0 0 auto;
  width: 200px;
}

.app-title {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  color: #333;
  transition: color 0.3s;
}

.header-center {
  flex: 1;
  margin: 0 40px;
}

.search-input {
  width: 100%;
  max-width: 400px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.notification-badge {
  cursor: pointer;
}

.el-dropdown-link {
  cursor: pointer;
}

.main-content {
  flex: 1;
  display: flex;
}

.app-sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid #e5e5e5;
  overflow-y: auto;
  font-size: var(--base-font-size, 14px);
}

.sidebar-header {
  padding: var(--spacing-unit, 16px);
  border-bottom: 1px solid #f0f0f0;
}

.create-post-btn {
  width: 100%;
  font-size: var(--base-font-size, 14px);
  height: var(--element-height, 40px);
}

.sidebar-menu {
  border: none;
}

.sidebar-menu :deep(.el-menu-item) {
  color: #666;
  transition: all 0.3s;
  font-size: var(--base-font-size, 14px);
  height: var(--element-height, 40px);
  line-height: var(--element-height, 40px);
  padding: 0 var(--spacing-unit, 16px);
}

.sidebar-menu :deep(.el-menu-item .el-icon) {
  color: #666;
  transition: color 0.3s;
}

.sidebar-others {
  padding: var(--spacing-unit, 16px);
  border-top: 1px solid #f0f0f0;
}

.sidebar-others :deep(.el-button) {
  color: #666;
  font-size: var(--base-font-size, 14px);
}

.app-main {
  flex: 1;
  padding: var(--card-padding, 20px);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  font-size: var(--base-font-size, 14px);
  background: transparent;
}

/* Scrollbar */
.app-sidebar::-webkit-scrollbar {
  width: 6px;
}

.app-sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.app-sidebar::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

.app-sidebar::-webkit-scrollbar-thumb:hover {
  background: #999;
}

.app-main::-webkit-scrollbar {
  width: 6px;
}

.app-main::-webkit-scrollbar-track {
  background: transparent;
}

.app-main::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

.app-main::-webkit-scrollbar-thumb:hover {
  background: #999;
}
</style>

<style>
/* Global styles for menu items - not scoped to ensure they override Element Plus defaults */
.sidebar-menu .el-menu-item {
  color: #666 !important;
  transition: all 0.3s !important;
  font-size: var(--base-font-size, 14px) !important;
}

.sidebar-menu .el-menu-item .el-icon {
  color: #666 !important;
  transition: color 0.3s !important;
  font-size: calc(var(--base-font-size, 14px) * 1.2) !important;
}

.sidebar-menu .el-menu-item:hover {
  background-color: #e8f4fd !important;
}
</style>
