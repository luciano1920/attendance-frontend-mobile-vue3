<!--
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-05
 * @LastEditors  : 罗钧 71233895@chinatelecom.cn
 * @LastEditTime : 2026-05
 * @FilePath     : /attendance-frontend-mobile/src/components/AppDescriptions.vue
 * @Description  : 详情描述容器组件（支持插槽式和配置式调用）
-->
<template>
  <div class="app-descriptions">
    <!-- 标题行 -->
    <div class="app-descriptions-header" v-if="hasHeader">
      <div class="app-descriptions-title">
        <slot name="title">
          <img v-if="showTitleIcon" src="@/assets/svgs/title-icon-line.svg" />
          <span v-if="title">{{ title }}</span>
        </slot>
      </div>
      <div class="app-descriptions-extra">
        <slot name="extra"></slot>
      </div>
    </div>

    <!-- 插槽式 -->
    <div class="app-descriptions-body" v-if="!items?.length">
      <slot></slot>
    </div>

    <!-- 配置式 -->
    <div class="app-descriptions-body" v-else>
      <template v-for="(col, idx) in items" :key="idx">
        <AppDescriptionsItem :label="col.label" :border="border">
          <!-- 标签区域插槽 -->
          <template #label v-if="$slots[`label-${col.field}`]">
            <slot :name="`label-${col.field}`" :row="data" :column="col"></slot>
          </template>

          <!-- 作用域插槽 -->
          <!-- 当设置了 slotName，则优先使用 item-slotName 作为插槽名 -->
          <slot
            v-if="col.slotName && $slots[`item-${col.slotName}`]"
            :name="`item-${col.slotName}`"
            :row="data"
            :column="col"
            :value="col.field ? data?.[col.field] : undefined"
          ></slot>
          <!-- 否则使用 field 字段作为插槽名（item-field） -->
          <slot
            v-else-if="col.field && $slots[`item-${col.field}`]"
            :name="`item-${col.field}`"
            :row="data"
            :column="col"
            :value="data?.[col.field]"
          ></slot>

          <!-- 默认显示内容 -->
          <template v-else-if="col.field">
            {{
              col.formatter
                ? col.formatter(data?.[col.field], data, col)
                : data?.[col.field] || '--'
            }}
          </template>
        </AppDescriptionsItem>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import AppDescriptionsItem from './AppDescriptionsItem.vue'

export interface DescriptionsItemColumn {
  field?: string
  label?: string
  slotName?: string
  formatter?: (value: any, row: any, column: DescriptionsItemColumn) => any
}

interface Props {
  title?: string
  showTitleIcon?: boolean
  border?: boolean
  items?: DescriptionsItemColumn[]
  data?: any
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  showTitleIcon: true,
  border: true,
  items: undefined,
  data: undefined,
})

const slots = useSlots()

const hasHeader = computed(
  () => !!props.title || props.showTitleIcon || !!slots.title || !!slots.extra,
)
</script>

<style scoped lang="scss">
.app-descriptions {
  background-color: #fff;
  border-radius: 16px;

  .app-descriptions-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px 10px;

    .app-descriptions-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 15px;
      font-weight: 600;
      color: #171a1d;
    }

    .app-descriptions-extra {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  .app-descriptions-body {
    display: flex;
    flex-direction: column;
    margin-bottom: 6px;
    padding: 0 16px;
  }
}
</style>
