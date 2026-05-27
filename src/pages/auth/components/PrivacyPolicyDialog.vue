<!--
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-05
 * @LastEditors  : 罗钧 71233895@chinatelecom.cn
 * @LastEditTime : 2026-05
 * @FilePath     : /attendance-frontend-mobile/src/pages/auth/components/PrivacyPolicyDialog.vue
 * @Description  : 隐私政策弹窗组件
-->
<template>
  <t-dialog
    v-model:visible="visible"
    :title="title"
    :confirm-btn="confirmBtn"
    :cancel-btn="null"
    :close-on-overlay-click="true"
    :on-confirm="onConfirm"
    :on-close="onClose"
    :on-overlay-click="onClose"
    :z-index="zIndex"
    :destroy-on-close="true"
  >
    <div class="privacy-body">
      <div class="privacy-updated">更新日期：{{ updated }}</div>

      <h3>1. 我们如何收集和使用您的个人信息</h3>
      <p>
        为实现考勤管理功能，我们将根据“最小必要”原则收集和使用您的个人信息。如果您拒绝提供相应的信息，可能无法使用相关功能：
      </p>

      <h4>1.1 账号登录与基本信息</h4>
      <p>企业分配信息：您的姓名、员工工号、所属部门、岗位信息（由企业 HR 统一导入）。</p>
      <p>手机号码：用于接收验证码登录、接收考勤异常提醒及系统通知。</p>

      <h4>1.2 审批与查询服务</h4>
      <p>请假/加班记录：您主动填写的请假事由、时长、附件证明材料等，用于企业内部审批流转。</p>
      <p>考勤记录：您的每日打卡时间、打卡地点、迟到/早退/缺卡等统计结果。</p>

      <h4>1.3 消息推送服务</h4>
      <p>
        为了及时向您发送审批结果、考勤异常预警，我们会使用设备推送SDK，需要获取设备的 Device ID
        及推送 Token。
      </p>

      <h3>2. 我们如何存储您的个人信息</h3>
      <p>2.1 存储地域：您的个人信息将存储于中华人民共和国境内。</p>
      <p>
        2.2
        存储期限：在您使用本软件及作为企业员工期间，我们会持续保存。当您离职且所在企业要求注销您的账号后，或达到法律法规规定的最低保存期限后，我们将删除或匿名化处理您的个人信息。
      </p>

      <h3>3. 我们如何共享、转让和公开披露您的个人信息</h3>
      <p>
        3.1
        与企业/组织的共享：本软件是企业的管理工具，您在使用过程中产生的所有考勤数据、审批记录，您的直属上级及企业HR/管理员均有权查看。我们仅作为工具提供方，受企业委托处理您的信息。
      </p>
      <p>
        3.2 未经您及您所在企业的单独同意，我们绝不会向其他第三方出售、转让或公开披露您的个人信息。
      </p>

      <h3>4. 我们如何保护您的个人信息</h3>
      <p>
        4.1
        我们采用符合业界标准的安全技术措施（如数据加密传输、存储加密、访问控制、防入侵系统）来保护您的信息安全。
      </p>
      <p>4.2 我们采取严格的数据管理流程和制度保障，限制内部人员访问数据的权限。</p>
      <p>
        4.3
        尽管我们已尽力保护您的信息安全，但由于互联网环境的特殊性，请理解我们无法提供绝对的安全保证。若发生个人信息安全事件，我们将依法及时通知您及企业。
      </p>

      <h3>5. 您的权利</h3>
      <p>
        在符合相关法律法规的前提下，您享有以下权利（部分权利可能因企业管理的合规性要求受到限制，需通过企业HR协调处理）：
      </p>
      <p>
        5.1
        查询与更正权：您可以在App内查看您的考勤记录、个人信息，如发现错误，可联系人力考勤管理员更正。
      </p>
      <p>5.2 删除权：在法律法规规定的情形下（如您离职），您有权请求我们删除您的个人信息。</p>
      <p>
        5.3
        撤回同意权：对于位置信息、生物识别信息等需授权的信息，您可以通过手机系统的“设置”中关闭相应权限。
        请注意，关闭权限将导致无法使用对应的考勤功能，可能导致考勤异常并被企业判定为缺勤。
      </p>
      <p>5.4 联系我们：您可以通过本政策底部的联系方式向我们提出权利请求。</p>

      <h3>6. 本政策的更新</h3>
      <p>
        我们可能会适时修订本政策。未经您明确同意，我们不会削减您按照本政策所应享有的权利。政策更新后，我们会在软件内通过弹窗等方式通知您。
      </p>

      <h3>7. 联系我们</h3>
      <p>如果您对本用户协议或隐私政策有任何疑问、意见或建议，可通过以下方式与我们联系：</p>
      <p>公司名称：中国电信股份有限公司海口分公司</p>
      <p>我们将在收到您的问题并核实您的身份后的15个工作日内予以回复。</p>
    </div>
  </t-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    title?: string
    updated?: string
    confirmText?: string
    zIndex?: number
  }>(),
  {
    title: '隐私政策',
    updated: '2026 年 5 月 3 日',
    confirmText: '我知道了',
    zIndex: undefined,
  },
)

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'close'): void
}>()

const visible = ref(false)

const open = () => {
  visible.value = true
}

const close = () => {
  visible.value = false
}

const onConfirm = () => {
  emit('confirm')
  close()
}

const onClose = () => {
  emit('close')
  close()
}

const confirmBtn = { content: props.confirmText as string }

defineExpose({
  open,
  close,
})
</script>

<style scoped>
.privacy-body {
  max-height: 60vh;
  overflow-y: auto;
  font-size: 13px;
  line-height: 1.8; /* 稍微增加行高 */
  color: #333;
  text-align: left; /* 明确正文默认左对齐 */
}

.privacy-updated {
  margin: 0 0 8px;
  font-size: 12px;
  color: #999;
  text-align: center; /* 更新日期居中 */
  text-indent: 0; /* 取消段落缩进 */
}

.privacy-body h3 {
  margin: 18px 0 8px;
  font-size: 14px;
  font-weight: 600;
  text-align: center; /* 小标题居中 */
}

.privacy-body h4 {
  margin: 14px 0 6px;
  font-size: 13px;
  font-weight: 600;
  text-align: center; /* 二级小标题居中 */
}

.privacy-body p {
  margin: 6px 0;
  white-space: pre-line;
  text-indent: 2em; /* 段落开头空两格 */
}
</style>
