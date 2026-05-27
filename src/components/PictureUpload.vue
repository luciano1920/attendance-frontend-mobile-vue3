<!--
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-04
 * @LastEditors  : 罗钧 71233895@chinatelecom.cn
 * @LastEditTime : 2026-05
 * @FilePath     : /attendance-frontend-mobile/src/components/PictureUpload.vue
 * @Description  : 移动端图片上传组件（二次封装）
-->
<template>
  <div class="picture-upload">
    <t-upload
      v-model="files"
      :action="actionUrl"
      :headers="uploadHeaders"
      :max="maxCount"
      :size-limit="{ size: 8, unit: 'MB', message: '图片大小不能超过 {sizeLimit} MB' }"
      :accept="acceptFileType"
      multiple
      allow-upload-duplicate-file
      :before-upload="beforeUpload"
      :on-one-file-fail="handleFailUpload"
      :on-success="handleSuccessUpload"
      :on-remove="handleRemove"
      :on-validate="handleValidate"
      :format-response="handleFormatResponse"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Message,
  type FormatResponseContext,
  type SuccessContext,
  type UploadFile,
  type UploadRemoveContext,
  type UploadValidateType,
} from 'tdesign-mobile-vue'

import { useUserStore } from '@/stores/user-store'
import { getAccessTokenUtil } from '@/utils/auth'

const userStore = useUserStore()

interface Props {
  // 允许上传的最大图片数量
  maxCount?: number
  // 上传成功的回调函数
  successUpload?: (fileList: any) => void
  // 移除上传的图片的回调函数
  removeUpload?: (fileList: any) => void
}

const props = withDefaults(defineProps<Props>(), {
  maxCount: 3,
})

// 允许上传的文件类型，图片上传组件默认为 JPEG、PNG、JPG 三种格式，如果需要上传其他格式，后续可以修改为 Props
const acceptFileType = ref<string>('image/jpeg,image/png,image/jpg')
// 上传接口地址
const actionUrl = import.meta.env.VITE_API_BASE_URL + '/admin-api/infra/file/upload'
// 上传的请求头
const uploadHeaders = computed(() => {
  const accessToken = userStore.loginUser.accessToken ?? getAccessTokenUtil()
  return {
    Authorization: accessToken ?? '',
  }
})

// 上传的文件列表
const files = ref<UploadFile[]>([])

/**
 * 上传前的校验
 * @param file 上传的文件
 */
const beforeUpload = (file: UploadFile) => {
  const acceptTypeList = acceptFileType.value.split(',')

  if (!acceptTypeList.includes(file.raw?.type || '')) {
    return false
  }
}

/**
 * 上传文件校验
 * @param context 校验的上下文
 */
const handleValidate = (context: { type: UploadValidateType; files: UploadFile[] }) => {
  if (context.type === 'FILE_OVER_SIZE_LIMIT') {
    Message.error({
      content: context.files[0]?.response?.error,
      offset: [10, 16],
    })
  }

  if (context.type === 'FILES_OVER_LENGTH_LIMIT') {
    Message.error({
      content: `最多上传 ${props.maxCount} 张图片`,
      offset: [10, 16],
    })
  }

  if (context.type === 'CUSTOM_BEFORE_UPLOAD') {
    Message.error({ content: '上传文件类型错误，请上传图片', offset: [10, 16] })
  }
}

/**
 * 格式化上传后的响应值
 * @param response 上传后的响应值
 * @param context 格式化响应的上下文
 */
const handleFormatResponse = (response: any, context: FormatResponseContext) => {
  // 如果是上传成功，则返回上传后的文件地址，否则返回错误信息
  if (response.code === 0) {
    return {
      ...response,
      url: response.data,
    }
  } else {
    return {
      ...response,
      error: response.msg,
    }
  }
}

/**
 * 上传成功的回调函数
 * @param successContext 上传成功的上下文
 */
const handleSuccessUpload = (successContext: SuccessContext) => {
  if (successContext.response[0].code === 0) {
    Message.success({ content: '上传成功', offset: [10, 16] })
  }
  // 把上传的最新文件列表回调给父组件，也可以直接采用 files.value，因为 files.value 已经被同步修改了
  props.successUpload?.(successContext.fileList)
}

/**
 * 上传失败的回调
 * @param file 上传失败的文件
 */
const handleFailUpload = (file: UploadFile) => {
  if (file.response?.code !== 0) {
    Message.error({
      content: '上传失败，' + file.response?.msg,
      offset: [10, 16],
    })
  }
}

/**
 * 移除上传的文件
 * @param removeContext 移除文件的上下文
 */
const handleRemove = (removeContext: UploadRemoveContext) => {
  if (removeContext.file) {
    Message.success({ content: '移除文件成功', offset: [10, 16] })
  }
  // 移除文件组件会自行同步修改本地的 files，直接回调给父组件即可
  props.removeUpload?.(files.value)
}
</script>

<style scoped lang="scss">
.picture-upload {
  --td-upload-grid-columns: 3;
}
</style>
