<!--
 * @Author       : luciano1920 1290582790@qq.com
 * @Date         : 2026-05-03 11:15
 * @LastEditors  : luciano1920 1290582790@qq.com
 * @LastEditTime : 2026-05-18 15:15
 * @FilePath     : \attendance-frontend-mobile\src\pages\auth\components\UserAgreementDialog.vue
 * @Description  : 用户协议弹窗组件
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
    <!-- 长文本协议内容，使用 body 插槽；此处直接写入文本，也可以改为引入静态 .md/.html 片段 -->
    <div class="agreement-body">
      <div class="agreement-updated">更新日期：{{ updated }}</div>

      <h3>1. 协议的接受与修改</h3>
      <p>
        1.1
        您在使用本软件前，应当认真阅读本协议。一旦您以任何方式使用本软件，即表示您已充分阅读、理解并同意接受本协议的约束。
      </p>
      <p>
        1.2
        我们有权在必要时修改本协议条款。协议修改后，将在软件内通过弹窗、公告等方式通知您。如果您不同意修改后的协议，可以停止使用本软件；您继续使用的，视为接受修改后的协议。
      </p>

      <h3>2. 服务内容</h3>
      <p>
        2.1
        本软件主要为企业/组织提供移动端考勤管理服务，包括但不限于：查看上下班打卡记录、请假申请、调休申请、外出申请、补卡申请、人脸变更申请、申请记录查看/审批等功能。
      </p>
      <p>
        2.2 本软件的具体服务内容以实际发布的版本为准。我们保留随时变更、中断或终止部分服务的权利。
      </p>

      <h3>3. 账号注册与管理</h3>
      <p>
        3.1
        本软件通常不支持个人自行注册，需由所属企业/组织的管理员为您开通账号或通过企业统一认证授权登录。
      </p>
      <p>
        3.2
        您应妥善保管您的账号及密码/生物特征信息，因您个人原因导致账号泄露而引起的任何损失由您自行承担。
      </p>
      <p>3.3 您不得将账号出借给他人。</p>

      <h3>4. 用户行为规范</h3>
      <p>
        4.1
        您承诺合法、合规地使用本软件，不得利用本软件从事违反国家法律法规、社会公德或侵害他人合法权益的行为。
      </p>
      <p>
        4.2
        考勤合规承诺：您承诺使用真实地理位置、真实生物特征进行考勤打卡。严禁使用任何第三方插件、虚拟定位软件或其他作弊手段进行虚假打卡。
      </p>
      <p>
        4.3 您不得对本软件进行反编译、反汇编、修改、破坏其正常功能或进行任何影响系统稳定性的操作。
      </p>

      <h3>5. 知识产权</h3>
      <p>
        5.1
        本软件的所有知识产权（包括但不限于源代码、界面设计、图标、文档等）均归我们或其权利人所有。
      </p>
      <p>5.2 未经我们书面许可，您不得以任何形式复制、传播、转让或许可他人使用上述知识产权。</p>

      <h3>6. 免责声明</h3>
      <p>6.1 因不可抗力导致本软件无法正常使用，我们不承担任何责任。</p>
      <p>
        6.2
        鉴于移动网络环境的特殊性，因手机信号弱、GPS信号漂移、设备故障等非我们故意或重大过失的原因导致打卡失败、位置偏差等，我们不承担相关责任。
      </p>
      <p>
        6.3
        本软件仅作为考勤数据记录的工具，对您与所属企业/组织之间的劳动争议或纠纷不承担任何连带责任。
      </p>

      <h3>7. 协议终止</h3>
      <p>7.1 若您违反本协议规定，我们或您的所属企业有权单方面终止向您提供服务，注销您的账号。</p>
      <p>7.2 当您离职或解除与所属企业的合作关系时，您的账号使用权将被自动收回。</p>

      <h3>8. 争议解决</h3>
      <p>8.1 本协议的订立、执行、解释及争议解决均适用中华人民共和国法律。</p>
      <p>
        8.2
        若双方发生争议，应首先友好协商解决；协商不成的，任何一方均可向我们所在地有管辖权的人民法院提起诉讼。
      </p>
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
    title: '用户协议',
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

// 内部事件处理
const onConfirm = () => {
  emit('confirm')
  close()
}

const onClose = () => {
  emit('close')
  close()
}

// 计算属性 / 常量：只读配置项
const confirmBtn = { content: props.confirmText as string }

// 暴露给父组件的方法
defineExpose({
  open,
  close,
})
</script>

<style scoped>
.agreement-body {
  max-height: 60vh;
  overflow-y: auto;
  font-size: 13px;
  line-height: 1.8; /* 稍微增加行高，配合首行缩进阅读体验更好 */
  color: #333;
  text-align: left; /* 明确正文默认左对齐 */
}

.agreement-updated {
  margin: 0 0 8px;
  font-size: 12px;
  color: #999;
  text-align: center; /* 更新日期居中 */
  text-indent: 0; /* 取消段落缩进 */
}

.agreement-body h3 {
  margin: 18px 0 8px;
  font-size: 14px;
  font-weight: 600;
  text-align: center; /* 小标题居中 */
}

.agreement-body p {
  margin: 6px 0;
  white-space: pre-line;
  text-indent: 2em; /* 段落开头空两格 */
}
</style>
