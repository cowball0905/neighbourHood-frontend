<template>
  <NuxtLayout>
    <div class="wrapper">
      <div class="conversation-list">
        <div v-for="(item, index) in conversations || []" :style="[index === 0 ? firstStyle : null]">
          <div class="conversation" v-if="item.messages?.length > 0" @click="handleSelect(item)"
            :style="[item.id === chatroom?.id ? selectedStyle : null, index === 0 ? firstStyle : null]">
            <p>{{ item.user2.username }}</p>
            <h3>{{ item.post.title }}</h3>
            <p>{{ item.messages[item.messages.length - 1]?.content }}</p>
          </div>
        </div>
      </div>
      <div class="chatroom">
        <div class="chatroom-header" v-if="chatroom">
          <div class="chatroom-title">
            <h3>{{ chatroom.post.title }}</h3>
            <p>{{ chatroom.user2.username }}</p>
          </div>
          <div class="chatroom-accept-button">
            <div v-if="userInfo.uuid === chatroom.user1.uuid && !chatroom.post.acceptUser?.uuid">
              <el-button text @click="toggleDialog">{{ $t('sendHelp') }}</el-button>
              <PickTimeDialog :dialog-visible="dialogVisible" :post-i-d="chatroom.post.id" :recipient-uuid="recipientId" :default-time="[chatroom.post.startTime ?? new Date(), chatroom.post.endTime ?? new Date()]" @toggle-dialog="toggleDialog"/>
            </div>
            <div v-else-if="userInfo.uuid == chatroom.post.acceptUser?.uuid || userInfo.uuid == chatroom.user2.uuid">
              <el-button text @click="toggleDialog">Test</el-button>
              <PutRatingDialog :dialog-visible="dialogVisible" :post-i-d="chatroom.post.id" :sender-i-d="userInfo.uuid" :recipient-i-d="recipientId" @toggle-dialog="toggleDialog"/>
            </div>
            <p v-else-if="userInfo.uuid === chatroom.user1.uuid && chatroom.post.acceptUser?.uuid !== userInfo.uuid">The
              request
              is held by others</p>
          </div>
        </div>
        <ul>
          <li
            v-for="msg in (chatroom?.messages?.sort((a, b) => new Date(a.sendTime).getTime() - new Date(b.sendTime).getTime()) ?? [])">
            <RequestMsg class="own" v-if="msg.type === MessageType.REQUEST && userInfo.uuid === msg.sender.uuid"
              :time="msg.sendTime" :is-accepter="false" :requestor-name="chatroom?.user1.username" :help-time="msg.content"
              :recipient-id="chatroom?.user1.uuid" :post-i-d="chatroom?.post.id" />
            <RequestMsg class="notown" v-else-if="msg.type === MessageType.REQUEST && userInfo.uuid !== msg.sender.uuid"
              :time="msg.sendTime" :is-accepter="true" :requestor-name="chatroom?.user1.username" :help-time="msg.content"
              :recipient-id="chatroom?.user1.uuid" :post-i-d="chatroom?.post.id" />
            <AcceptMsg class="own" v-if="msg.type === MessageType.ACCEPT && userInfo.uuid === msg.sender.uuid"
              :time="msg.sendTime" :is-accepter="false" :accepter-name="chatroom?.user2.username"
              :recipient-id="chatroom?.user1.uuid" />
            <AcceptMsg class="notown" v-else-if="msg.type === MessageType.ACCEPT && userInfo.uuid !== msg.sender.uuid"
              :time="msg.sendTime" :is-accepter="true" :accepter-name="chatroom?.user2.username"
              :recipient-id="chatroom?.user1.uuid" />
            <MeMsg class="own" v-else-if="msg.type === MessageType.NORMAL && userInfo.uuid === msg.sender.uuid"
              :time="msg.sendTime" :content="msg.content" />
            <OtherMsg class="notown" v-else-if="msg.type === MessageType.NORMAL" :time="msg.sendTime"
              :content="msg.content" />
          </li>
        </ul>
        <div class="input-area" v-if="chatroom">
          <el-input v-model="inputValue" placeholder="Type a message..." />
          <el-button type="primary" @click="handleSubmit()">{{ $t('send') }}</el-button>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import { getAllConversations, sendMessage } from '~/api/message';
