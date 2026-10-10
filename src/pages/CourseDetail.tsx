import { Link, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { setCourseArchived } from '../lib/db'
import { useCourses, useNotes } from '../lib/hooks'
import { updateSettings, useSettings } from '../lib/settings'
import { Icon } from '../components/Icon'
import { Timeline } from '../components/Timeline'

export default function CourseDetail() {
  const { id } = useParams()
  const { t } = useTranslation()
  const { lang } = useSettings()
  const navigate = useNavigate()
  const courses = useCourses()
  const notes = useNotes()

  if (!courses || !notes) return null
  const course = courses.find((c) => c.id === id)

  const back = (
    <Link to="/courses" className="btn-text -ms-2 gap-1.5">
      <Icon name="back" size={16} className={lang === 'fa' ? '' : 'rotate-180'} />
      {t('courses.back')}
    </Link>
  )

  if (!course) {
    return (
      <div className="space-y-4">
        {back}
        <p className="text-muted">{t('courses.notFound')}</p>
      </div>
    )
  }

  const own = notes.filter((n) => n.courseId === course.id)

  return (
    <div className="space-y-7">
      <div>
        {back}
        <h1 className="mt-1 text-[28px] font-extrabold leading-tight tracking-tight">{course.name}</h1>
        {course.teacher && <p className="text-muted">{course.teacher}</p>}
        <div className="mt-4 flex flex-wrap gap-2">
          {!course.archived && (
            <button
              className="btn-primary"
              onClick={() => {
                updateSettings({ lastCourseId: course.id })
                navigate('/')
              }}
            >
              <Icon name="plus" size={18} /> {t('courses.openHome')}
            </button>
          )}
          <button className="btn-soft" onClick={() => setCourseArchived(course.id, !course.archived)}>
            <Icon name={course.archived ? 'restore' : 'archive'} size={18} />
            {course.archived ? t('courses.unarchive') : t('courses.archive')}
          </button>
        </div>
      </div>

      {own.length === 0 ? <p className="text-muted">{t('courses.timelineEmpty')}</p> : <Timeline notes={own} />}
    </div>
  )
}
