<template>
<div class="wrapper">
    <div class="me-msg-time">
        {{ props.time? new Date(props.time).toLocaleString('en'): "null"}}
    </div>
    <div class="me-msg">
       {{ props.content?.toString() }}
    </div>
</div>
</template>

<style scoped>
.wrapper{
    display: flex;
    flex-direction: column;
}
.me-msg{
    width: fit-content;
    border-radius: 20px;
    background: rgb(84, 84, 255);
    padding: 8px 16px;
    text-align: right;
    color:white;
    font-size:16px;
}
.me-msg-time{
    text-align: right;
    font-size:12px;
    margin-bottom: 4px;
}
</style>

<script lang="ts" setup>
const props = defineProps({
    content: Object as PropType<string>,
    time: Object as PropType<Date>
})
</script>