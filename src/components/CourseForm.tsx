import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { addCourse, type Course } from '../lib/db'

export function CourseForm({ onDone, onCancel }: { onDone: (c: Course) => void; onCancel: () => void }) {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [teacher, setTeacher] = useState('')

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onDone(await addCourse(name, teacher))
  }

  return (
    <form onSubmit={submit} className="card space-y-2.5 p-4">
      <input
        className="input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t('courses.namePlaceholder')}
        aria-label={t('courses.namePlaceholder')}
        autoFocus
        required
      />
      <input
        className="input"
        value={teacher}
        onChange={(e) => setTeacher(e.target.value)}
        placeholder={t('courses.teacherPlaceholder')}
        aria-label={t('courses.teacherPlaceholder')}
      />
      <div className="flex gap-2 pt-1">
        <button type="submit" className="btn-primary" disabled={!name.trim()}>
          {t('courses.create')}
        </button>
        <button type="button" className="btn-soft" onClick={onCancel}>
          {t('courses.cancel')}
        </button>
      </div>
    </form>
  )
}
