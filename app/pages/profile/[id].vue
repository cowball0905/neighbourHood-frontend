<template>
<NuxtLayout>
    <div class="wrapper">
        <div class="profile">
            <h3>@{{ user?.username }}</h3>
            <p class="avg-number">{{ avg.toFixed(1) }}</p>
            <el-rate disabled v-model="avg" allow-half></el-rate>
            <p class="rating-count">{{ ratings?.length ?? 0 }} ratings</p>
        </div>
        <div class="comments">
            <div v-for="item in ratings" class="rating-card">
                <h3>{{ item.sender.username }}</h3>
                <div class="row">
                    <el-rate disabled v-model="item.marks" allow-half></el-rate>
                    <p v-if="item.post.user?.uuid!=user?.uuid">Requester's comment</p>
                    <p v-else>Helper's comment</p>
                </div> 
                <p>{{ item.comment }}</p>
                <div class="post-preview">
                    <div class="post-preview-header">
                        <span class="post-type">{{ item.post.type === 0 ? 'Request' : 'Offer' }}</span>
                        <span class="post-user">@{{ item.post.user?.username }}</span>
                    </div>
                    <p class="post-title">{{ item.post.title }}</p>
                    <p class="post-content">{{ item.post.content }}</p>
                </div>
            </div>
        </div>
    </div>
</NuxtLayout>
</template>

<script setup lang="ts">
import { getRating } from '~/api/rating';
import { useRoute } from 'vue-router';
import type{ Rating } from '~/types/rating';
import { getUserById } from '~/api/auth';
import type{ ApiUser } from '~/types/common';

const ratings = ref<Rating[]>();
const route = useRoute();
const user = ref<ApiUser>()
const avg = ref(0)

const {id} = route.params

onMounted(async()=>{
    const [error,data,options] = await getUserById(id as string);
    if(!error&&data){
        user.value = data.data
        const [rateError,rateData,options] = await getRating(id as string);
        if(rateData&&!rateError){
            ratings.value = rateData.data
            ratings.value?.forEach((i)=>{
                avg.value = avg.value + i.marks
            })
            avg.value = avg.value / ratings.value?.length
        }
    }
})



</script>

<style scoped>
.profile{
    width:100%
}
.row{
    display: flex;
    align-items: center;
}
.rating-card{
    border: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border-radius: 8px;
    width: 600px;
    background-color: white;
    max-width: 600px;
    line-height: 4px;
    padding: 16px;
}
.post-preview{
    background-color: #f5f5f5;
    border-radius: 6px;
    padding: 10px 14px;
    margin-top: 12px;
    line-height: 1.5;
}
.post-preview-header{
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
}
.wrapper{
    display: flex;
    gap:32px;
    flex-wrap: wrap;
}
.right-wrapper{
    display: flex;
    flex-direction: column;
    align-items: center;
}
.rating-summary{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    padding: 24px 32px;
}
.avg-number{
    font-size: 16px;
    font-weight: 700;
    color: #303133;
    line-height: 1;
    margin: 0;
}
.rating-count{
    font-size: 13px;
    color: #888;
    margin: 0;
}
.post-type{
    background-color: #409eff;
    color: white;
    font-size: 11px;
    padding: 2px 8px;
    border-radius: 4px;
}
.post-user{
    font-size: 12px;
    color: #888;
}
.post-title{
    font-weight: 600;
    font-size: 14px;
    margin: 4px 0;
}
.post-content{
    font-size: 13px;
    color: #494848;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>