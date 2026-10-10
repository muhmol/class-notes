import { useEffect, useState, useSyncExternalStore } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, liveNotes, type Course, type Note } from './db'

/** All courses, oldest first. `undefined` while the first read is loading. */
export function useCourses(): Course[] | undefined {
  return useLiveQuery(() => db.courses.orderBy('createdAt').toArray(), [])
}

/** All notes that are not deleted, newest first. */
export function useNotes(): Note[] | undefined {
  return useLiveQuery(() => liveNotes(), [])
}

/** Re-renders every `ms` so the "stamped at" clock stays current. */
export function useNow(ms = 15_000) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), ms)
    return () => clearInterval(id)
  }, [ms])
  return now
}

export function useOnline() {
  return useSyncExternalStore(
    (cb) => {
      window.addEventListener('online', cb)
      window.addEventListener('offline', cb)
      return () => {
        window.removeEventListener('online', cb)
        window.removeEventListener('offline', cb)
      }
    },
    () => navigator.onLine,
  )
}
