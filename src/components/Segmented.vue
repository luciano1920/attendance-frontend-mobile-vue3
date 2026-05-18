<!--
 * @Author       : luciano1920 1290582790@qq.com
 * @Date         : 2026-04-26 14:37
 * @LastEditors  : luciano1920 1290582790@qq.com
 * @LastEditTime : 2026-05-08 17:23
 * @FilePath     : \attendance-frontend-mobile\src\components\Segmented.vue
 * @Description  : 分段控制器（Segmented）组件，选中态采用滑块风格
-->
<template>
  <div
    class="segmented"
    :class="{
      'segmented-small': size == 'small',
      'segmented-large': size == 'large',
      'segmented-block': block,
      'segmented-round': shape === 'round',
      'segmented-vertical': direction === 'vertical',
    }"
  >
    <div ref="groupRef" class="segmented-group">
      <!-- 滑块层，根据 value 动态定位 -->
      <div class="segmented-thumb" :style="thumbStyle" v-show="hasSelected" />

      <div
        class="segmented-item"
        :class="{
          'segmented-item-selected': value === getOptionValue(option),
          'segmented-item-disabled': disabled || getOptionDisabled(option),
          'segmented-item-block': block,
        }"
        v-for="(option, index) in options"
        :key="index"
        :ref="(el) => setItemRef(el, index)"
        @click="
          disabled || getOptionDisabled(option) ? () => false : onSelected(getOptionValue(option))
        "
      >
        <input
          type="radio"
          class="segmented-item-input"
          :checked="value === getOptionValue(option)"
          :disabled="disabled || getOptionDisabled(option)"
        />
        <div class="segmented-item-label">
          <slot
            name="label"
            :label="getOptionLabel(option)"
            :payload="typeof option === 'object' ? option.payload : {}"
          >
            {{ getOptionLabel(option) }}
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, computed } from 'vue'

type SegmentedValue = string | number | boolean

interface SegmentedOption {
  label?: string // 选项名
  value: SegmentedValue // 选项值
  disabled?: boolean // 是否禁用选项
  payload?: any // 自定义数据载体
}

interface Props {
  value?: SegmentedValue // (v-model:value 绑定) 当前选中的值
  block?: boolean // 是否将宽度调整为父元素宽度，同时所有选项占据相同的宽度
  disabled?: boolean // 是否全部禁用
  options?: SegmentedValue[] | SegmentedOption[] // 选项数据
  size?: 'small' | 'middle' | 'large' // 控件尺寸
  shape?: 'default' | 'round' // 形状：默认方角，round 为胶囊
  direction?: 'horizontal' | 'vertical' // 排列方向，默认横向
}

const props = withDefaults(defineProps<Props>(), {
  value: undefined,
  block: false,
  disabled: false,
  options: () => [],
  size: 'middle',
  shape: 'default',
  direction: 'horizontal',
})

const emits = defineEmits(['update:value', 'change'])

/**
 * 选中选项触发
 * @param value 选项值
 */
const onSelected = (value: SegmentedValue) => {
  if (value !== props.value) {
    emits('update:value', value)
    emits('change', value)
  }
}

/**
 * 读取选项是否禁用
 * @param option 选项
 */
const getOptionDisabled = (option: SegmentedValue | SegmentedOption) => {
  if (typeof option == 'object') {
    return option?.disabled || false
  }
  return false
}

/**
 * 读取选项的 Value 值
 * @param option 选项
 */
const getOptionValue = (option: SegmentedValue | SegmentedOption) => {
  if (typeof option == 'object') {
    return option.value
  }
  return option
}

/**
 * 读取选项的 Label 值
 * @param option 选项
 */
const getOptionLabel = (option: SegmentedValue | SegmentedOption) => {
  if (typeof option == 'object') {
    return option.label
  }
  return option
}

// 用于保存每个选项 DOM 元素的引用
const itemRefs = ref<Record<number, HTMLElement>>({})
const groupRef = ref<HTMLElement>() // 选项容器
const thumbStyle = ref<Record<string, string>>({}) // 滑块的动态样式

/** 把 v-for 生成的每个选项 dom 存起来 */
const setItemRef = (el: any, index: number) => {
  if (el) {
    itemRefs.value[index] = el
  } else {
    // 当元素卸载时，清理引用
    delete itemRefs.value[index]
  }
}

// 当前选中项的索引（-1 表示无选中）
const selectedIndex = computed(() => {
  const val = props.value
  return props.options.findIndex((opt) => getOptionValue(opt) === val)
})

// 是否有选中的值
const hasSelected = computed(() => selectedIndex.value !== -1)

/**
 * 重新计算滑块位置和尺寸
 * 会根据 direction 自动使用 translateX 或 translateY
 */
