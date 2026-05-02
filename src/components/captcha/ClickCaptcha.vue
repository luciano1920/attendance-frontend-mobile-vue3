<template>
  <div style="position: relative">
    <div class="verify-img-out">
      <div
        :style="{
          width: componentSize.imgWidth,
          height: componentSize.imgHeight,
          backgroundSize: componentSize.imgWidth + ' ' + componentSize.imgHeight,
          marginBottom: vSpace + 'px',
        }"
        class="verify-img-panel"
      >
        <div v-show="showRefresh" class="verify-refresh" style="z-index: 3" @click="refresh">
          <i class="iconfont icon-refresh"></i>
        </div>
        <img
          ref="canvas"
          :src="'data:image/png;base64,' + backgroundImage"
          style="display: block; width: 100%; height: 100%"
          @click="isClickable ? onCanvasClick($event) : undefined"
        />

        <div
          v-for="(point, idx) in displayPoints"
          :key="idx"
          :style="{
            backgroundColor: '#1abd6c',
            color: '#fff',
            zIndex: 9999,
            width: '20px',
            height: '20px',
            textAlign: 'center',
            lineHeight: '20px',
            borderRadius: '50%',
            position: 'absolute',
            top: point.y - 10 + 'px',
            left: point.x - 10 + 'px',
          }"
          class="point-area"
        >
          {{ idx + 1 }}
        </div>
      </div>
    </div>
    <div
      :style="{
        width: componentSize.imgWidth,
        color: barAreaColor,
        borderColor: barAreaBorderColor,
        lineHeight: barSize.height,
      }"
      class="verify-bar-area"
    >
      <span class="verify-msg">{{ promptText }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance, nextTick, onMounted, reactive, ref, toRefs } from 'vue'
import { aesEncrypt } from '@/libs/cryptojs/aes'
import { resetImgBarSize } from '@/utils/captcha'
import { fetchImageCaptchaUsingGet, checkImageCaptchaUsingGet } from '@/api/auth-controller'
import { useDeviceId } from '@/composables/useDeviceId'

const { deviceId } = useDeviceId() // 获取设备 UUID

// ==================== 类型定义 ====================
interface Point {
  x: number
  y: number
}

interface Size {
  imgWidth: string
  imgHeight: string
  barHeight: string
  barWidth: string
}

// ==================== Props 定义 ====================
interface Props {
  captchaType?: string
  mode?: string
  vSpace?: number
  imgSize?: { width: string; height: string }
  barSize?: { width: string; height: string }
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'fixed',
  vSpace: 5,
  imgSize: () => ({ width: '310px', height: '155px' }),
  barSize: () => ({ width: '310px', height: '40px' }),
})

const { mode, captchaType } = toRefs(props)
const { proxy } = getCurrentInstance()! as any

// ==================== 响应式状态 ====================
const secretKey = ref('') // 后端返回的 AES 加密密钥
const token = ref('') // 后端返回的 token
const requiredClickCount = ref(3) // 需要点击的总字数
const targetPoints = reactive<Point[]>([]) // 后端返回的目标坐标
const clickedPoints = reactive<Point[]>([]) // 用户已点击的坐标
let clickCount = ref(1) // 当前已点击次数
const backgroundImage = ref('') // 背景图片 base64
const wordList = reactive<string[]>([]) // 需要点击的文字列表
const componentSize = reactive<Size>({
  imgHeight: '0',
  imgWidth: '0',
  barHeight: '0',
  barWidth: '0',
})
const displayPoints = reactive<Point[]>([]) // 临时显示的点
const promptText = ref('') // 提示文字
const barAreaColor = ref<string | undefined>(undefined) // 提示栏文字颜色
const barAreaBorderColor = ref<string | undefined>(undefined) // 提示栏边框颜色
const showRefresh = ref(true) // 是否显示刷新按钮
const isClickable = ref(true) // 是否允许点击

const canvas = ref<HTMLImageElement | null>(null)

// ==================== 辅助函数 ====================
/** 获取鼠标点击在 canvas 上的坐标 */
const getMousePos = (obj: HTMLImageElement | null, e: MouseEvent): Point => {
  return { x: e.offsetX, y: e.offsetY }
}

/** 在画布上创建新的点标记 */
const createPoint = (pos: Point): number => {
  displayPoints.push({ ...pos })
  return clickCount.value + 1
}

