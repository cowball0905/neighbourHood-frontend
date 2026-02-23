<template>
  <el-card class="post-card">
    <template #header>
      <div class="post-header">
        <div class="post-author">
          <el-avatar :size="40" />
          <div class="author-info">
            <p class="author-name">{{ post.user?.username }}</p>
            <p class="post-time">{{ post?.createTime ? new Date(post.createTime).toLocaleString('en-HK', {
              timeZone:
                "Asia/Hong_Kong"
            }) : 'Unknown time'
            }}</p>
          </div>
        </div>
        <el-dropdown trigger="click" @command="handleCommand">
          <el-button text :icon="MoreFilled" circle />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-if="isOwnPost" command="edit">
                <el-icon>
                  <Edit />
                </el-icon>
                {{ $t('edit') }}
              </el-dropdown-item>
              <el-dropdown-item v-if="isOwnPost" command="delete">
                <el-icon>
                  <Delete />
                </el-icon>
                {{ $t('delete') }}
              </el-dropdown-item>
              <el-dropdown-item v-if="!isOwnPost" command="report" :divided="isOwnPost">
                <el-icon>
                  <Warning />
                </el-icon>
                {{ $t('report') }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </template>

    <NuxtLink :to="`/posts/${post?.id}`">
      <div class="post-content">
        <div class="post-information">
          <p class="post-title">{{ post ? truncateText(post.title, 50) : "" }}</p>
          <p class="post-range">{{ $t('timeSelect') }}: {{ post.startTime ? new
            Date(post.startTime).toLocaleString('en-US') :
            "null"
          }}
            - {{
              post.endTime ?
                new Date(post.endTime).toLocaleString('en-US') : "null" }}</p>
        </div>
        <p class="post-text">
          {{ post ? truncateText(post.content, 100) : "" }}
        </p>
        <div class="image">
          <el-image loading="lazy" v-if="post.postPhotos" v-for="(photo, index) in post.postPhotos" :src="photo.url"
            :fit="'cover'" style="width: 100px; height: 100px" />
        </div>
        <el-tag class="tag" size="large">{{ tagValue }}</el-tag>
      </div>
    </NuxtLink>
      <template #footer>
        <div class="post-footer">
          <el-space>
            <el-button text @click="handleLike"><Star :color="post?.likeUsers?.some(u => u.uuid==user?.uuid)? '#FFBF00': '#000000'" style="width:1em;height:1em;margin-right: 4px;"/> {{ post?.likeUsers?.length }}</el-button>
            <StartChatDialog v-if="!isOwnPost" :postAuthorUuid="post.user?.uuid" :postID="post.id"><el-button text><el-icon><Message style="width:1.5em;height:1.5em;"/></el-icon></el-button></StartChatDialog>
          </el-space>
        </div>
      </template>
  </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Star, MoreFilled, Edit, Delete, Warning,Message } from '@element-plus/icons-vue'
import type { Post } from '../types/post'
import { likePost } from '~/api/post';
import { useSocket } from '../composables/socket';
import type { User } from '~/types/common';
import { useUser } from '../composables/user';
import StartChatDialog from './chat/startChatDialog.vue';

const props = defineProps<{
  post: Post
  user: User | undefined
}>()

const {user} = useUser();

const { subscribe, unsubscribe } = useSocket();
const post = ref<Post>(props.post);

onMounted(async () => {
  subscribe(`/topic/post/${props.post.id.toString()}`, (data) => {
    const updatedPost = JSON.parse(data.body);
    post.value = updatedPost;
  })
})

onUnmounted(() => {
  unsubscribe(`/topic/post/${props.post.id.toString()}`);
})

const emit = defineEmits<{
  (e: 'showDetail', post: Post): void
  (e: 'edit', post: Post): void
  (e: 'delete', post: Post): void
  (e: 'report', post: Post): void
}>()

const isOwnPost = computed(() => {
  return props.user?.username == props.post.user?.username
})

function handleCommand(command: string) {
  switch (command) {
    case 'edit':
      emit('edit', props.post)
      break
    case 'delete':
      emit('delete', props.post)
      break
    case 'report':
      emit('report', props.post)
      break
  }
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text
  }
  return text.substring(0, maxLength)
}

async function handleLike() {
  let isSubmitting = true
  try {
    await likePost(props.post.id);
  } catch (e) {
    console.log(e)
  } finally {
    isSubmitting = false;
  }
}

const tagValue = computed(() => {
  switch (props.post.request_type) {
    case 0: return $t('shopping')
    case 1: return $t('repair')
    case 2: return $t('care')
    case 3: return $t('daily')
    case 4: return $t('other')
    default: return $t('other')
  }
})
</script>

<style scoped>
.tag {
  max-width: 100px;
  margin-top: auto;
}

a{
  text-decoration: none;
}

.post-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.post-information p {
  margin: 0 !important;
  color: black;
  line-height: 5px;
}

.post-title {
  font-size: 20px;
  font-weight: 800;
}

.post-range {
  font-size: 10px;
}

.image {
  display: flex;
  gap: 20px;
  overflow: hidden;
  margin-bottom: 20px;
  ;
}

.post-card {
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  width: 600px;
  max-width: 600px;
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


.post-title {
  overflow: hidden;
  white-space: nowrap;
}

.post-content p {
  margin: 12px 0 12px 0;
  color: #666;
  line-height: 1.6;
}


.post-text {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.read-more {
  color: #409eff;
  cursor: pointer;
  font-weight: 600;
  margin-left: 4px;
  transition: color 0.3s;
}

.read-more:hover {
  color: #66b1ff;
  text-decoration: underline;
}

.post-footer {
  display: flex;
  justify-content: space-between;
}
</style>
