<template>
<div class="wrapper">
    <div class="other-msg-time">
        {{ props.time? new Date(props.time).toLocaleString('en'): "null"}}
    </div>
    <div class="other-msg">
       {{ props.content }}
    </div>
</div>
</template>

<style scoped>
.wrapper{
    display: flex;
    flex-direction: column;
}
.other-msg{
    max-width: 300px;
    border-radius: 20px;
    background: rgb(233, 233, 233);
    padding: 8px 16px;
    text-align: left;
    color:rgb(0, 0, 0);
    font-size:16px;
}
.other-msg-time{
    text-align: left;
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