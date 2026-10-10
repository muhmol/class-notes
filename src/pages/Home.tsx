import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { addNote, type NoteKind } from '../lib/db'
import { formatDay, formatTime } from '../lib/dates'
import { useCourses, useNotes, useNow } from '../lib/hooks'
import { updateSettings, useSettings } from '../lib/settings'
import { Icon } from '../components/Icon'
import { NoteItem } from '../components/NoteItem'

export default function Home() {
  const { t } = useTranslation()
  const { lang, lastCourseId } = useSettings()
  const courses = useCourses()
  const notes = useNotes()
  const now = useNow()

  const [kind, setKind] = useState<NoteKind>('said')
  const [text, setText] = useState('')
  const [justSaved, setJustSaved] = useState(false)
  const area = useRef<HTMLTextAreaElement>(null)

  // Active courses, the one used most recently first.
  const active = useMemo(() => {
    const lastUsed = new Map<string, number>()
    for (const n of notes ?? []) if (!lastUsed.has(n.courseId)) lastUsed.set(n.courseId, n.createdAt)
    return (courses ?? [])
      .filter((c) => !c.archived)
      .sort((a, b) => (lastUsed.get(b.id) ?? b.createdAt) - (lastUsed.get(a.id) ?? a.createdAt))
  }, [courses, notes])

  const selected = active.find((c) => c.id === lastCourseId) ?? active[0]
  const recent = (notes ?? []).filter((n) => n.courseId === selected?.id).slice(0, 5)

  if (!courses || !notes) return null

  if (active.length === 0) {
    return (
      <div className="card mt-6 p-7 text-center">
        <h1 className="text-[22px] font-extrabold">{t('home.emptyTitle')}</h1>
        <p className="mx-auto mt-2 max-w-sm text-muted">{t('home.emptyBody')}</p>
        <Link to="/courses?new=1" className="btn-primary mt-5">
          <Icon name="plus" size={18} /> {t('home.addFirst')}
        </Link>
      </div>
    )
  }

  const canSave = !!selected && text.trim().length > 0

  const save = async () => {
    if (!canSave || !selected) return
    await addNote(selected.id, kind, text)
    setText('')
    setJustSaved(true)
    setTimeout(() => setJustSaved(false), 1400)
    area.current?.focus()
  }

  return (
    <div className="space-y-8">
      {/* Course switcher: the last used course is already selected. */}
      <div
        role="radiogroup"
        aria-label={t('home.course')}
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0"
      >
        {active.map((c) => {
          const on = c.id === selected?.id
          return (
            <button
              key={c.id}
              role="radio"
              aria-checked={on}
              onClick={() => updateSettings({ lastCourseId: c.id })}
              className={[
                'min-h-10 shrink-0 cursor-pointer rounded-full border px-4 text-[14px] font-semibold transition-colors',
                on ? 'border-ink bg-ink text-bg' : 'border-line bg-surface text-muted hover:text-ink',
              ].join(' ')}
            >
              {c.name}
            </button>
          )
        })}
      </div>

      {/* The composer: the thing the whole app exists for. */}
      <section className="card p-4 md:p-5" aria-label={t('home.save')}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] leading-5 text-muted sm:order-last sm:text-end" aria-live="off">
            <span>{t('home.stampLabel')}: </span>
            <span className="whitespace-nowrap font-bold text-ink">
              <bdi>{formatTime(now, lang)}</bdi> · <bdi>{formatDay(now, lang)}</bdi>
            </span>
          </p>
          <div role="radiogroup" className="flex rounded-xl bg-sunken p-1">
            {(['said', 'did'] as const).map((k) => (
              <button
                key={k}
                role="radio"
                aria-checked={kind === k}
                onClick={() => setKind(k)}
                className={[
                  'min-h-9 flex-1 cursor-pointer whitespace-nowrap rounded-lg px-3.5 text-[14px] font-bold transition-colors sm:flex-none',
                  kind === k
                    ? k === 'said'
                      ? 'bg-said text-white'
                      : 'bg-did text-white dark:text-[#06231c]'
                    : 'text-muted hover:text-ink',
                ].join(' ')}
              >
                {t(`kind.${k}`)}
              </button>
            ))}
          </div>
        </div>

        <textarea
          ref={area}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
              e.preventDefault()
              save()
            }
          }}
          placeholder={kind === 'said' ? t('home.placeholderSaid') : t('home.placeholderDid')}
          aria-label={kind === 'said' ? t('home.placeholderSaid') : t('home.placeholderDid')}
          rows={4}
          dir={text ? 'auto' : undefined}
          autoFocus
          className="mt-4 block w-full resize-none rounded-2xl bg-transparent text-[19px] leading-9 text-ink placeholder:text-muted focus:outline-none"
        />

        <div className="mt-2 flex items-center justify-between gap-3">
          <span className="hidden text-[13px] text-muted md:inline">{t('home.shortcut')}</span>
          <button className="btn-primary ms-auto min-w-40" onClick={save} disabled={!canSave}>
            {justSaved ? (
              <>
                <Icon name="check" size={18} /> {t('home.saved')}
              </>
            ) : (
              t('home.save')
            )}
          </button>
        </div>
      </section>

      <section aria-label={t('home.recent')}>
        <h2 className="mb-3 px-1 text-[15px] font-bold text-muted">{t('home.recent')}</h2>
        {recent.length === 0 ? (
          <p className="px-1 text-muted">{t('home.noNotes')}</p>
        ) : (
          <ul className="space-y-2.5">
            {recent.map((n) => (
              <NoteItem key={n.id} note={n} />
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
