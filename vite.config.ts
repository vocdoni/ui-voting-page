import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
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

  let pids = []
  try {
    pids = JSON.parse(process.env.PROCESS_IDS)
  } catch (e) {
    pids = ['6be21a5a9dc024d3a8c1c4d403de7a56b56f925413109f414d51020400000007']
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
