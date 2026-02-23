<template>
  <NuxtLayout name="default">
        <div class="wrapper">
          <div class="posts-toolbar">
            <el-input v-model="searchQuery" :placeholder="$t('searchPosts')" clearable style="width: 300px;" />
            <el-select v-model="sortBy" :placeholder="$t('sortBy')" style="width: 180px;">
              <el-option :label="$t('latest')" value="latest" />
              <el-option :label="$t('oldest')" value="oldest" />
              <el-option :label="$t('mostLikes')" value="mostLikes" />
              <el-option :label="$t('leastLikes')" value="leastLikes" />
            </el-select>
          </div>

          <PostList/>
        </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import PostList from '~/components/PostList.vue'
import { useI18n } from 'vue-i18n'
import { getPost } from '~/api/post'
import type { Post } from '~/types/post'

const { t, locale } = useI18n()
const language = computed(() => locale.value as 'en' | 'zh')
const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('latest')
const activeTab = ref('posts')
const isLoading = ref(false)

onMounted(async()=>{
  try{
    isLoading.value = true;
    const [error,data,options] = await getPost();
    if(!error&&data){
      posts.value = data.data;
    }
  }catch(e){
    console.log(e);
  }finally{
    isLoading.value = false;
  }
})

const posts = ref<Post[]>();

</script>

<style scoped>
.wrapper{
  display: flex;
  flex-direction: column;
}

.posts-toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  align-items: center;
  width: 100%;
}

</style>
