import { useSyncExternalStore } from 'react'
import { registerSW } from 'virtual:pwa-register'

// --- Offline readiness (service worker finished caching the app) ---
let offlineReady = false
const readyListeners = new Set<() => void>()

export function initPwa() {
  registerSW({
    immediate: true,
    onOfflineReady() {
      offlineReady = true
      readyListeners.forEach((l) => l())
    },
  })
}

export function useOfflineReady() {
  return useSyncExternalStore(
    (cb) => {
      readyListeners.add(cb)
      return () => readyListeners.delete(cb)
    },
    () => offlineReady,
  )
}

// --- Install prompt ---
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

let deferred: BeforeInstallPromptEvent | null = null
const installListeners = new Set<() => void>()
const emitInstall = () => installListeners.forEach((l) => l())

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  deferred = e as BeforeInstallPromptEvent
  emitInstall()
})
window.addEventListener('appinstalled', () => {
  deferred = null
  emitInstall()
})

export const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches || (navigator as { standalone?: boolean }).standalone === true

export function useCanInstall() {
  return useSyncExternalStore(
    (cb) => {
      installListeners.add(cb)
      return () => installListeners.delete(cb)
    },
    () => deferred !== null,
  )
}

export async function promptInstall() {
  if (!deferred) return
  await deferred.prompt()
  await deferred.userChoice
  deferred = null
  emitInstall()
}
