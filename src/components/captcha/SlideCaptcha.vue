<template>
  <div style="position: relative">
    <div
      v-if="type === '2'"
      :style="{ height: parseInt(componentSize.imgHeight) + vSpace + 'px' }"
      class="verify-img-out"
    >
      <div
        :style="{ width: componentSize.imgWidth, height: componentSize.imgHeight }"
        class="verify-img-panel"
      >
        <img
          :src="'data:image/png;base64,' + backgroundImage"
          style="display: block; width: 100%; height: 100%"
        />
        <div v-show="showRefresh" class="verify-refresh" @click="refresh">
          <i class="iconfont icon-refresh"></i>
        </div>
        <transition name="tips">
          <span v-if="tipMessage" :class="isSuccess ? 'suc-bg' : 'err-bg'" class="verify-tips">
            {{ tipMessage }}
          </span>
        </transition>
      </div>
    </div>
    <div
      :style="{
        width: componentSize.imgWidth,
        height: barSize.height,
        lineHeight: barSize.height,
      }"
      class="verify-bar-area"
    >
      <span class="verify-msg" v-text="promptText"></span>
      <div
        :style="{
          width: barWidth !== undefined ? barWidth : barSize.height,
          height: barSize.height,
          borderColor: barBorderColor,
          transition: transitionWidth,
        }"
        class="verify-left-bar"
      >
        <span class="verify-msg" v-text="finishText"></span>
        <div
          :style="{
            width: barSize.height,
            height: barSize.height,
            backgroundColor: blockBgColor,
            left: blockLeft,
            transition: transitionLeft,
          }"
          class="verify-move-block"
          @mousedown="startDrag"
          @touchstart="startDrag"
        >
          <i :class="['verify-icon iconfont', iconClass]" :style="{ color: iconColor }"></i>
          <div
            v-if="type === '2'"
            :style="{
              width: Math.floor((parseInt(componentSize.imgWidth) * 47) / 310) + 'px',
              height: componentSize.imgHeight,
              top: '-' + (parseInt(componentSize.imgHeight) + vSpace) + 'px',
              backgroundSize: componentSize.imgWidth + ' ' + componentSize.imgHeight,
            }"
            class="verify-sub-block"
          >
            <img
              :src="'data:image/png;base64,' + blockImage"
              style="display: block; width: 100%; height: 100%; -webkit-user-drag: none"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  getCurrentInstance,
  nextTick,
  onMounted,
  reactive,
  ref,
  computed,
  watch,
  toRefs,
} from 'vue'
import { aesEncrypt } from '@/libs/cryptojs/aes'
import { resetImgBarSize } from '@/utils/captcha'
import { fetchImageCaptchaUsingGet, checkImageCaptchaUsingGet } from '@/api/auth-controller'
import { useDeviceId } from '@/composables/useDeviceId'

const { deviceId } = useDeviceId() // 获取设备 UUID

// ==================== 类型定义 ====================
interface Size {
  imgHeight: string
  imgWidth: string
  barHeight: string
  barWidth: string
}

// ==================== Props 定义 ====================
interface Props {
  captchaType?: string
  type?: string
  mode?: string
  vSpace?: number
  explain?: string
  imgSize?: { width: string; height: string }
  blockSize?: { width: string; height: string }
  barSize?: { width: string; height: string }
}

const props = withDefaults(defineProps<Props>(), {
  type: '1',
  mode: 'fixed',
  vSpace: 5,
  explain: '',
  imgSize: () => ({ width: '310px', height: '155px' }),
  blockSize: () => ({ width: '50px', height: '50px' }),
  barSize: () => ({ width: '310px', height: '30px' }),
})

const { mode, captchaType, type, blockSize, explain } = toRefs(props)
const { proxy } = getCurrentInstance()! as any

