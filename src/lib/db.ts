import Dexie, { type EntityTable } from 'dexie'

// Every record carries a unique id and an updatedAt time from day one.
// That is what lets us add server sync later ("last edit wins") without
// migrating the data that users already wrote offline.

export type NoteKind = 'said' | 'did'

export interface Course {
  id: string
  name: string
  teacher?: string
  archived: boolean
  createdAt: number
  updatedAt: number
}

export interface Note {
  id: string
  courseId: string
  kind: NoteKind
  text: string
  createdAt: number
  updatedAt: number
  /** Soft delete: kept as a tombstone so a future sync can propagate it. */
  deletedAt?: number
}

class ClassNotesDB extends Dexie {
  courses!: EntityTable<Course, 'id'>
  notes!: EntityTable<Note, 'id'>

  constructor() {
    super('class-notes')
    this.version(1).stores({
      courses: 'id, archived, createdAt, updatedAt',
      notes: 'id, courseId, createdAt, updatedAt',
    })
  }
}

export const db = new ClassNotesDB()

const uid = () => crypto.randomUUID()

export async function addCourse(name: string, teacher?: string) {
  const now = Date.now()
  const course: Course = {
    id: uid(),
    name: name.trim(),
    teacher: teacher?.trim() || undefined,
    archived: false,
    createdAt: now,
    updatedAt: now,
  }
  await db.courses.add(course)
  return course
}

export async function setCourseArchived(id: string, archived: boolean) {
  await db.courses.update(id, { archived, updatedAt: Date.now() })
}

export async function addNote(courseId: string, kind: NoteKind, text: string) {
  const now = Date.now()
  const note: Note = { id: uid(), courseId, kind, text: text.trim(), createdAt: now, updatedAt: now }
  await db.notes.add(note)
  return note
}

export async function updateNote(id: string, text: string) {
  await db.notes.update(id, { text: text.trim(), updatedAt: Date.now() })
}

export async function deleteNote(id: string) {
  const now = Date.now()
  await db.notes.update(id, { deletedAt: now, updatedAt: now })
}

/** Notes that are not deleted, newest first. */
export async function liveNotes(): Promise<Note[]> {
  const all = await db.notes.orderBy('createdAt').reverse().toArray()
  return all.filter((n) => !n.deletedAt)
}
