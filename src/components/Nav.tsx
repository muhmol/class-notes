import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Icon, type IconName } from './Icon'

const items: { to: string; key: string; icon: IconName }[] = [
  { to: '/', key: 'home', icon: 'home' },
  { to: '/courses', key: 'courses', icon: 'courses' },
  { to: '/review', key: 'review', icon: 'review' },
  { to: '/settings', key: 'settings', icon: 'settings' },
]

/** Bottom bar on phones, a centered pill at the top on larger screens. */
export function Nav() {
  const { t } = useTranslation()
  return (
    <nav
      aria-label={t('appName')}
      className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-20 mx-auto max-w-[680px] md:bottom-auto md:top-5"
    >
      <ul className="flex items-center justify-between gap-1 rounded-[22px] border border-line bg-surface/85 p-1.5 shadow-[0_8px_30px_-12px_rgba(18,20,28,0.25)] backdrop-blur-xl md:justify-center md:gap-2">
        {items.map(({ to, key, icon }) => (
          <li key={to} className="flex-1 md:flex-none">
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                [
                  'flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-2xl px-3 text-[12px] font-semibold transition-colors',
                  'md:min-h-10 md:flex-row md:gap-2 md:px-5 md:text-[14px]',
                  isActive ? 'bg-ink text-bg' : 'text-muted hover:text-ink',
                ].join(' ')
              }
            >
              <Icon name={icon} size={20} />
              <span>{t(`nav.${key}`)}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
