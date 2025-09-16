import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import copy from 'rollup-plugin-copy'
import { resolve } from 'path'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'

export default ({ mode }: any) => {
  const env = loadEnv(mode, process.cwd())
  console.log(JSON.stringify(env))
  return defineConfig({
    server: {
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      host: '0.0.0.0',
      port: 8081,
      open: true,
      proxy: {
        '/kn-service': {
          target: 'http://127.0.0.1:9090',
          changeOrigin: true,
          ws: false
          // rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    build: {
      assetsDir: 'data-cc',
      target: 'esnext',
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          manualChunks: (id: string | string[]) => {
            if (id.includes('ag-grid')) return 'ag-grid'
          }
        }
        // onwarn(warning, rollupWarn) {
        //   // ignore circular dependency warning
        //   if (warning.code === 'CYCLIC_CROSS_CHUNK_REEXPORT' && warning.exporter?.includes('src/api/')) {
        //     return
        //   }
        //   rollupWarn(warning)
        // }
      }
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src')
      }
    },
    plugins: [
      vue({
        template: {}
      }),
      copy({
        targets: [{ src: 'src/assets/Web.config', dest: 'dist' }],
        hook: 'writeBundle'
      }),
      // * vite 可以使用 jsx/tsx 语法
      vueJsx(),
      // * name 可以写在 script 标签上
      VueSetupExtend(),
      createSvgIconsPlugin({
        // 设置图标所在文件夹路径
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons/svg')],
        // 设置symbolId的格式
        symbolId: 'icon-[dir]-[name]'
        // （可选）自定义插入位置，默认为body末尾
        // inject: 'body-first',
        // （可选）自定义DOM节点ID，默认为__svg__icons__dom__
        // customDomId: '__my-custom-id__',
      })
    ],
    test: {
      environment: 'jsdom',
      setupFiles: 'vitest.setup.ts',
      coverage: {
        reporter: ['lcov', 'text', 'html', 'cobertura'],
        functions: 80,
        branches: 80,
        lines: 80,
        statements: 80
      }
    }
    // esbuild: {
    //   pure: ['console.log', 'debugger'],
    //   // pure: VITE_DROP_CONSOLE === 'true' ? ['console.log', 'debugger'] : [],
    //   supported: {
    //     // https://github.com/vitejs/vite/pull/8665
    //     'top-level-await': true
    //   }
    // }
  })
}
