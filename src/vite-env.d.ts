/// <reference types="vite/client" />

interface Window {
  ipcRenderer: {
    on: (...args: any[]) => void
    off: (...args: any[]) => void
    send: (...args: any[]) => void
    invoke: (...args: any[]) => void
    openFile: () => Promise<string | null>
  }
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
