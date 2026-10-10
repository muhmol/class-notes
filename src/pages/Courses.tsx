import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { setCourseArchived, type Course } from '../lib/db'
import { useCourses, useNotes } from '../lib/hooks'
import { updateSettings } from '../lib/settings'
import { CourseForm } from '../components/CourseForm'
import { Icon } from '../components/Icon'

function CourseRow({ course, count }: { course: Course; count: number }) {
  const { t } = useTranslation()
  return (
    <li className="card flex items-center gap-2 p-2 ps-4">
      <Link to={`/courses/${course.id}`} className="min-w-0 flex-1 rounded-xl py-2">
        <span className="block truncate text-[17px] font-bold">{course.name}</span>
        <span className="block truncate text-[13px] text-muted">
          {[course.teacher, t('courses.count', { count })].filter(Boolean).join(' · ')}
        </span>
      </Link>
      <button
        className="btn-text gap-1.5"
        onClick={() => setCourseArchived(course.id, !course.archived)}
        aria-label={`${course.archived ? t('courses.unarchive') : t('courses.archive')}: ${course.name}`}
      >
        <Icon name={course.archived ? 'restore' : 'archive'} size={18} />
        <span className="hidden sm:inline">{course.archived ? t('courses.unarchive') : t('courses.archive')}</span>
      </button>
    </li>
  )
}

export default function Courses() {
  const { t } = useTranslation()
  const courses = useCourses()
  const notes = useNotes()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const [adding, setAdding] = useState(params.get('new') === '1')

  const counts = useMemo(() => {
    const m = new Map<string, number>()
    for (const n of notes ?? []) m.set(n.courseId, (m.get(n.courseId) ?? 0) + 1)
    return m
  }, [notes])

  if (!courses) return null
  const active = courses.filter((c) => !c.archived).reverse()
  const archived = courses.filter((c) => c.archived).reverse()

  const closeForm = () => {
    setAdding(false)
    if (params.has('new')) setParams({}, { replace: true })
  }

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between gap-3">
        <h1 className="text-[28px] font-extrabold tracking-tight">{t('courses.title')}</h1>
        {!adding && (
          <button className="btn-primary" onClick={() => setAdding(true)}>
            <Icon name="plus" size={18} /> {t('courses.add')}
          </button>
        )}
      </header>

      {adding && (
        <CourseForm
          onCancel={closeForm}
          onDone={(c) => {
            updateSettings({ lastCourseId: c.id })
            closeForm()
            // Straight to writing: the new course is already selected on Home.
            if (courses.length === 0) navigate('/')
          }}
        />
      )}

      <section aria-label={t('courses.active')}>
        {active.length === 0 ? (
          !adding && <p className="px-1 text-muted">{t('courses.empty')}</p>
        ) : (
          <ul className="space-y-2.5">
            {active.map((c) => (
              <CourseRow key={c.id} course={c} count={counts.get(c.id) ?? 0} />
            ))}
          </ul>
        )}
      </section>

      {archived.length > 0 && (
        <section aria-label={t('courses.archived')}>
          <h2 className="mb-3 px-1 text-[15px] font-bold text-muted">{t('courses.archived')}</h2>
          <ul className="space-y-2.5 opacity-80">
            {archived.map((c) => (
              <CourseRow key={c.id} course={c} count={counts.get(c.id) ?? 0} />
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
