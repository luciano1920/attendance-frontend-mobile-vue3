import { fileURLToPath, URL } from 'node:url'
import path from 'path'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
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
      // svg图标雪碧图插件
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), 'src/assets/svgs/icons')],
        // 指定 symbolId 格式
        symbolId: 'icon-[name]',
      }),
    ],
    server: {
      port: Number(env.VITE_PORT) || 5173,
      host: '0.0.0.0',
      open: env.VITE_OPEN === 'true',
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
      minify: 'esbuild', // 代码压缩配置
      chunkSizeWarningLimit: 800,
      esbuild: {
        drop: ['debugger'],
        pure: mode === 'production' ? ['console.log', 'console.warn'] : [],
      },
      // terserOptions: {
      //   compress: {
      //     drop_console: env.VITE_DROP_CONSOLE === 'true', // 删除 console
      //     drop_debugger: env.VITE_DROP_DEBUGGER === 'true' // 删除 debugger
      //   }
      // } as any,
      rollupOptions: {
        output: {
          // 分包策略
          manualChunks: {
            vue: ['vue', 'vue-router', 'pinia'], // 将 vue 相关的包打包到一个 chunk
            tdesign: ['tdesign-mobile-vue'], // 将 tdesign-mobile-vue 单独打包
          },
          // 输出文件命名
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: '[ext]/[name]-[hash].[ext]',
        },
      },
    },

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
