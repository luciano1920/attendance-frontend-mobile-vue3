<template>
  <div v-show="showBox" :class="mode === 'pop' ? 'mask' : ''">
    <div
      :class="mode === 'pop' ? 'verifybox' : ''"
      :style="{ maxWidth: parseInt(imgSize.width) + 20 + 'px' }"
    >
      <div v-if="mode === 'pop'" class="verifybox-top">
        请完成安全验证
        <span class="verifybox-close" @click="closeBox">
          <i class="iconfont icon-close"></i>
        </span>
      </div>
      <div :style="{ padding: mode === 'pop' ? '10px' : '0' }" class="verifybox-bottom">
        <!-- 验证码容器 -->
        <component
          :is="componentType"
          v-if="componentType"
          ref="instance"
          :arith="arith"
          :barSize="barSize"
          :blockSize="blockSize"
          :captchaType="captchaType"
          :explain="explain"
          :figure="figure"
          :imgSize="imgSize"
          :mode="mode"
          :type="verifyType"
          :vSpace="vSpace"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, shallowRef, watch, type Component, type ComponentPublicInstance } from 'vue'
import ClickCaptcha from './ClickCaptcha.vue'
import SlideCaptcha from './SlideCaptcha.vue'

// ==================== Props 定义 ====================
interface Props {
  captchaType: string // 'blockPuzzle' 或 'clickWord'
  figure?: number
  arith?: number
  mode?: string
  vSpace?: number
  explain?: string
  imgSize?: { width: string; height: string }
  blockSize?: Record<string, any>
  barSize?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'pop',
  imgSize: () => ({ width: '310px', height: '155px' }),
})

const emit = defineEmits<{
  (e: 'ready', instance: ComponentPublicInstance): void
  (e: 'success', data: { captchaVerification: string }): void
  (e: 'error', instance: ComponentPublicInstance): void
}>()

// ==================== 响应式状态 ====================
const clickShow = ref(false) // 是否显示弹窗（pop模式）
const verifyType = ref<string | undefined>(undefined) // 子组件需要的 type 属性（滑块为 '2'，点选为空）
const componentType = shallowRef<Component | null>(null)
const instance = ref<ComponentPublicInstance | null>(null) // 当前激活的子组件实例

// ==================== 计算属性 ====================
const showBox = computed(() => {
  return props.mode === 'pop' ? clickShow.value : true
})

// ==================== 方法 ====================
/** 刷新当前验证码组件 */
const refresh = () => {
  if (instance.value && (instance.value as any).refresh) {
    ;(instance.value as any).refresh()
  }
}

/** 关闭弹窗（pop模式） */
const closeBox = () => {
  clickShow.value = false
  refresh()
}

/** 显示弹窗（pop模式） */
const show = () => {
  if (props.mode === 'pop') {
    clickShow.value = true
  }
}

// ==================== 根据 captchaType 决定子组件 ====================
watch(
  () => props.captchaType,
  (val) => {
    if (val === 'blockPuzzle') {
      verifyType.value = '2'
      componentType.value = SlideCaptcha
    } else if (val === 'clickWord') {
      verifyType.value = ''
      componentType.value = ClickCaptcha
    }
  },
  { immediate: true },
)

// ==================== 暴露给父组件的方法 ====================
defineExpose({
  show,
  closeBox,
  refresh,
})
</script>

<style>
.verifybox {
  position: relative;
  top: 50%;
  left: 50%;
  background-color: #fff;
  border: 1px solid #e4e7eb;
  border-radius: 5px;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px rgb(0 0 0 / 30%);
  box-sizing: border-box;
}

.verifybox-top {
  height: 40px;
  padding: 0 15px;
  font-size: 16px;
  line-height: 40px;
  color: #45494c;
  text-align: left;
  border-bottom: 1px solid #e4e7eb;
  box-sizing: border-box;
}

.verifybox-bottom {
  padding: 10px;
  box-sizing: border-box;
}

