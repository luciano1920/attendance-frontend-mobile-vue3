<!--
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-05
 * @LastEditors  : 罗钧 71233895@chinatelecom.cn
 * @LastEditTime : 2026-05
 * @FilePath     : /attendance-frontend-mobile/src/pages/system/HelpCenterPage.vue
 * @Description  : 帮助中心页面
-->
<template>
  <div id="help-center-page">
    <div class="nav-bar" @click="router.push('/profile')">
      <AppSvgIcon name="chevron-left" size="22px" />
      帮助中心
    </div>

    <div class="section-title">常见问题</div>
    <t-collapse theme="card" :value="activeIds" expand-mutex @change="handleChange">
      <t-collapse-panel
        v-for="(item, index) in faqList"
        :key="index"
        :value="item.id"
        :header="item.question"
      >
        <div class="faq-answer">{{ item.answer }}</div>
      </t-collapse-panel>
    </t-collapse>

    <t-cell-group title="其他帮助" theme="card">
      <!-- <t-cell title="操作手册" arrow hover note="点击查看" /> -->
      <t-cell title="意见与反馈" arrow hover @click="handleFeedback" />
    </t-cell-group>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from 'tdesign-mobile-vue'
import AppSvgIcon from '@/components/AppSvgIcon.vue'

const router = useRouter()

// 折叠面板展开状态控制
const activeIds = ref<any[]>([])

/**
 * 常见问题数据配置
 * 后续拓展只需在这个数组里增加对象即可
 */
const faqList = ref([
  {
    id: '1',
    question: '如何进行上下班打卡？',
    answer:
      '请在工作时间内在公司的物理打卡机进行人脸识别打卡。系统将自动获取当前打卡位置并验证人脸信息，验证通过即打卡成功。',
  },
  {
    id: '2',
    question: '忘记打卡了怎么补卡？',
    answer:
      '如果当天漏打卡，请在“申请”页面选择“补卡申请”。在日历中需选择漏打卡的日期并填写补卡原因，提交后等待部门管理员审批。',
  },
  {
    id: '3',
    question: '请假申请被驳回了怎么办？',
    answer:
      '您可以在“申请记录”中找到被驳回的请假单，查看主管驳回的具体原因。修改相关信息或补充材料后，可以重新点击“再次提交”发起审批。',
  },
  {
    id: '4',
    question: '如何更新人脸识别信息？',
    answer:
      '在“申请”页面选择“人脸录入”，填写人脸信息更新表单，选择对应审批人，并上传更新后的人脸照片。提交后等待部门管理员审批，审批通过后即可使用新的人脸信息进行打卡。',
  },
])

/**
 * 折叠面板展开/收起
 * @param value 当前折叠面板的值
 */
const handleChange = (value: Array<string | number>) => {
  activeIds.value = value as string[]
}

/** 意见反馈 */
const handleFeedback = () => {
  Message.success({
    content: '反馈通道建设中，如有问题请联系人力部管理员',
    offset: [10, 16],
  })
}
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

.section-title {
  padding: 13px 20px;
  font-size: 14px;
  color: #86909c;
}

.faq-answer {
  font-size: 14px;
  color: #646a73;
  line-height: 1.5;
  background-color: #f5f6f7;
  padding: 8px;
  border-radius: 8px;
}
</style>
