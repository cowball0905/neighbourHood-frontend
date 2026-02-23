<template>
    <NuxtLayout>
        <div class="wrapper">
            <div class="container" v-for="item in notifications" :key="item.id">
                <div class="each-like">
                    <div class="noti-type">
                        <el-tag>{{ item.type }}</el-tag>
                    </div>
                    <div class="noti-msg">
                        <h3>{{ item.sender.username }} sends u a like!</h3>
                        <p>{{ item }}</p>
                    </div>
                    <div class="noti-sender">
                        <h4>{{ item.sender.username }}</h4>
                    </div>
                </div>
            </div>
        </div>
    </NuxtLayout>
</template>

<script lang="ts" setup>
import { getNotifications } from '~/api/notification';
import type { Notification } from '~/types/common';
import { useI18n } from 'vue-i18n';

const notifications = ref<Notification[]>()
const {t} = useI18n();

onMounted(async()=>{
    const [error,data,options] = await getNotifications();
    if(!error&&data){
        notifications.value = data.data;
    }
})
</script>

<style scoped>
.wrapper{
    width:100%;
}
.container{
    border-radius: 20px;
    background: white;;
    padding:24px;
}
h4{
    color:red;
}
</style>