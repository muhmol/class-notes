import type { Lang } from './settings'

// Times are stored as plain epoch milliseconds (timezone neutral) and only
// *displayed* as Persian (Jalali) or Gregorian. That keeps data identical
// across devices, which matters once sync exists.

const locale = (lang: Lang) => (lang === 'fa' ? 'fa-IR-u-ca-persian' : 'en-US')

export function formatTime(ts: number, lang: Lang) {
  return new Intl.DateTimeFormat(locale(lang), { hour: '2-digit', minute: '2-digit', hour12: false }).format(ts)
}

export function formatDay(ts: number, lang: Lang) {
  return new Intl.DateTimeFormat(locale(lang), { weekday: 'long', day: 'numeric', month: 'long' }).format(ts)
}

export function formatFullDay(ts: number, lang: Lang) {
  return new Intl.DateTimeFormat(locale(lang), {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(ts)
}

/** Local calendar day key, used to group notes by day. */
export function dayKey(ts: number) {
  const d = new Date(ts)
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

export function startOfToday() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

export function daysAgo(n: number) {
  return startOfToday() - n * 86_400_000
}
