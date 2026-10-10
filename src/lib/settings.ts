import { useSyncExternalStore } from 'react'
import i18n from './i18n'

export type Lang = 'fa' | 'en'
export type Theme = 'system' | 'light' | 'dark'

export interface Settings {
  lang: Lang
  theme: Theme
  /** Course used last, so it is preselected on the home page. */
  lastCourseId?: string
}

const KEY = 'cn:settings'

function read(): Settings {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '{}')
    return {
      lang: raw.lang === 'en' ? 'en' : 'fa',
      theme: raw.theme === 'light' || raw.theme === 'dark' ? raw.theme : 'system',
      lastCourseId: typeof raw.lastCourseId === 'string' ? raw.lastCourseId : undefined,
    }
  } catch {
    return { lang: 'fa', theme: 'system' }
  }
}

let state: Settings = read()
const listeners = new Set<() => void>()

export function applyToDocument(s: Settings) {
  const root = document.documentElement
  root.lang = s.lang
  root.dir = s.lang === 'fa' ? 'rtl' : 'ltr'
  if (s.theme === 'system') delete root.dataset.theme
  else root.dataset.theme = s.theme
  i18n.changeLanguage(s.lang)
}

export function updateSettings(patch: Partial<Settings>) {
  state = { ...state, ...patch }
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* storage can be unavailable (private mode); the app still works */
  }
  applyToDocument(state)
  listeners.forEach((l) => l())
}

export function useSettings(): Settings {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => state,
  )
}

export function initSettings() {
  applyToDocument(state)
}
