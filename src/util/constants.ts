const evocdoni = import.meta.env.VOCDONI_ENVIRONMENT
let app = 'https://app.vocdoni.io'
let explorer = 'https://explorer.vote'
if (['stg', 'dev'].includes(evocdoni)) {
  explorer = `https://${evocdoni}.explorer.vote`
  app = `https://app-${evocdoni}.vocdoni.io`
}

export const ExplorerBaseURL = explorer
export const VocdoniAppURL = app
export const VocdoniEnvironment = evocdoni
export const ProcessIds = import.meta.env.PROCESS_IDS
export const DemoMeta = import.meta.env.DEMO_META
