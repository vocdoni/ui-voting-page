import react from '@vitejs/plugin-react'
import { execSync } from 'node:child_process'
import { defineConfig, loadEnv } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'

import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), '') }

  let vocdoniEnvironment = process.env.VOCDONI_ENVIRONMENT
  if (!vocdoniEnvironment) {
    vocdoniEnvironment = 'stg'
  }

  const outDir = process.env.BUILD_PATH || 'dist'
  const base = process.env.BASE_URL || '/'
  const title = process.env.APP_TITLE || 'Vocdoni - The voice of digital voting'
  const commit = execSync('git rev-parse --short HEAD').toString()

  let pids = []
  try {
    pids = JSON.parse(process.env.PROCESS_IDS)
  } catch (e) {
    console.error('PROCESS_IDS not defined or invalid (must be a stringified JSON array)')
    pids = []
  }

  return {
    base,
    build: { outDir },
    define: {
      'import.meta.env.VOCDONI_ENVIRONMENT': `"${vocdoniEnvironment}"`,
      'import.meta.env.PROCESS_IDS': JSON.stringify(pids),
      'import.meta.env.CLIENT': JSON.stringify(process.env.CLIENT || 'default').toLowerCase(),
      'import.meta.env.STREAM_URL': JSON.stringify(process.env.STREAM_URL || ''),
    },
    plugins: [
      tsconfigPaths(),
      react(),
      createHtmlPlugin({
        template: 'index.html',
        minify: {
          removeComments: false,
          collapseWhitespace: true,
        },
        inject: {
          data: {
            commit: commit.trim(),
            title,
          },
        },
      }),
    ],
  }
})
