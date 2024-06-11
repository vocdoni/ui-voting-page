import { PublishedElection, VocdoniSDKClient } from '@vocdoni/sdk'
import { createContext, FC, PropsWithChildren, useContext, useState } from 'react'

type Processes = {
  [key: string]: PublishedElection
}

type ChainedContextState = {
  processes: Processes
  current: string | null
  client: VocdoniSDKClient
  root: PublishedElection
  setProcess: (id: string, process: PublishedElection) => void
  setCurrent: (id: string | null) => void
}

type ChainedProviderProps = {
  client: VocdoniSDKClient
  root: PublishedElection
}

const ChainedContext = createContext<ChainedContextState | undefined>(undefined)

export const ChainedProvider: FC<PropsWithChildren<ChainedProviderProps>> = ({ children, root, client }) => {
  const [processes, setProcesses] = useState<Processes>(root ? { [root.id]: root } : {})
  const [current, setCurrent] = useState<string | null>(root ? root.id : null)

  const setProcess = (id: string, process: PublishedElection) => {
    setProcesses((prev) => ({
      ...prev,
      [id]: process,
    }))
  }

  return (
    <ChainedContext.Provider value={{ processes, client, current, root, setProcess, setCurrent }}>
      {children}
    </ChainedContext.Provider>
  )
}

export const useChainedProcesses = () => {
  const context = useContext(ChainedContext)
  if (!context) {
    throw new Error('useProcesses must be used within a ProcessesProvider')
  }
  return context
}