/** 坐标转换：将实际点击坐标转换为相对于 310x155 标准尺寸的坐标（与后端约定） */
const transformPoints = (points: Point[], imgSize: Size): Point[] => {
  return points.map((p) => ({
    x: Math.round((310 * p.x) / parseInt(imgSize.imgWidth)),
    y: Math.round((155 * p.y) / parseInt(imgSize.imgHeight)),
  }))
}

// ==================== 核心业务 ====================
/** 获取验证码图片和文字 */
const fetchCaptchaImage = async () => {
  const res = await fetchImageCaptchaUsingGet({
    captchaType: captchaType.value,
    clientUid: deviceId.value,
    ts: Date.now(), // 现在的时间戳
  })
  if (res.data.repCode === '0000') {
    backgroundImage.value = res.data.repData.originalImageBase64
    token.value = res.data.repData.token
    secretKey.value = res.data.repData.secretKey
    wordList.splice(0, wordList.length, ...res.data.repData.wordList)
    promptText.value = `请依次点击【${wordList.join(',')}】`
  } else {
    promptText.value = res.data.repMsg
  }
}

/** 处理图片点击事件 */
const onCanvasClick = async (e: MouseEvent) => {
  if (!canvas.value) return

  // 记录当前点击坐标
  clickedPoints.push(getMousePos(canvas.value, e))

  // 如果已完成所需点击数
  if (clickCount.value === requiredClickCount.value) {
    // 创建临时点标记（最后一个点）
    clickCount.value = createPoint(getMousePos(canvas.value, e))

    // 转换坐标并发送验证
    const transformedPoints = transformPoints(clickedPoints, componentSize)
    clickedPoints.splice(0, clickedPoints.length, ...transformedPoints)

    // 延迟 400ms 等待点标记渲染完成
    setTimeout(async () => {
      if (!token.value || !secretKey.value) {
        return
      }

      // 构建验证参数
      const captchaVerification = aesEncrypt(
        token.value + '---' + JSON.stringify(clickedPoints),
        secretKey.value,
      )

      const params = {
        captchaType: captchaType.value,
        pointJson: aesEncrypt(JSON.stringify(clickedPoints), secretKey.value),
        token: token.value,
      }

      try {
        const res = await checkImageCaptchaUsingGet(params)
        if (res.data.repCode === '0000') {
          // 验证成功
          barAreaColor.value = '#4cae4c'
          barAreaBorderColor.value = '#5cb85c'
          promptText.value = '验证成功'
          isClickable.value = false

          if (mode.value === 'pop') {
            setTimeout(() => {
              ;(proxy.$parent as any).clickShow.value = false
              refresh()
            }, 1500)
          }
          proxy.$parent?.$emit('success', { captchaVerification })
        } else {
          // 验证失败
          proxy.$parent?.$emit('error', proxy)
          barAreaColor.value = '#d9534f'
          barAreaBorderColor.value = '#d9534f'
          promptText.value = res.data.repMsg || '验证失败'
          setTimeout(() => refresh(), 700)
        }
      } catch (error) {
        console.error('验证请求失败', error)
      }
    }, 400)
  }

  // 未达到所需点击数，继续添加点标记
  if (clickCount.value < requiredClickCount.value) {
    clickCount.value = createPoint(getMousePos(canvas.value, e))
  }
}

/** 刷新验证码 */
const refresh = async () => {
  // 重置所有状态
  displayPoints.splice(0, displayPoints.length)
  barAreaColor.value = '#000'
  barAreaBorderColor.value = '#ddd'
  isClickable.value = true
  targetPoints.splice(0, targetPoints.length)
  clickedPoints.splice(0, clickedPoints.length)
  clickCount.value = 1
  await fetchCaptchaImage()
  showRefresh.value = true
}

/** 初始化组件 */
const init = () => {
  targetPoints.splice(0, targetPoints.length)
  clickedPoints.splice(0, clickedPoints.length)
  clickCount.value = 1
  fetchCaptchaImage()
  nextTick(() => {
    const { imgHeight, imgWidth, barHeight, barWidth } = resetImgBarSize(proxy)
    componentSize.imgHeight = imgHeight
    componentSize.imgWidth = imgWidth
    componentSize.barHeight = barHeight
    componentSize.barWidth = barWidth
    proxy.$parent?.$emit('ready', proxy)
  })
}

onMounted(() => {
  init()
  // 禁止图片拖拽
  proxy.$el.onselectstart = () => false
})

defineExpose({ refresh })
</script>
