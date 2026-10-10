import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { deleteNote, updateNote, type Note } from '../lib/db'
import { formatTime } from '../lib/dates'
import { useSettings } from '../lib/settings'
import { Icon } from './Icon'

export function KindChip({ kind }: { kind: Note['kind'] }) {
  const { t } = useTranslation()
  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-bold',
        kind === 'said' ? 'bg-said-tint text-said' : 'bg-did-tint text-did',
      ].join(' ')}
    >
      {t(`kind.${kind}`)}
    </span>
  )
}

export function NoteItem({ note, courseName }: { note: Note; courseName?: string }) {
  const { t } = useTranslation()
  const { lang } = useSettings()
  const [editing, setEditing] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [draft, setDraft] = useState(note.text)

  const save = async () => {
    if (draft.trim() && draft.trim() !== note.text) await updateNote(note.id, draft)
    setEditing(false)
  }

  return (
    <li className="card p-4">
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
        <KindChip kind={note.kind} />
        {courseName && <span className="text-[13px] font-semibold text-ink">{courseName}</span>}
        <span className="ms-auto text-[13px] tabular-nums text-muted">
          {formatTime(note.createdAt, lang)}
          {note.updatedAt - note.createdAt > 1000 && <span> · {t('note.edited')}</span>}
        </span>
      </div>

      {editing ? (
        <div className="mt-3 space-y-2">
          <textarea
            className="input min-h-24 resize-y"
            dir="auto"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            autoFocus
            aria-label={t('note.edit')}
          />
          <div className="flex gap-2">
            <button className="btn-primary" onClick={save} disabled={!draft.trim()}>
              {t('note.save')}
            </button>
            <button
              className="btn-soft"
              onClick={() => {
                setDraft(note.text)
                setEditing(false)
              }}
            >
              {t('note.cancel')}
            </button>
          </div>
        </div>
      ) : (
        <p dir="auto" className="mt-2 whitespace-pre-wrap break-words text-start text-[16px] leading-8 text-ink">
          {note.text}
        </p>
      )}

      {!editing && (
        <div className="mt-2 flex items-center gap-1 text-muted">
          {confirming ? (
            <>
              <span className="me-1 text-sm text-ink">{t('note.confirmDelete')}</span>
              <button className="btn-text !text-danger" onClick={() => deleteNote(note.id)}>
                {t('note.yesDelete')}
              </button>
              <button className="btn-text" onClick={() => setConfirming(false)}>
                {t('note.cancel')}
              </button>
            </>
          ) : (
            <>
              <button
                className="btn-text gap-1.5"
                onClick={() => {
                  setDraft(note.text)
                  setEditing(true)
                }}
              >
                <Icon name="edit" size={16} /> {t('note.edit')}
              </button>
              <button className="btn-text gap-1.5" onClick={() => setConfirming(true)}>
                <Icon name="trash" size={16} /> {t('note.delete')}
              </button>
            </>
          )}
        </div>
      )}
    </li>
  )
}
