import { dayKey, formatFullDay } from '../lib/dates'
import type { Note } from '../lib/db'
import { useSettings } from '../lib/settings'
import { NoteItem } from './NoteItem'

/** Notes grouped by calendar day, newest first. Pass `courseNames` to show the course on each note. */
export function Timeline({ notes, courseNames }: { notes: Note[]; courseNames?: Map<string, string> }) {
  const { lang } = useSettings()

  const groups: { key: string; ts: number; items: Note[] }[] = []
  for (const n of notes) {
    const key = dayKey(n.createdAt)
    const last = groups[groups.length - 1]
    if (last && last.key === key) last.items.push(n)
    else groups.push({ key, ts: n.createdAt, items: [n] })
  }

  return (
    <div className="space-y-7">
      {groups.map((g) => (
        <section key={g.key} aria-label={formatFullDay(g.ts, lang)}>
          <h3 className="mb-2.5 px-1 text-[14px] font-bold text-muted">{formatFullDay(g.ts, lang)}</h3>
          <ul className="space-y-2.5">
            {g.items.map((n) => (
              <NoteItem key={n.id} note={n} courseName={courseNames?.get(n.courseId)} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
