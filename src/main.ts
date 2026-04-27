/**
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-03-19 17:07
 * @LastEditors  : luciano1920 1290582790@qq.com
 * @LastEditTime : 2026-04-27 08:49
 * @FilePath     : \attendance-frontend-mobile\src\main.ts
 * @Description  :
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
// import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

import TDesign from 'tdesign-mobile-vue'
import 'tdesign-mobile-vue/es/style/index.css' // 引入组件库的少量全局样式变量

import 'virtual:svg-icons-register' // 引入svg图标注册插件
import SvgIcon from '@/components/SvgIcon.vue' // 引入你修改后的组件

import '@/styles/global.css' // 引入全局样式
import '@/styles/fonts.css' // 引入全局字体样式

import './permission' // 引入全局权限控制

const app = createApp(App)
const pinia = createPinia()

// pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(TDesign)
app.component('SvgIcon', SvgIcon)

app.mount('#app')
