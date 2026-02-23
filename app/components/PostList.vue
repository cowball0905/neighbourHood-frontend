<template>
        <div class="posts-list" >
            <PostCard v-if="!isLoading" v-for="post in posts" :key="post?.id" :post="post" 
                :user="user"
            />
            <PostCardSkeleton v-for="n in skeLength" v-else></PostCardSkeleton>
        </div>
        <StartChatDialog/>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { getPost } from '~/api/post';
import type { Post } from '~/types/post';
import startChatDialog from './chat/startChatDialog.vue';
import StartChatDialog from './chat/startChatDialog.vue';

const {user} = useUser()
const isLoading = ref(false)
const posts = ref<Post[]>();

const props = defineProps({
    currentPost:  Object as PropType<Post>,
    limit: {
        type: Object as PropType<number>,
        default: Infinity
    }
})

const skeLength = computed(()=>{
    return props.limit===Infinity? 6 : props.limit;
})

onMounted(async()=>{
  try{
    isLoading.value = true;
    const [error,data,options] = await getPost();
    if(!error&&data){
        posts.value = data.data.filter(p => p.id != props.currentPost?.id && p.acceptUser?.uuid==null).splice(0,props.limit);
    }
  }catch(e){
    console.log(e);
  }finally{
    isLoading.value = false;
  }
})

</script>

<style scoped>
.posts-list {
  display: flex;
  flex-wrap:wrap;
  width:auto;
  gap: 60px;
}
</style>