import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { daysAgo, startOfToday } from '../lib/dates'
import type { NoteKind } from '../lib/db'
import { useCourses, useNotes } from '../lib/hooks'
import { Icon } from '../components/Icon'
import { Timeline } from '../components/Timeline'

type Range = 'all' | 'today' | 'week' | 'month'
const ranges: Range[] = ['all', 'today', 'week', 'month']

function since(range: Range) {
  if (range === 'today') return startOfToday()
  if (range === 'week') return daysAgo(6)
  if (range === 'month') return daysAgo(29)
  return 0
}

export default function Review() {
  const { t } = useTranslation()
  const courses = useCourses()
  const notes = useNotes()
  const [courseId, setCourseId] = useState('')
  const [kind, setKind] = useState<'' | NoteKind>('')
  const [range, setRange] = useState<Range>('all')
  const [query, setQuery] = useState('')

  const names = useMemo(() => new Map((courses ?? []).map((c) => [c.id, c.name])), [courses])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const from = since(range)
    return (notes ?? []).filter(
      (n) =>
        (!courseId || n.courseId === courseId) &&
        (!kind || n.kind === kind) &&
        n.createdAt >= from &&
        (!q || n.text.toLowerCase().includes(q)),
    )
  }, [notes, courseId, kind, range, query])

  if (!courses || !notes) return null

  return (
    <div className="space-y-6">
      <h1 className="text-[28px] font-extrabold tracking-tight">{t('review.title')}</h1>

      {notes.length === 0 ? (
        <p className="text-muted">{t('review.empty')}</p>
      ) : (
        <>
          <div className="space-y-3">
            <label className="relative block">
              <Icon name="search" size={18} className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="search"
                className="input ps-10"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('review.search')}
                aria-label={t('review.search')}
              />
            </label>

            <div className="grid grid-cols-2 gap-2">
              <select className="input" value={courseId} onChange={(e) => setCourseId(e.target.value)} aria-label={t('home.course')}>
                <option value="">{t('review.allCourses')}</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <select className="input" value={kind} onChange={(e) => setKind(e.target.value as '' | NoteKind)} aria-label={t('review.allKinds')}>
                <option value="">{t('review.allKinds')}</option>
                <option value="said">{t('kind.said')}</option>
                <option value="did">{t('kind.did')}</option>
              </select>
            </div>

            <div role="radiogroup" className="flex flex-wrap gap-2">
              {ranges.map((r) => (
                <button
                  key={r}
                  role="radio"
                  aria-checked={range === r}
                  onClick={() => setRange(r)}
                  className={[
                    'min-h-9 cursor-pointer rounded-full border px-3.5 text-[13px] font-semibold transition-colors',
                    range === r ? 'border-ink bg-ink text-bg' : 'border-line bg-surface text-muted hover:text-ink',
                  ].join(' ')}
                >
                  {t(`review.range.${r}`)}
                </button>
              ))}
            </div>
          </div>

          <p className="px-1 text-[13px] text-muted" aria-live="polite">
            {t('review.results', { count: filtered.length })}
          </p>

          {filtered.length === 0 ? (
            <p className="text-muted">{t('review.noResults')}</p>
          ) : (
            <Timeline notes={filtered} courseNames={names} />
          )}
        </>
      )}
    </div>
  )
}