// ==================== 响应式状态 ====================
const secretKey = ref('') // AES 密钥
const token = ref('') // 后端返回的 token
const isSuccess = ref(false) // 是否验证通过
const backgroundImage = ref('') // 背景图片
const blockImage = ref('') // 滑块图片
const startMoveTime = ref(0) // 拖动开始时间
const endMovetime = ref(0) // 拖动结束时间
const tipMessage = ref('') // 提示消息
const promptText = ref('') // 默认提示文本
const finishText = ref('') // 完成后的文本
const componentSize = reactive<Size>({
  imgHeight: '0',
  imgWidth: '0',
  barHeight: '0',
  barWidth: '0',
})
const blockLeft = ref<string | undefined>(undefined) // 滑块 left 值
const barWidth = ref<string | undefined>(undefined) // 进度条宽度
const blockBgColor = ref<string | undefined>(undefined) // 滑块背景色
const barBorderColor = ref('#ddd') // 进度条边框色
const iconColor = ref<string | undefined>(undefined) // 图标颜色
const iconClass = ref('icon-right') // 图标类名
const isDragging = ref(false) // 是否正在拖动
const isCompleted = ref(false) // 是否已完成验证
const showRefresh = ref(true) // 是否显示刷新按钮
const transitionLeft = ref('') // 滑块左移过渡样式
const transitionWidth = ref('') // 进度条宽度过渡样式
const startX = ref(0) // 鼠标按下时的起始偏移

// 获取滑块条 DOM 元素
const barArea = computed(() => {
  return proxy.$el.querySelector('.verify-bar-area') as HTMLElement
})

// ==================== 请求函数 ====================
/** 获取验证码图片和滑块图 */
const fetchCaptchaImage = async () => {
  const res = await fetchImageCaptchaUsingGet({
    captchaType: captchaType.value,
    clientUid: deviceId.value,
    ts: Date.now(), // 现在的时间戳
  })
  if (res.data.repCode === '0000') {
    backgroundImage.value = res.data.repData.originalImageBase64
    blockImage.value = res.data.repData.jigsawImageBase64
    token.value = res.data.repData.token
    secretKey.value = res.data.repData.secretKey
  } else {
    tipMessage.value = res.data.repMsg
  }
}

// ==================== 拖动事件 ====================
/** 开始拖动 */
const startDrag = (e: MouseEvent | TouchEvent) => {
  let clientX: number
  if (!(e as TouchEvent).touches) {
    clientX = (e as MouseEvent).clientX
  } else {
    clientX = (e as TouchEvent).touches[0]?.pageX as number
  }
  startX.value = Math.floor(clientX - barArea.value.getBoundingClientRect().left)
  startMoveTime.value = +new Date()

  if (!isCompleted.value) {
    promptText.value = ''
    blockBgColor.value = '#337ab7'
    barBorderColor.value = '#337AB7'
    iconColor.value = '#fff'
    e.stopPropagation()
    isDragging.value = true
  }
}

/** 拖动中 */
const onDrag = (e: MouseEvent | TouchEvent) => {
  if (isDragging.value && !isCompleted.value) {
    let clientX: number
    if (!(e as TouchEvent).touches) {
      clientX = (e as MouseEvent).clientX
    } else {
      clientX = (e as TouchEvent).touches[0]?.pageX as number
    }
    const barLeft = barArea.value.getBoundingClientRect().left
    let moveX = clientX - barLeft
    const maxMove = barArea.value.offsetWidth - parseInt(blockSize.value.width) / 2 - 2
    const minMove = parseInt(blockSize.value.width) / 2

    if (moveX >= maxMove) moveX = maxMove
    if (moveX <= 0) moveX = minMove

    blockLeft.value = moveX - startX.value + 'px'
    barWidth.value = moveX - startX.value + 'px'
  }
}

