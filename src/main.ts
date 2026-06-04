import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import 'tdesign-mobile-vue/es/style/index.css' // 引入组件库的少量全局样式变量

import 'virtual:svg-icons-register' // 引入svg图标注册插件
import AppSvgIcon from '@/components/AppSvgIcon.vue' // 引入图标雪碧图组件

import '@/styles/global.css' // 引入全局样式
import '@/styles/fonts.css' // 引入全局字体样式
import '@/styles/nprogress.css' // 引入 NProgress 进度条样式

import './permission' // 引入全局权限控制

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.component('AppSvgIcon', AppSvgIcon)

app.mount('#app')