import { MessageType, type Conversation, type Message } from '~/types/message';
import { useUser } from '../composables/user';
import MeMsg from '~/components/chat/meMsg.vue';
import OtherMsg from '~/components/chat/otherMsg.vue';
import { useSocket } from '../composables/socket';
import RequestMsg from '~/components/chat/requestMsg.vue';
import AcceptMsg from '~/components/chat/acceptMsg.vue';
import PickTimeDialog from '~/components/chat/pickTimeDialog.vue';
import PutRatingDialog from '~/components/chat/putRatingDialog.vue';
import { useAuthStore } from '../stores/useAuthStore';

const conversations = ref<Conversation[]>()
const chatroom = ref<Conversation>()
const inputValue = ref("")
const selectedStyle = {
  background: '#f0f0f0'
};
const firstStyle = {
  borderRadius: '20px 0 0 0'
};
const { subscribe, unsubscribe } = useSocket();

const dialogVisible = ref(false)

const {userInfo} = useAuthStore();

function toggleDialog(){
  dialogVisible.value = !dialogVisible.value;
}

onMounted(async () => {
  const [error, data, options] = await getAllConversations();
  if (!error && data) {
    conversations.value = data.data;
  }
  conversations.value?.forEach((item) => {
    subscribe(`/topic/msg/${item.id.toString()}`, (data) => {
      const updatedConversation = JSON.parse(data.body);
      console.log('WebSocket received:', updatedConversation); // Debug log
      const index = conversations.value?.findIndex(obj => obj.id === updatedConversation.id);
      if (index != null && index >= 0 && conversations.value) {
        conversations.value[index] = updatedConversation;
        if (chatroom.value?.id == updatedConversation.id) {
          chatroom.value = updatedConversation;
          console.log('Updated chatroom acceptUser:', chatroom.value?.post.acceptUser); // Debug log
        }
      } else {
        conversations.value?.push(updatedConversation);
      }
    })
  })
})


function handleSelect(conversation: Conversation) {
  chatroom.value = conversation;
}

onUnmounted(() => {
  conversations.value?.forEach((item) => {
    unsubscribe(`/topic/msg/${item.id.toString()}`);
  })
})

function handleSubmit() {
  const payload = {
    recipientUuid: recipientId.value?.toString() ?? "",
    post: chatroom.value?.post.id as number,
    message: inputValue.value,
    type: MessageType.NORMAL
  }
  sendMessage(payload);
  inputValue.value = ""
}

const recipientId = computed(() => {
  return userInfo?.uuid === chatroom.value?.user1.uuid ? chatroom.value?.user2.uuid : chatroom.value?.user1.uuid
})


</script>

<style scoped>
.conversation:first-child {
  border-radius: 20px 0 0 0;
}

.chatroom-header {
  padding: 0 30px;
  ;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.wrapper {
  border-radius: 20px;
  background: white;
  height: 100%;
  display: flex;
}

.conversation-list {
  border-right: 1px solid #f0f0f0;
  width: 20%;
  height: 100%;
  display: flex;
  flex-direction: column;
  ;
  flex-wrap: wrap;
}

.conversation {
  padding-left: 12px;
  padding-top: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.select-button {
  height: 300px;
  border-bottom: #f0f0f0 1px solid;
}

.chatroom {
  width: 80%;
  display: flex;
  flex-direction: column;
  max-height: 800px;
}

ul {
  list-style-type: none;
  list-style: none;
  overflow-y: auto;
  height: 80%;
  padding: 20px !important;
  margin: 0;
}

li {
  margin: 8px 0;
  display: flex;
  width: 100%;
  height: fit-content;
}

.own {
  margin-left: auto;
  align-items: flex-end;
}

.notown {
  margin-right: auto;
  align-items: flex-start;
}

.input-area {
  display: flex;
  gap: 10px;
  padding: 15px 15px;
  border-top: 1px solid #ddd;
  background: white;
}
</style>