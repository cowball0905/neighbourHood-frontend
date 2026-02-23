<template>
    <el-dialog v-model="props.dialogVisible" :title="$t('meetingTime')" width="500">
        <el-form :model="form">
        <el-form-item :label="$t('timeSelect')" :label-width="formLabelWidth">
             <el-date-picker v-model="form.time" is-range :range-separator="$t('To')"
              :start-placeholder="t('startTime')" type="datetimerange" :end-placeholder="t('endTime')"
              value-format="YYYY-MM-DD HH:mm" :disabled-date="disabledDate" date-format="YYYY/MM/DD" time-format="A hh:mm" format="YYYY/MM/DD HH:mm" :default-time="defaultTime"/>
        </el-form-item>
        </el-form>
        <template #footer>
        <div class="dialog-footer">
            <el-button @click="emit('toggleDialog')">{{ $t('cancel') }}</el-button>
            <el-button type="primary" @click="handleHelp()">
            {{ $t('confirm') }}
            </el-button>
        </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { sendMessage } from '~/api/message'
import { MessageType } from '~/types/message'
import { useI18n } from 'vue-i18n'

const formLabelWidth = '140px'
const {t} = useI18n();

const props = defineProps({
    recipientUuid: Object as PropType<string>,
    postID: Object as PropType<number>,
    dialogVisible: Object as PropType<boolean>,
    defaultTime: Object as PropType<[Date,Date]>
})

const emit = defineEmits(['toggleDialog'])

const disabledDate = (time: { getTime: () => number }) => {
  const now = new Date();
  return time.getTime() < new Date(new Date().setHours(0, 0, 0, 0)).getTime();
};

const form = reactive({
    time: props.defaultTime
})

function handleHelp() {
  const payload = {
    recipientUuid: props.recipientUuid?.toString() || "",
    post: props.postID as number,
    message: `${new Date(form.time?.[0] ?? Date.now()).toLocaleString('en')} ${$t('to')} ${new Date(form.time?.[1] ?? Date.now()).toLocaleString('en')}`,
    type: MessageType.REQUEST
  }
  sendMessage(payload)
  emit('toggleDialog');
}

</script>