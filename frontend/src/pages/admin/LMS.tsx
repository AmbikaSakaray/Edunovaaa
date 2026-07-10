import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { getCourses, createCourse, getAssignments, createAssignment, getSubjects } from '@/lib/api'

export default function AdminLMS() {
  const [courses, setCourses] = useState<any[]>([])
  const [assignments, setAssignments] = useState<any[]>([])
  const [subjects, setSubjects] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<'courses' | 'assignments'>('courses')
  const [showForm, setShowForm] = useState(false)
  const [courseForm, setCourseForm] = useState({ title: '', description: '', subject: '' })
  const [assignForm, setAssignForm] = useState({ title: '', description: '', course: '', due_date: '' })

  useEffect(() => {
    loadAll()
  }, [])

  async function loadAll() {
    setLoading(true)
    setError(null)
    try {
      const [c, a, s] = await Promise.all([
        getCourses(),
        getAssignments(),
        getSubjects().catch(() => [])
      ])
      setCourses(c)
      setAssignments(a)
      setSubjects(s)
    } catch (e: any) {
      setError(e?.message || 'Failed to load LMS data')
    } finally {
      setLoading(false)
    }
  }

  async function saveCourse() {
    setError(null)
    try {
      const res = await createCourse(courseForm)
      setCourses((prev) => [res, ...prev])
      setShowForm(false)
      setCourseForm({ title: '', description: '', subject: '' })
    } catch (e: any) { 
      setError(e?.message || 'Failed to save course') 
    }
  }

  async function saveAssignment() {
    setError(null)
    try {
      const res = await createAssignment(assignForm)
      setAssignments((prev) => [res, ...prev])
      setShowForm(false)
      setAssignForm({ title: '', description: '', course: '', due_date: '' })
    } catch (e: any) { 
      setError(e?.message || 'Failed to save assignment') 
    }
  }

  return (
    <>
      <PageHeader eyebrow="Admin" title="Learning Management" description="Manage courses, lessons and assignments." />

      <div className="mb-4 flex gap-2">
        <button onClick={() => { setTab('courses'); setShowForm(false) }} className={`rounded-md px-4 py-2 text-sm font-semibold ${tab === 'courses' ? 'bg-primary text-white' : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'}`}>Courses</button>
        <button onClick={() => { setTab('assignments'); setShowForm(false) }} className={`rounded-md px-4 py-2 text-sm font-semibold ${tab === 'assignments' ? 'bg-primary text-white' : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'}`}>Assignments</button>
        <button onClick={() => setShowForm(true)} className="ml-auto rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white">Add {tab === 'courses' ? 'Course' : 'Assignment'}</button>
      </div>

      {loading && <p className="text-sm text-slate-500">Loading…</p>}
      {error && <p className="text-sm text-red-600 font-semibold mb-3">{error}</p>}

      {showForm && tab === 'courses' && (
        <div className="mb-4 rounded-2xl bg-white p-6 shadow-card">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">Course Title</label>
              <input value={courseForm.title} onChange={(e) => setCourseForm(f => ({ ...f, title: e.target.value }))} placeholder="Course title" className="input" />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">Subject</label>
              <select value={courseForm.subject} onChange={(e) => setCourseForm(f => ({ ...f, subject: e.target.value }))} className="input">
                <option value="">Select Subject</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="mb-1 block text-xs font-semibold text-slate-500">Description</label>
              <textarea value={courseForm.description} onChange={(e) => setCourseForm(f => ({ ...f, description: e.target.value }))} placeholder="Description" className="input" rows={3} />
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={saveCourse} className="rounded-md bg-primary px-4 py-1.5 text-sm font-semibold text-white hover:bg-primary-600">Save</button>
            <button onClick={() => setShowForm(false)} className="rounded-md border border-slate-300 px-4 py-1.5 text-slate-700 hover:bg-slate-50">Cancel</button>
          </div>
        </div>
      )}

      {showForm && tab === 'assignments' && (
        <div className="mb-4 rounded-2xl bg-white p-6 shadow-card">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">Assignment Title</label>
              <input value={assignForm.title} onChange={(e) => setAssignForm(f => ({ ...f, title: e.target.value }))} placeholder="Assignment title" className="input" />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">Course</label>
              <select value={assignForm.course} onChange={(e) => setAssignForm(f => ({ ...f, course: e.target.value }))} className="input">
                <option value="">Select Course</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">Due Date</label>
              <input type="date" value={assignForm.due_date} onChange={(e) => setAssignForm(f => ({ ...f, due_date: e.target.value }))} className="input" />
            </div>

            <div className="col-span-2">
              <label className="mb-1 block text-xs font-semibold text-slate-500">Description</label>
              <textarea value={assignForm.description} onChange={(e) => setAssignForm(f => ({ ...f, description: e.target.value }))} placeholder="Description" className="input" rows={3} />
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={saveAssignment} className="rounded-md bg-primary px-4 py-1.5 text-sm font-semibold text-white hover:bg-primary-600">Save</button>
            <button onClick={() => setShowForm(false)} className="rounded-md border border-slate-300 px-4 py-1.5 text-slate-700 hover:bg-slate-50">Cancel</button>
          </div>
        </div>
      )}

      <div className="rounded-2xl bg-white p-4 shadow-card">
        {tab === 'courses' && (
          <table className="w-full table-auto">
            <thead><tr className="text-left text-sm text-slate-500"><th className="px-3 py-2">Title</th><th className="px-3 py-2">Subject</th></tr></thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-3 py-3 font-medium text-slate-900">{c.title}</td>
                  <td className="px-3 py-3 text-slate-600">{c.subject_name || c.subject}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {tab === 'assignments' && (
          <table className="w-full table-auto">
            <thead><tr className="text-left text-sm text-slate-500"><th className="px-3 py-2">Title</th><th className="px-3 py-2">Course</th><th className="px-3 py-2">Due Date</th></tr></thead>
            <tbody>
              {assignments.map((a) => (
                <tr key={a.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-3 py-3 font-medium text-slate-900">{a.title}</td>
                  <td className="px-3 py-3 text-slate-600">{a.course_name || a.course}</td>
                  <td className="px-3 py-3 text-slate-500">{a.due_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}