/** 结束拖动，提交后端验证 */
const stopDrag = async () => {
  endMovetime.value = +new Date()
  if (isDragging.value && !isCompleted.value) {
    // 计算滑块移动距离（按标准 310px 宽度转换）
    let moveDistance = parseInt((blockLeft.value || '0').replace('px', ''))
    moveDistance = (moveDistance * 310) / parseInt(componentSize.imgWidth)

    if (!token.value || !secretKey.value) {
      return
    }

    const params = {
      captchaType: captchaType.value,
      pointJson: aesEncrypt(JSON.stringify({ x: moveDistance, y: 5.0 }), secretKey.value),
      token: token.value,
    }

    try {
      const res = await checkImageCaptchaUsingGet(params)
      if (res.data.repCode === '0000') {
        // 验证成功
        blockBgColor.value = '#5cb85c'
        barBorderColor.value = '#5cb85c'
        iconColor.value = '#fff'
        iconClass.value = 'icon-check'
        showRefresh.value = false
        isCompleted.value = true
        isSuccess.value = true

        if (mode.value === 'pop') {
          setTimeout(() => {
            ;(proxy.$parent as any).clickShow.value = false
            refresh()
          }, 1500)
        }

        const duration = ((endMovetime.value - startMoveTime.value) / 1000).toFixed(2)
        tipMessage.value = `${duration}s 验证成功`

        const captchaVerification = aesEncrypt(
          token.value + '---' + JSON.stringify({ x: moveDistance, y: 5.0 }),
          secretKey.value,
        )

        setTimeout(() => {
          tipMessage.value = ''
          ;(proxy.$parent as any).closeBox()
          proxy.$parent?.$emit('success', { captchaVerification })
        }, 1000)
      } else {
        // 验证失败
        blockBgColor.value = '#d9534f'
        barBorderColor.value = '#d9534f'
        iconColor.value = '#fff'
        iconClass.value = 'icon-close'
        isSuccess.value = false
        setTimeout(() => refresh(), 1000)
        proxy.$parent?.$emit('error', proxy)
        tipMessage.value = res.data.repMsg || '验证失败'
        setTimeout(() => (tipMessage.value = ''), 1000)
      }
    } catch (error) {
      console.error('验证请求失败', error)
    }
    isDragging.value = false
  }
}

/** 刷新验证码 */
const refresh = async () => {
  showRefresh.value = true
  finishText.value = ''
  transitionLeft.value = 'left .3s'
  blockLeft.value = '0'
  barWidth.value = undefined
  transitionWidth.value = 'width .3s'
  barBorderColor.value = '#ddd'
  blockBgColor.value = '#fff'
  iconColor.value = '#000'
  iconClass.value = 'icon-right'
  isCompleted.value = false

  await fetchCaptchaImage()
  setTimeout(() => {
    transitionWidth.value = ''
    transitionLeft.value = ''
    promptText.value = explain.value || '向右滑动完成验证'
  }, 300)
}

/** 初始化组件 */
const init = () => {
  promptText.value = explain.value || '向右滑动完成验证'
  fetchCaptchaImage()
  nextTick(() => {
    const { imgHeight, imgWidth, barHeight, barWidth } = resetImgBarSize(proxy)
    componentSize.imgHeight = imgHeight
    componentSize.imgWidth = imgWidth
    componentSize.barHeight = barHeight
    componentSize.barWidth = barWidth
    proxy.$parent?.$emit('ready', proxy)
  })

  // 移除旧监听，避免重复绑定
  window.removeEventListener('touchmove', onDrag)
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('touchend', stopDrag)
  window.removeEventListener('mouseup', stopDrag)

  // 添加新监听
  window.addEventListener('touchmove', onDrag)
  window.addEventListener('mousemove', onDrag)
  window.addEventListener('touchend', stopDrag)
  window.addEventListener('mouseup', stopDrag)
}

watch(
  () => props.type,
  () => init(),
)

onMounted(() => {
  init()
  proxy.$el.onselectstart = () => false
})

defineExpose({ refresh })
</script>
