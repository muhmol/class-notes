import { beforeEach, describe, expect, it } from 'vitest'
import { addCourse, addNote, db, deleteNote, liveNotes, setCourseArchived, updateNote } from './db'

beforeEach(async () => {
  await db.courses.clear()
  await db.notes.clear()
})

describe('courses', () => {
  it('trims the name and teacher and starts active', async () => {
    const c = await addCourse('  Data Structures ', '  Dr. Ahmadi ')
    expect(c.name).toBe('Data Structures')
    expect(c.teacher).toBe('Dr. Ahmadi')
    expect(c.archived).toBe(false)
  })

  it('leaves the teacher empty when it is blank', async () => {
    const c = await addCourse('Algorithms', '   ')
    expect(c.teacher).toBeUndefined()
  })

  it('gets a unique id each time', async () => {
    const a = await addCourse('A')
    const b = await addCourse('B')
    expect(a.id).not.toBe(b.id)
  })

  it('archives and restores, bumping updatedAt', async () => {
    const c = await addCourse('Networks')
    await new Promise((r) => setTimeout(r, 5))
    await setCourseArchived(c.id, true)
    const archived = await db.courses.get(c.id)
    expect(archived?.archived).toBe(true)
    expect(archived!.updatedAt).toBeGreaterThan(c.updatedAt)

    await setCourseArchived(c.id, false)
    expect((await db.courses.get(c.id))?.archived).toBe(false)
  })
})

describe('notes', () => {
  it('stamps the time automatically and trims the text', async () => {
    const c = await addCourse('OS')
    const before = Date.now()
    const n = await addNote(c.id, 'said', '  exam is not from chapter 3  ')
    expect(n.text).toBe('exam is not from chapter 3')
    expect(n.createdAt).toBeGreaterThanOrEqual(before)
    expect(n.createdAt).toBeLessThanOrEqual(Date.now())
    expect(n.updatedAt).toBe(n.createdAt)
    expect(n.kind).toBe('said')
  })

  it('returns live notes newest first', async () => {
    const c = await addCourse('DB')
    const first = await addNote(c.id, 'said', 'first')
    await new Promise((r) => setTimeout(r, 5))
    const second = await addNote(c.id, 'did', 'second')
    const notes = await liveNotes()
    expect(notes.map((n) => n.id)).toEqual([second.id, first.id])
  })

  it('edits text and bumps updatedAt but keeps createdAt', async () => {
    const c = await addCourse('AI')
    const n = await addNote(c.id, 'did', 'draft')
    await new Promise((r) => setTimeout(r, 5))
    await updateNote(n.id, ' final ')
    const saved = await db.notes.get(n.id)
    expect(saved?.text).toBe('final')
    expect(saved?.createdAt).toBe(n.createdAt)
    expect(saved!.updatedAt).toBeGreaterThan(n.updatedAt)
  })

  it('deletes softly: hidden from the app, kept as a tombstone for sync', async () => {
    const c = await addCourse('Math')
    const n = await addNote(c.id, 'said', 'remove me')
    await deleteNote(n.id)

    expect((await liveNotes()).length).toBe(0)
    const tombstone = await db.notes.get(n.id)
    expect(tombstone?.deletedAt).toBeTypeOf('number')
  })

  it('keeps notes of an archived course', async () => {
    const c = await addCourse('Physics')
    await addNote(c.id, 'said', 'keep me')
    await setCourseArchived(c.id, true)
    expect((await liveNotes()).length).toBe(1)
  })
})