.verifybox-close {
  position: absolute;
  top: 13px;
  right: 9px;
  width: 24px;
  height: 24px;
  text-align: center;
  cursor: pointer;
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1001;
  width: 100%;
  height: 100vh;
  background: rgb(0 0 0 / 30%);
  transition: all 0.5s;
}

.verify-tips {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30px;
  line-height: 30px;
  color: #fff;
  text-indent: 10px;
}

.suc-bg {
  background-color: rgb(92 184 92 / 50%);
  filter: progid:DXImageTransform.Microsoft.gradient(startcolorstr=#7f5CB85C, endcolorstr=#7f5CB85C);
}

.err-bg {
  background-color: rgb(217 83 79 / 50%);
  filter: progid:DXImageTransform.Microsoft.gradient(startcolorstr=#7fD9534F, endcolorstr=#7fD9534F);
}

.tips-enter,
.tips-leave-to {
  bottom: -30px;
}

.tips-enter-active,
.tips-leave-active {
  transition: bottom 0.5s;
}

/* 常规验证码 */
.verify-code {
  margin-bottom: 5px;
  font-size: 20px;
  text-align: center;
  cursor: pointer;
  border: 1px solid #ddd;
}

.cerify-code-panel {
  height: 100%;
  overflow: hidden;
}

.verify-code-area {
  float: left;
}

.verify-input-area {
  float: left;
  width: 60%;
  padding-right: 10px;
}

.verify-change-area {
  float: left;
  line-height: 30px;
}

.varify-input-code {
  display: inline-block;
  width: 100%;
  height: 25px;
}

.verify-change-code {
  color: #337ab7;
  cursor: pointer;
}

.verify-btn {
  width: 200px;
  height: 30px;
  margin-top: 10px;
  color: #fff;
  background-color: #337ab7;
  border: none;
  border-radius: 8px;
}

/* 滑动验证码 */
.verify-bar-area {
  position: relative;
  text-align: center;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-sizing: content-box;
}

.verify-bar-area .verify-move-block {
  position: absolute;
  top: 0;
  left: 0;
  cursor: pointer;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 2px #888;
  box-sizing: content-box;
}

.verify-bar-area .verify-move-block:hover {
  color: #fff;
  background-color: #337ab7;
}

.verify-bar-area .verify-left-bar {
  position: absolute;
  top: -1px;
  left: -1px;
  cursor: pointer;
  background: #f0fff0;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-sizing: content-box;
}

.verify-img-panel {
  position: relative;
  margin: 0;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  border-radius: 3px;
  box-sizing: content-box;
}

.verify-img-panel .verify-refresh {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
  width: 25px;
  height: 25px;
  padding: 5px;
  text-align: center;
  cursor: pointer;
}

.verify-img-panel .icon-refresh {
  font-size: 20px;
  color: #fff;
}

.verify-img-panel .verify-gap {
  position: relative;
  z-index: 2;
  background-color: #fff;
  border: 1px solid #fff;
}

.verify-bar-area .verify-move-block .verify-sub-block {
  position: absolute;
  z-index: 3;
  text-align: center;
}

.verify-bar-area .verify-move-block .verify-icon {
  font-size: 18px;
}

.verify-bar-area .verify-msg {
  z-index: 3;
}

.iconfont {
  font-family: iconfont !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}

.icon-check::before,
.icon-close::before,
.icon-right::before,
.icon-refresh::before {
  position: absolute;
  z-index: 9999;
  display: block;
  width: 20px;
  height: 20px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  content: ' ';
}

.icon-check::before {
  background-image: url('@/assets/svgs/icons/check.svg');
}

.icon-close::before {
  background-image: url('@/assets/svgs/icons/close.svg');
}

.icon-right::before {
  background-image: url('@/assets/svgs/icons/chevron-right.svg');
}

.icon-refresh::before {
  background-image: url('@/assets/svgs/icons/refresh.svg');
}
</style>
