<template>
  <div class="login-container">
    <el-card class="login-card">
      <el-dropdown @command="handleLanguageChange" class="locale-switcher">
        <el-button type="default">
          {{ currentLanguage?.name }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="lang in availableLanguages" :key="lang.code" :command="lang.code">
              {{ lang.name }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <div class="login-header">
        <h1 class="login-title">{{ t('loginTitle') }}</h1>
        <p class="login-subtitle">{{ t('loginSubtitle') }}</p>
      </div>
      <el-alert v-if="showError" :title="errorMessage" type="error" :closeable="true" @close="showError = false"
        show-icon class="error-alert" />
      <el-form :model="loginForm" ref="loginFormRef" label-position="top" :rules="rules">
        <el-form-item :label="t('email')" prop="email">
          <el-input v-model="loginForm.email" :placeholder="t('emailPlaceholder')"></el-input>
        </el-form-item>
        <el-form-item :label="t('password')" prop="password">
          <el-input type="password" v-model="loginForm.password" :placeholder="t('passwordPlaceholder')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin" class="log-in-btn">{{ t('login') }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { navigateTo } from '#app'
import type { FormInstance, FormRules } from 'element-plus'
import type { loginParams } from '../types/common'
import { useI18n } from 'vue-i18n'
import { ArrowDown } from '@element-plus/icons-vue'
import { useAuthStore } from '~/stores/useAuthStore'


const { t, locale, setLocale } = useI18n()
const authStore = useAuthStore()

const availableLanguages = [
  { code: 'en', name: 'English' },
  { code: 'zh', name: '中文' },
]

const currentLanguage = computed(() =>
  availableLanguages.find(lang => lang.code === locale.value)
)

const loginForm = reactive<loginParams>({
  email: '',
  password: ''
})

const loginFormRef = ref<FormInstance>()
const showError = ref(false)
const errorMessage = ref('')

const rules = computed(() => ({
  email: [
    { required: true, message: t('emailPlaceholder'), trigger: 'blur' },
  ],
  password: [
    {
      required: true,
      message: t('passwordPlaceholder'), trigger: 'blur'
    },
  ]
}))

const handleLogin = async () => {
  console.log('Login button clicked')
  if (!loginFormRef.value) {
    console.log('Form ref not available')
    return
  }
  try {
    console.log('Validating form...')
    await loginFormRef.value.validate()
    console.log('Form validation passed')
    await authStore.login(loginForm)
    if (authStore.isLogin) {
  console.log(authStore.userInfo)
  console.log(authStore.isLogin)
      await navigateTo('/home')
    } else {
      showError.value = true
      errorMessage.value = t('invalidCredentials')
    }
  } catch (error) {
    console.log(error)
    showError.value = true
    errorMessage.value = t('logingFailed')
  }
}

const handleLanguageChange = () => {
  if (locale.value === 'en') {
    setLocale('zh')
  } else {
    setLocale('en')
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Helvetica, Arial, sans-serif;
  height: 100%;
}

.login-left-side {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.brand-section {
  text-align: center;
  color: white;
}

.brand-title {
  font-size: 64px;
  font-weight: 700;
  margin: 0 0 20px 0;
}

.brand-description {
  font-size: 32px;
  font-weight: 400;
  margin: 0;
  opacity: 0.9;
}

.login-right-side {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: #f5f5f5;
}

.login-card {
  width: 100%;
  max-width: 450px;
  border: none !important;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1) !important;
  background: white !important;
  max-height: 60%;
}

.login-card :deep(.el-card__body) {
  padding: 50px 40px;
  position: relative;
}

.locale-switcher {
  position: absolute;
  top: 20px;
  right: 20px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-title {
  font-size: 52px;
  font-weight: 700;
  margin: 0 0 12px 0;
  color: #333;
}

.login-subtitle {
  font-size: 24px;
  color: #999;
  margin: 0;
  font-weight: 400;
}

.login-container :deep(.el-form) {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.login-container :deep(.el-form-item__label) {
  margin-bottom: 12px;
  color: #333;
  font-weight: 500;
  font-size: 20px;
}

.log-in-btn {
  width: 100% !important;
  height: 52px !important;
  font-size: 24px !important;
  font-weight: 600 !important;
}

.login-container :deep(.el-checkbox__label) {
  color: #666;
  font-size: 20px;
}

.divider {
  text-align: center;
  margin: 12px 0;
  position: relative;
  font-size: 18px;
  color: #999;
}

.divider::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 100%;
  height: 1px;
  background: #e0e0e0;
}

.divider span {
  position: relative;
  background: white;
  padding: 0 10px;
}

.social-login {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.social-btn-full {
  width: 100% !important;
  height: 50px !important;
  padding: 0 16px !important;
  border: 1px solid #e0e0e0 !important;
  background: white !important;
  color: #333 !important;
  font-size: 19px !important;
  font-weight: 500 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: flex-start !important;
  transition: all 0.3s ease;
  gap: 12px;
}

.social-btn-full:hover {
  border-color: #999 !important;
  background: #f9f9f9 !important;
}

.social-icon-full {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.social-btn {
  width: 50px !important;
  height: 50px !important;
  padding: 0 !important;
  border: 1px solid #e0e0e0 !important;
  background: white !important;
  transition: all 0.3s ease;
}

.social-btn:hover {
  border-color: #667eea !important;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15) !important;
}

.google-btn {
  border-color: #e0e0e0 !important;
}

.apple-btn {
  border-color: #e0e0e0 !important;
}

.phone-btn {
  border-color: #e0e0e0 !important;
}

.social-icon {
  width: 24px;
  height: 24px;
}
</style>