const updateThumb = () => {
  const group = groupRef.value
  const idx = selectedIndex.value
  const item = idx !== -1 ? itemRefs.value[idx] : null

  if (!group || !item) {
    thumbStyle.value = {}
    return
  }

  const groupRect = group.getBoundingClientRect()
  const itemRect = item.getBoundingClientRect()

  // 尺寸
  thumbStyle.value = {
    width: `${itemRect.width}px`,
    height: `${itemRect.height}px`,
  }

  // 位移（根据方向）
  if (props.direction === 'vertical') {
    thumbStyle.value.transform = `translateY(${itemRect.top - groupRect.top}px)`
  } else {
    thumbStyle.value.transform = `translateX(${itemRect.left - groupRect.left}px)`
  }
}
// 组件挂载后及任何可能影响布局的属性变化后，重新定位滑块
onMounted(() => {
  nextTick(updateThumb)
})

// 任何可能影响布局的依赖变化时，重新计算滑块位置
watch(
  () => [props.value, props.options, props.size, props.block, props.direction],
  () => {
    nextTick(updateThumb)
  },
  { deep: true },
)
</script>

<style lang="scss" scoped>
.segmented {
  --segmented-bg: #eeeef0;
  --segmented-thumb-bg: #ffffff;
  --segmented-color: rgba(0, 0, 0, 0.65);
  --segmented-color-active: #0052d9;
  --segmented-color-disabled: rgba(0, 0, 0, 0.25);

  display: inline-block;
  padding: 2px;
  color: var(--segmented-color);
  font-size: 14px;
  line-height: 1.5;
  background-color: var(--segmented-bg);
  border-radius: 6px;
  transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);

  .segmented-group {
    position: relative;
    display: flex;
    align-items: stretch;
    justify-items: flex-start;
    width: 100%;

    .segmented-item {
      background: transparent; // 去掉选项自身背景，让滑块显示
      position: relative;
      text-align: center;
      // cursor: pointer;
      transition:
        color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1),
        background-color 0.2s;
      border-radius: 4px;

      &:hover:not(.segmented-item-selected):not(.segmented-item-disabled) {
        color: var(--segmented-color-active);

        &::after {
          background-color: rgba(0, 0, 0, 0.06);
        }
      }

      &::after {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        inset-inline-start: 0;
        border-radius: inherit;
        transition: background-color 0.2s;
        pointer-events: none;
        content: '';
      }

      .segmented-item-input {
        position: absolute;
        inset-block-start: 0;
        inset-inline-start: 0;
        width: 0;
        height: 0;
        opacity: 0;
        pointer-events: none;
      }

      .segmented-item-label {
        font-weight: 500;
        min-height: 28px;
        line-height: 28px;
        padding: 0 10px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        z-index: 1; // 保证文字在滑块之上
      }
    }

    .segmented-item-selected {
      // background-color: #ffffff;
      // box-shadow:
      //   0 1px 2px 0 rgba(0, 0, 0, 0.03),
      //   0 1px 6px -1px rgba(0, 0, 0, 0.02),
      //   0 2px 4px 0 rgba(0, 0, 0, 0.02);
      color: var(--segmented-color-active);
    }

    .segmented-item-disabled {
      color: var(--segmented-color-disabled);
      cursor: not-allowed;
      pointer-events: none;
    }

    // 滑块样式
    .segmented-thumb {
      position: absolute;
      top: 0;
      left: 0;
      background-color: var(--segmented-thumb-bg);
      box-shadow:
        0 1px 2px 0 rgba(0, 0, 0, 0.03),
        0 1px 6px -1px rgba(0, 0, 0, 0.02),
        0 2px 4px 0 rgba(0, 0, 0, 0.02);
      border-radius: 4px; // 默认匹配 item 圆角
      transition:
        transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
        width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
        height 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      pointer-events: none; // 不阻止点击
      z-index: 0;
    }
  }
}

.segmented-small {
  border-radius: 4px;

  .segmented-group .segmented-item {
    border-radius: 2px;

    .segmented-item-label {
      min-height: 22px;
      line-height: 22px;
      padding: 0 8px;
      font-size: 12px;
    }
  }
}

.segmented-large {
  border-radius: 8px;

  .segmented-group .segmented-item {
    border-radius: 6px;

    .segmented-item-label {
      min-height: 36px;
      line-height: 36px;
      padding: 0 12px;
      font-size: 16px;
    }
  }
}

.segmented-block {
  display: flex;
  width: 100%;

  .segmented-group .segmented-item {
    flex: 1;
    min-width: 0;
  }
}

.segmented-round {
  border-radius: 999px; // 胶囊外框

  .segmented-item {
    border-radius: 999px !important; // 每个选项也胶囊
  }

  .segmented-thumb {
    border-radius: 999px !important; // 滑块同样胶囊
  }
}

.segmented-vertical {
  .segmented-group {
    flex-direction: column; // 改为纵向排列
  }

  .segmented-item {
    width: 100%; // 纵向时每个选项占满宽度
  }

  // 如果同时开启了 block 模式，纵向平分高度
  &.segmented-block .segmented-item {
    flex: 1 0 auto;
    min-height: 0;
  }
}
</style>
