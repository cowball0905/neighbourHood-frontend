<template>
  <NuxtLayout name="default">
    <div class="welcome-section">
      <el-card class="welcome-card">
        <template #header>
          <div class="card-header">
            <h2>{{ $t('welcomeTitle') }}</h2>
          </div>
        </template>
        <p>{{ $t('welcomeMessage') }}</p>
        <div class="welcome-actions">
          <el-button type="primary" size="large" @click="goToCreatePost">
            <template #icon>
              <el-icon><Edit /></el-icon>
            </template>
            {{ $t('createNewPost') }}
          </el-button>
        </div>
      </el-card>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  Edit,
} from '@element-plus/icons-vue'

const router = useRouter()

const goToCreatePost = () => {
  router.push('/create-post')
}
</script>

<style scoped>
.welcome-section {
  margin-bottom: 30px;
  width: 100%;
}

.welcome-card {
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border-radius: 8px;
}

.card-header h2 {
  margin: 0;
  font-size: 32px;
  color: #333;
}

.welcome-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.posts-section {
  margin-top: 0;
  width: 100%;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  margin: 0;
  font-size: 26px;
  color: #333;
}

.category-select {
  width: 150px;
}

.posts-list {
  display: grid;
  gap: 20px;
}

.post-card {
  border: none;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border-radius: 8px;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-author {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-info {
  display: flex;
  flex-direction: column;
}

.author-name {
  margin: 0;
  font-weight: 600;
  color: #333;
}

.post-time {
  margin: 0;
  font-size: 16px;
  color: #999;
}

.post-content {
  margin: 16px 0;
}

.post-content h4 {
  margin: 0 0 8px 0;
  color: #333;
}

.post-content p {
  margin: 0 0 12px 0;
  color: #666;
  line-height: 1.6;
}

.post-tag {
  margin-top: 8px;
}

.post-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.post-footer {
  display: flex;
  justify-content: space-between;
}
</style>