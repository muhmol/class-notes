import { describe, expect, it } from 'vitest'
import { dayKey, formatDay, formatFullDay, formatTime } from './dates'

// 2026-10-10 12:00 UTC is Saturday 10 October 2026, which is 18 Mehr 1405 in the Persian calendar.
const ts = Date.UTC(2026, 9, 10, 12, 0)

describe('date formatting', () => {
  it('shows the Persian calendar when the language is Persian', () => {
    const out = formatFullDay(ts, 'fa')
    expect(out).toContain('مهر')
    expect(out).toContain('۱۴۰۵')
  })

  it('shows the Gregorian calendar when the language is English', () => {
    const out = formatFullDay(ts, 'en')
    expect(out).toContain('October')
    expect(out).toContain('2026')
  })

  it('formats the day without a year', () => {
    expect(formatDay(ts, 'en')).not.toContain('2026')
    expect(formatDay(ts, 'fa')).toContain('مهر')
  })

  it('formats time as 24-hour hh:mm in both languages', () => {
    expect(formatTime(ts, 'en')).toMatch(/^\d{2}:\d{2}$/)
    // Persian output uses Persian digits.
    expect(formatTime(ts, 'fa')).toMatch(/^[۰-۹]{2}:[۰-۹]{2}$/)
  })
})

describe('dayKey', () => {
  it('is equal for two times on the same local day', () => {
    const a = new Date(2026, 9, 10, 8, 0).getTime()
    const b = new Date(2026, 9, 10, 23, 59).getTime()
    expect(dayKey(a)).toBe(dayKey(b))
  })

  it('differs across days', () => {
    const a = new Date(2026, 9, 10, 23, 59).getTime()
    const b = new Date(2026, 9, 11, 0, 1).getTime()
    expect(dayKey(a)).not.toBe(dayKey(b))
  })
})
