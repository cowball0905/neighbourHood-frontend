<template>
    <NuxtLayout>
        <div class="wrapper">
            <div class="post-card">
                <div class="loaded" v-if="!isLoading">
                    <div class="post-details">
                        <div class="post-left">
                            <div class="title-section">
                                <p class="post-title">
                                    {{ post?.title }}
                                </p>
                                <div class="name-time">
                                    <p class="post-username">{{ post?.user?.username }}</p>
                                    <p class="post-time">
                                        {{ post?.createTime? new Date(post?.createTime).toLocaleString('en'): "" }}
                                    </p>
                                </div>
                            </div>
                            <div class="content-section">
                                <p>
                                    {{ post?.content }}
                                </p>
                            </div>
                            <div class="image-section">
                                <div v-for="item in post?.postPhotos" class="photos">
                                    <el-image :src="item.url" fit="scale-down" style="width:80%;height:300px" lazy/>
                                </div>
                            </div>
                        </div>
                        <div class="post-right">
                            <p class="post-time">
                                {{ post?.startTime ? formatTime(new Date(post?.startTime)): "" }} - {{ post?.endTime ? formatTime(new Date(post?.endTime)): "" }}
                            </p>
                            <StartChatDialog v-if="isOwnPost()"><el-button>{{ $t('startChat') }}</el-button></StartChatDialog>
                        </div>
                    </div>
                    <el-tag class="tag" size="large">{{ tagValue }}</el-tag>
                    <div class="post-footer">
                        <el-space>
                            <el-button text @click="handleLike"><Star :color="post?.likeUsers?.some(u => u.uuid==userInfo?.uuid)? '#FFBF00': '#000000'" style="width:1em;height:1em;margin-right: 4px;"/> {{ post?.likeUsers?.length }}</el-button>
                        </el-space>
                    </div>
                </div>
                <el-skeleton :rows="10" animated v-else/>
                <div class="others">
                    <h3>{{ $t("otherReq") }}</h3>
                    <PostList :current-post="post" :limit="2"/>
                </div>
            </div>
        </div>
    </NuxtLayout>
</template>

<script lang="ts" setup>
import { getPostById, likePost } from '~/api/post';
import type { Post } from '~/types/post';
import { useI18n } from 'vue-i18n';
import { useUser } from '#imports';
import {Star} from "@element-plus/icons-vue"
import { useSocket } from '../../composables/socket';
import { formatTime } from '../helper';
import StartChatDialog from '~/components/chat/startChatDialog.vue';
import { useAuthStore } from '../../stores/useAuthStore';

const {t} = useI18n();
const {subscribe,unsubscribe} = useSocket();
const router = useRouter();
const route = useRoute();
const {id} = route.params
const post = ref<Post>()
const isLoading = ref(false);
const {userInfo} = useAuthStore();

onMounted(async()=>{
    try{
        isLoading.value = true
            const [error,data,options] = await getPostById(id as string);
            if(!error && data){
                post.value = data.data;
            }
            subscribe(`/topic/post/${post.value?.id}`, (data) => {
                const updatedPost = JSON.parse(data.body);
                console.log(updatedPost)
                post.value = updatedPost;
            })
    }catch(e){
        console.log(e);
    }finally{
        isLoading.value = false;
    }
})

onUnmounted(() => {
  unsubscribe(`/topic/post/${post.value?.id}`);
})

const tagValue = computed(() => {
  switch (post.value?.request_type) {
    case 0: return $t('shopping')
    case 1: return $t('repair')
    case 2: return $t('care')
    case 3: return $t('daily')
    case 4: return $t('other')
    default: return $t('other')
  }
})

async function handleLike() {
  let isSubmitting = true
  try {
    const number = post.value?.id as number;
    await likePost(number);
  } catch (e) {
    console.log(e)
  } finally {
    isSubmitting = false;
  }
}

const isOwnPost = () =>{
    return !(userInfo.uuid == post.value?.user?.uuid)
}

</script>

<style scoped>
.post-right{
    border: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border-radius: 8px;
    width: 300px;
    height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding:32px;
}
.post-details{
    display: flex;
    justify-content: space-between;
}
.wrapper{
    display: flex;
    justify-content: center;
    height: 100%;
}
.image-section{
    display: flex;
}
.post-footer{
    margin: 30px 0;
}
.post-card{
    width:100%;
    border-radius: 20px;
    background: white;
    padding:30px;
}
.post-title{
    font-weight: 800;
    font-size: 40px;
    margin: 0!important;
}
.photos{
    overflow-x: auto;
}
.post-time{
    color:gray
}
.title-section{
    display: flex;
    flex-direction: column;
}
.name-time{
    display: flex;
    gap:20px;
}
.el-carousel {
  text-align: center;   
  width:500px;
}
.content-section{
    font-size:16px;
}
.others{
    margin-top: 88px;
}
</style>