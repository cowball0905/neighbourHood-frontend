<template>
  <NuxtLayout name="default">
    <div class="create-post-container">
      <el-card class="create-post-card">
        <template #header>
          <div class="card-header">
            <h2>{{ $t('createNewPostTitle') }}</h2>
          </div>
        </template>

        <el-form ref="postFormRef" :model="postForm" :rules="postRules" label-position="top" class="post-form">
          <el-form-item :label="$t('timeSelect')" prop="time">
            <el-date-picker v-model="postForm.time" is-range :range-separator="$t('To')"
              :start-placeholder="t('startTime')" type="datetimerange" :end-placeholder="t('endTime')"
              value-format="YYYY-MM-DD HH:mm:ss" :disabled-date="disabledDate" date-format="YYYY/MM/DD" time-format="A hh:mm" format="YYYY/MM/DD HH:mm"/>
          </el-form-item>

          <el-form-item :label="$t('title')" prop="title">
            <el-input v-model="postForm.title" :placeholder="$t('enterTitle')" maxlength="100" show-word-limit
              size="large" />
          </el-form-item>

          <el-form-item :label="$t('category')" prop="request_type">
            <el-select v-model="postForm.request_type" placeholder="Select" size="large" style="width: 240px">
              <el-option :label="$t('shopping')" :value="0" />
              <el-option :label="$t('repair')" :value="1" />
              <el-option :label="$t('care')" :value="2" />
              <el-option :label="$t('daily')" :value="3" />
              <el-option :label="$t('other')" :value="4" />
            </el-select>
          </el-form-item>


          <el-form-item :label="$t('content')" prop="content">
            <el-input v-model="postForm.content" type="textarea" :placeholder="$t('shareThoughts')"
              :autosize="{ minRows: 4, maxRows: 4 }" maxlength="2000" :show-word-limit="false" :resize="'none'" />
          </el-form-item>

          <el-form-item :label="$t('imagesOptional')">
            <el-upload v-model:file-list="fileList" list-type="picture-card" :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove" :limit="5" accept="image/*">
              <el-icon>
                <Plus />
              </el-icon>
            </el-upload>
          </el-form-item>

          <el-form-item>
            <div class="form-actions">
              <el-button size="large" @click="handleCancel">
                {{ $t('cancel') }}
              </el-button>
              <el-button type="primary" size="large" :loading="submitting" @click="handleSubmit">
                {{ $t('publishPost') }}
              </el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <el-dialog v-model="dialogVisible">
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage, type FormInstance, type FormRules, type UploadFile, type UploadProps, type UploadUserFile } from 'element-plus'
import {
  Plus
} from '@element-plus/icons-vue'
import type { Post, PostRequest } from '~/types/post'
import { publishPost } from '~/api/post'

const router = useRouter()
const { t } = useI18n()
const submitting = ref(false)
const postFormRef = ref<FormInstance>()
const dialogVisible = ref(false)
const dialogImageUrl = ref('')
const fileList = ref<UploadFile[]>([])
const time = ref<[Date, Date]>([
  new Date(),
  new Date(),
])

const postForm = reactive({
  title: '',
  content: '',
  request_type: 0,
  paymentMethod: 0,
  is_important: false,
  redeemPoints: 0,
  type: 0,
  time: null as [string, string] | null,
})



const postRules = reactive<FormRules>({
  title: [
    {
      required: true,
      message: t('pleaseEnterTitle'),
      trigger: 'blur'
    },
    {
      min: 3,
      max: 100,
      message: t('titleLength'),
      trigger: 'blur'
    }
  ],
  request_type: [
    {
      required: true,
      message: t('pleaseSelectCategory'),
      trigger: 'change'
    }
  ],
  time: [
    {
      required: true,
      message: t('enterContent'),
      trigger: 'change'
    }
  ],
  content: [
    {
      required: true,
      message: t('enterContent'),
      trigger: 'blur'
    },
    {
      min: 10,
      max: 2000,
      message: t('contentLength'),
      trigger: 'blur'
    }
  ]
})

const disabledDate = (time: { getTime: () => number }) => {
  const now = new Date();
  return time.getTime() < new Date(new Date().setHours(0, 0, 0, 0)).getTime();
};


const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}

const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
  console.log('File removed:', file)
}

const handleSubmit = async () => {
  if (!postFormRef.value) return

  await postFormRef.value.validate((valid) => {
    if (valid) {
      createPost()
    } else {
      ElMessage.warning(t('fillRequired'))
    }
  })
}

const createPost = async () => {
  submitting.value = true

  try {
    const formData = new FormData();
    formData.append("title", postForm.title);
    formData.append("type", postForm.type.toString());
    formData.append("content", postForm.content);
    formData.append("request_type", postForm.request_type.toString());
    formData.append("is_important", postForm.is_important.toString());
    formData.append("redeemPoints", (postForm.redeemPoints ?? 0).toString());
    if (postForm.time && postForm.time[0]) {
      formData.append("startTime", postForm.time[0]);
      if (postForm.time[1]) {
        formData.append("endTime", postForm.time[1]);
      }
    }

    formData.append("payment_method", (postForm.paymentMethod ? postForm.paymentMethod.toString() : "0"));

    fileList.value.forEach((f) => {
      if (f.raw) {
        formData.append("files", f.raw);
      }
    })

    await publishPost(formData);

    ElMessage.success(t('postSuccess'))

    // Redirect to posts page
    router.push('/posts')
  } catch (error) {
    console.error('Error creating post:', error)
    ElMessage.error(t('postFailed'))
  } finally {
    submitting.value = false
  }
}

const handleCancel = () => {
  router.back()
}
</script>

<style scoped>
.create-post-container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.create-post-card {
  border: none;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-header h2 {
  margin: 0;
  color: #333;
  font-size: 32px;
  font-weight: 600;
}

.post-form {
  padding: 20px 0;
}

.post-form :deep(.el-form-item__label) {
  font-weight: 600;
  color: #333;
  font-size: 19px;
}

.post-form :deep(.el-textarea__inner) {
  font-family: inherit;
  font-size: 18px;
  line-height: 1.6;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

:deep(.el-upload--picture-card) {
  width: 120px;
  height: 120px;
  border-radius: 8px;
}

:deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 120px;
  height: 120px;
  border-radius: 8px;
}

:deep(.el-select .el-icon) {
  vertical-align: middle;
}

.tag-hint {
  margin-top: 8px;
  font-size: 16px;
  color: #999;
}

@media (max-width: 768px) {
  .create-post-container {
    padding: 10px;
  }

  .card-header h2 {
    font-size: 26px;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .form-actions .el-button {
    width: 100%;
  }
}
</style>
