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
    pids = ['4ae20a8eb4caa52f5588f7bb9f3c6d6b7cf003a5b03f4589edea100000000290']
  }

  let demoMeta = {}
  try {
    demoMeta = JSON.parse(process.env.DEMO_META)
  } catch (e) {
    demoMeta = {
      orgName: 'Test Organization',
      mainTitle: 'General elections',
      date: new Date().setMonth(new Date().getMonth() + 2).toString(),
    }
  }

  return {
    base,
    build: { outDir },
    define: {
      'import.meta.env.VOCDONI_ENVIRONMENT': `"${vocdoniEnvironment}"`,
      'import.meta.env.PROCESS_IDS': JSON.stringify(pids),
      'import.meta.env.DEMO_META': JSON.stringify(pids),
    },
    plugins: [tsconfigPaths(), react()],
  }
})
