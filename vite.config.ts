import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), '') }

  let vocdoniEnvironment = process.env.VOCDONI_ENVIRONMENT
  if (!vocdoniEnvironment) {
    vocdoniEnvironment = 'dev'
  }

  const outDir = process.env.BUILD_PATH || 'dist'
  const base = process.env.BASE_URL || '/'

  let pids = []
  try {
    pids = JSON.parse(process.env.PROCESS_IDS)
  } catch (e) {
    pids = ['88ef4916f98b38d2bc91b89928f78cbab3e4b1949e28787ec7a3020000000001']
  }

  return {
    base,
    build: { outDir },
    define: {
      'import.meta.env.VOCDONI_ENVIRONMENT': `"${vocdoniEnvironment}"`,
      'import.meta.env.PROCESS_IDS': JSON.stringify(pids),
    },
    plugins: [tsconfigPaths(), react()],
  }
})
