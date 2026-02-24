<template>
<div class="wrapper">
    <div class="msg-time">
        {{ props.time? new Date(props.time).toLocaleString('en'): "null"}}
    </div>
    <div class="msg">
       <p>{{ props.requestorName }} {{ $t('willing') }}<br/>
       <span>{{ props.helpTime }}</span></p>
    <div class="msg-footer">
        <el-button text @click="handleRequest()" v-if="isAccepter">Accept</el-button>
    </div>
    </div>
</div>
</template>

<style scoped>
span{
    color: gray;
    font-size: 12px;
}
.wrapper{
    display: flex;
    flex-direction: column;
    align-items: center;
}
.msg{
    width: fit-content;
    border-radius: 20px;
    background: #f0f0f0;
    border: 3px dotted black;
    padding: 8px 16px;
    text-align: center;
    color:black;
    font-size:16px;
    height:112px;
}
.msg-time{
    text-align: right;
    font-size:12px;
    margin-bottom: 4px;
}
.msg-footer{
    color:black;
    display:flex;
    justify-content: center;
}
.el-button{
    color:black;
}
</style>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { sendMessage } from '~/api/message';
import { MessageType } from '~/types/message';

const props = defineProps({
    time: Object as PropType<Date>,
    requestorName: Object as PropType<String>,
    isAccepter: Object as PropType<Boolean>,
    recipientId: Object as PropType<String>,
    postID: Object as PropType<number>,
    helpTime: Object as PropType<string>
})

function handleRequest(){
const payload = {
  recipientUuid: props.recipientId?.toString() || "",
  post: props.postID as number,
  message: "Accepted the Help",
  type: MessageType.ACCEPT
}
sendMessage(payload)
}
</script>