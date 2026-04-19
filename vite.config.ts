/**
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-03-19 17:07
 * @LastEditors  : 罗钧 71233895@chinatelecom.cn
 * @LastEditTime : 2026-03-30 09:07
 * @FilePath     : \attendance-frontend-mobile\vite.config.ts
 * @Description  : Vite 全局配置
 */
import { fileURLToPath, URL } from 'node:url'
import path from 'path'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 当前执行 node 命令时文件夹的地址(工作目录)
  const root = process.cwd()
  // 加载环境变量
  const env = loadEnv(mode, root)

  return {
    base: env.VITE_BASE_PATH || '/',
    root: root,
    plugins: [
      vue(),
      svgLoader({
        svgoConfig: {
          multipass: true
        }
      }),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), 'src/assets/svgs/icons')],
        // 指定 symbolId 格式
        symbolId: 'icon-[name]'
      })
    ],
    server: {
      port: Number(env.VITE_PORT) || 5173,
      host: '0.0.0.0',
      open: env.VITE_OPEN === 'true'
      // proxy: {
      //   '/api': {
      //     target: env.VITE_API_BASE_URL || 'http://localhost:8123',
      //     changeOrigin: true,
      //     rewrite: (path) => path.replace(/^\/api/, ''),
      //   },
      // },
    },
    build: {
      outDir: env.VITE_OUT_DIR || 'dist',
      sourcemap: env.VITE_SOURCEMAP === 'true' ? 'inline' : false,
      minify: 'terser', // 代码压缩配置
      terserOptions: {
        compress: {
          drop_console: env.VITE_DROP_CONSOLE === 'true', // 删除 console
          drop_debugger: env.VITE_DROP_DEBUGGER === 'true' // 删除 debugger
        }
      } as any,
      rollupOptions: {
        output: {
          // 分包策略
          manualChunks: {
            vue: ['vue', 'vue-router', 'pinia'], // 将 vue 相关的包打包到一个 chunk
            antdv: ['ant-design-vue'], // 将 ant-design-vue 单独打包
            echarts: ['echarts', 'echarts-wordcloud', 'vue-echarts'] // 将 echarts 相关的包打包到一个 chunk
          },
          // 输出文件命名
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: '[ext]/[name]-[hash].[ext]'
        }
      }
    },

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
})
