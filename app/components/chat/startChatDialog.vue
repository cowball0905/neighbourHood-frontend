<template>
  <el-dropdown trigger="click" :hide-on-click="false">
    <span class="el-dropdown-link">
      <slot></slot>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <div class="droparea">
          <el-input
            v-model="inputValue"
            placeholder="Type and start the chat"
          ></el-input>
          <el-button type="info" :icon="Message" @click="handleSubmit()" circle/>
        </div>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
import { Message } from "@element-plus/icons-vue"
import { MessageType } from "~/types/message";
import { sendMessage } from "~/api/message";

const router = useRouter();

const props = defineProps({
    postAuthorUuid: Object as PropType<string>,
    postID: Object as PropType<number>
})

const inputValue = ref("")

async function handleSubmit(){
const payload = {
  recipientUuid: props.postAuthorUuid as string,
  post: props.postID as number,
  message: inputValue.value,
  type: MessageType.NORMAL
}

const [error,data,options] = await sendMessage(payload);
if(!error){
  router.push(`/chat`)
}
}
</script>

<style scoped>
.droparea{
    padding:20px;
    display: flex;
    gap:12px;
}
</style>