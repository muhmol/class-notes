import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useOnline } from '../lib/hooks'
import { isStandalone, promptInstall, useCanInstall, useOfflineReady } from '../lib/pwa'
import { updateSettings, useSettings, type Lang, type Theme } from '../lib/settings'

function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T
  options: { value: T; label: string }[]
  onChange: (v: T) => void
  label: string
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex rounded-xl bg-sunken p-1">
      {options.map((o) => (
        <button
          key={o.value}
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={[
            'min-h-10 flex-1 cursor-pointer rounded-lg px-3 text-[14px] font-bold transition-colors',
            value === o.value ? 'bg-surface text-ink shadow-sm' : 'text-muted hover:text-ink',
          ].join(' ')}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="card space-y-3 p-4 md:p-5">
      <h2 className="text-[16px] font-extrabold">{title}</h2>
      {children}
    </section>
  )
}

export default function Settings() {
  const { t } = useTranslation()
  const { lang, theme } = useSettings()
  const online = useOnline()
  const canInstall = useCanInstall()
  const offlineReady = useOfflineReady()
  const installed = isStandalone()

  return (
    <div className="space-y-4">
      <h1 className="mb-2 text-[28px] font-extrabold tracking-tight">{t('settings.title')}</h1>

      <Block title={t('settings.language')}>
        <Segmented<Lang>
          label={t('settings.language')}
          value={lang}
          onChange={(v) => updateSettings({ lang: v })}
          options={[
            { value: 'fa', label: 'فارسی' },
            { value: 'en', label: 'English' },
          ]}
        />
      </Block>

      <Block title={t('settings.theme')}>
        <Segmented<Theme>
          label={t('settings.theme')}
          value={theme}
          onChange={(v) => updateSettings({ theme: v })}
          options={[
            { value: 'system', label: t('settings.themes.system') },
            { value: 'light', label: t('settings.themes.light') },
            { value: 'dark', label: t('settings.themes.dark') },
          ]}
        />
      </Block>

      <Block title={t('settings.install')}>
        {installed ? (
          <p className="text-muted">{t('settings.installed')}</p>
        ) : (
          <>
            <p className="text-muted">{t('settings.installBody')}</p>
            {canInstall ? (
              <button className="btn-primary" onClick={promptInstall}>
                {t('settings.installButton')}
              </button>
            ) : (
              <p className="text-[14px] text-muted">{t('settings.installManual')}</p>
            )}
          </>
        )}
      </Block>

      <Block title={t('settings.sync')}>
        <p className="inline-flex items-center rounded-full bg-sunken px-3 py-1 text-[13px] font-bold">
          {t('settings.syncStatus')}
        </p>
        <p className="text-muted">{t('settings.syncBody')}</p>
      </Block>

      <Block title={t('settings.connection')}>
        <p className="flex items-center gap-2 font-semibold">
          <span className={['inline-block size-2.5 rounded-full', online ? 'bg-did' : 'bg-muted'].join(' ')} />
          {online ? t('settings.online') : t('settings.offline')}
        </p>
        {offlineReady && <p className="text-[14px] text-muted">{t('settings.offlineReady')}</p>}
      </Block>
    </div>
  )
}
