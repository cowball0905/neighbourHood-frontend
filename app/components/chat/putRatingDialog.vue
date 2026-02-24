<template>
    <el-dialog v-model="props.dialogVisible" :title="$t('giveRating')" width="500">
        <el-form :model="form">
            <el-form-item :label="$t('ratingMarks')" :label-width="100">
                <el-rate v-model="form.marks" allow-half />
            </el-form-item>
            <el-form-item :label="$t('ratingComment')" :label-width="100" props="content">
                <el-input v-model="form.comment" type="textarea" :placeholder="$t('shareThoughts')"
                :autosize="{ minRows: 4, maxRows: 4 }" maxlength="2000" :show-word-limit="false" :resize="'none'" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="emit('toggleDialog')">{{ $t('cancel') }}</el-button>
                <el-button type="primary" @click="handleSubmit()">
                {{ $t('submit') }}
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { createRating } from "~/api/rating";
import type { createRatingRequest } from "~/types/rating";
import type { PropType } from "vue";
import type { FormRules } from "element-plus";

const router = useRouter();

const props = defineProps({
    senderID: Object as PropType<string>,
    recipientID: Object as PropType<string>,
    postID: Object as PropType<number>,
    dialogVisible: Object as PropType<boolean>
})

const emit = defineEmits(['toggleDialog'])

const form = reactive({
    marks: 0,
    comment: ""
})

const postRules = reactive<FormRules>({
    content:
    [
    {
      min: 10,
      max: 100,
      message: $t('contentLength'),
      trigger: 'blur'
    }
  ]
})

async function handleSubmit(){
const payload: createRatingRequest = {
    senderUUID: props.senderID || "",
    recipientUUID: props.recipientID || "",
    postID: props.postID || 0,
    marks: form.marks,
    comment: form.comment
}

const [error,data,options] = await createRating(payload);
if(!error){
  emit("toggleDialog")
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