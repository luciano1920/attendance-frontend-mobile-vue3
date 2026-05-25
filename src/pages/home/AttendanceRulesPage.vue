<!--
 * @Author       : luciano1920 1290582790@qq.com
 * @Date         : 2026-05-25 09:12
 * @LastEditors  : luciano1920 1290582790@qq.com
 * @LastEditTime : 2026-05-25 14:37
 * @FilePath     : \attendance-frontend-mobile\src\pages\home\AttendanceRulesPage.vue
 * @Description  : 考勤规则（帮助手册）页面
-->
<template>
  <div id="attendance-rules-page" ref="container">
    <div class="nav-bar" @click="router.push('/')">
      <SvgIcon name="chevron-left" size="22px" />
      帮助手册
    </div>

    <div class="rule-container">
      <div class="rule-title">
        <img src="@/assets/svgs/title-icon-square.svg" />
        <span>打卡日历标标记说明</span>
      </div>
      <div class="rule-content">
        <div v-for="item in legendList" :key="item.label" class="legend-desc">
          <span class="legend-dot" :style="{ backgroundColor: item.color }"></span>
          <span class="legend-label">{{ item.label }}：</span>
          <span class="legend-content">{{ item.content }}</span>
        </div>
      </div>
    </div>

    <div class="rule-container">
      <div class="rule-title">
        <img src="@/assets/svgs/title-icon-square.svg" />
        <span>打卡规则</span>
      </div>
      <div class="rule-content">
        <div class="rule-desc">1、每日需打卡 1 次，有效时段：7:00-20:00</div>
        <div class="rule-desc">2、超出时段打卡，不记录为已打卡，会标记为缺卡</div>
      </div>
    </div>

    <div class="rule-container">
      <div class="rule-title">
        <img src="@/assets/svgs/title-icon-square.svg" />
        <span>考勤申请相关</span>
      </div>
      <div class="rule-content">
        <div class="rule-desc">
          1、请假 / 调休 / 外出 申请通过后，日历下方日期标签将标注申请信息
        </div>
        <div class="rule-desc">2、同一时段请勿重复发起申请，否则会重复记录申请时长</div>
        <div class="rule-desc">3、发起申请时，可用审批人有误，则需联系人力部（吕真言）更改</div>
      </div>
    </div>

    <div class="rule-container">
      <div class="rule-title">
        <img src="@/assets/svgs/title-icon-square.svg" />
        <span>设备与异常处理</span>
      </div>
      <div class="rule-content">
        <div class="rule-desc">
          1、打卡机提示“人员未登记”：联系人力部（吕真言）或研发中心支撑人员（程勇智）绑定可用打卡机
        </div>
        <div class="rule-desc">
          2、部门变动后无法刷脸打卡：请尝试在系统发起人脸信息更新（人脸录入）申请
        </div>
        <div class="rule-desc">
          3、打卡机显示成功但考勤系统无记录：可能该打卡机已脱机离线，请联系研发中心支撑人员（程勇智）处理
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ATTENDANCE_STATISTICS_CONFIG, RECORD_TYPE_COLOR_MAP } from '@/constants/record'
import SvgIcon from '@/components/SvgIcon.vue'

const router = useRouter()

const legendList = ATTENDANCE_STATISTICS_CONFIG.map((item) => ({
  label: item.label,
  content: item.content,
  color: RECORD_TYPE_COLOR_MAP[item.recordTypes[0] || 0], // 同组 recordTypes 色值一致，取第一个即可
}))
</script>

<style scoped lang="scss">
.nav-bar {
  padding: 14px 20px;
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  gap: 8px;
}

.rule-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px 20px 16px;

  .rule-title {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 15px;
    font-weight: 600;
    color: #171a1d;
  }

  .rule-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 12px;
    border-radius: 4px;
    padding: 0 4px;

    .rule-desc {
      font-size: 14px;
      color: #4e5969;
      margin-left: 1.5em;
      text-indent: -1.5em;
      line-height: 1.8;
    }
  }
}

.legend-desc {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 4px;
  font-size: 14px;

  .legend-dot {
    min-width: 8px;
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 6px;
  }

  .legend-label {
    min-width: 70px;
  }

  .legend-content {
    color: #4e5969;
  }
}
</style>
