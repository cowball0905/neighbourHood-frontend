<template>
<div class="wrapper">
    <div class="msg-time">
        {{ props.time? new Date(props.time).toLocaleString('en'): "null"}}
    </div>
    <div class="msg">
       {{ props.accepterName }} {{ $t('acceptHelp') }}
    </div>
</div>
</template>

<style scoped>
.wrapper{
    display: flex;
    flex-direction: column;
}
.msg{
    width: fit-content;
    border-radius: 20px;
    background: #f0f0f0;
    border: 3px dotted black;
    padding: 8px 16px;
    text-align: right;
    color:black;
    font-size:16px;
    height:50px;
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

const props = defineProps({
    time: Object as PropType<Date>,
    accepterName: Object as PropType<String>,
    isAccepter: Object as PropType<Boolean>,
    recipientId: Object as PropType<String>,
    postID: Object as PropType<number>
})


</script>