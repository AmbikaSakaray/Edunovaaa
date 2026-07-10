import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { createTimetable, getSections, getSubjects, getUsers } from '@/lib/api'

export default function AdminTimetable() {
  const [form, setForm] = useState({ section: '', subject: '', teacher: '', day_of_week: 'Monday', period_start: '09:00', period_end: '09:45' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [sections, setSections] = useState<any[]>([])
  const [subjects, setSubjects] = useState<any[]>([])
  const [teachers, setTeachers] = useState<any[]>([])

  useEffect(() => {
    getSections().then(setSections).catch(() => {})
    getSubjects().then(setSubjects).catch(() => {})
    getUsers()
      .then((data) => {
        if (Array.isArray(data)) {
          setTeachers(data.filter((u: any) => u.role === 'Teacher'))
        }
      })
      .catch(() => {})
  }, [])

  async function submit() {
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const payload = { ...form, period_start: `${form.period_start}:00`, period_end: `${form.period_end}:00` }
      await createTimetable(payload)
      setSuccess('Timetable entry created successfully')
    } catch (e: any) {
      setError(e?.message || 'Failed to create timetable entry')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageHeader eyebrow="Admin" title="Timetable" description="Create timetable entries and check conflicts" />
      <div className="rounded-2xl bg-white p-6 shadow-card">
        {error && <p className="mb-3 text-sm text-red-600 font-semibold">{error}</p>}
        {success && <p className="mb-3 text-sm text-green-600 font-semibold">{success}</p>}
        
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">Section</label>
            <select value={form.section} onChange={(e) => setForm((f) => ({ ...f, section: e.target.value }))} className="input">
              <option value="">Select Section</option>
              {sections.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">Subject</label>
            <select value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} className="input">
              <option value="">Select Subject</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">Teacher</label>
            <select value={form.teacher} onChange={(e) => setForm((f) => ({ ...f, teacher: e.target.value }))} className="input">
              <option value="">Select Teacher</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>{t.username} ({t.email})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">Day of Week</label>
            <select value={form.day_of_week} onChange={(e) => setForm((f) => ({ ...f, day_of_week: e.target.value }))} className="input">
              <option>Monday</option>
              <option>Tuesday</option>
              <option>Wednesday</option>
              <option>Thursday</option>
              <option>Friday</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">Period Start Time</label>
            <input type="time" value={form.period_start} onChange={(e) => setForm((f) => ({ ...f, period_start: e.target.value }))} className="input" />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">Period End Time</label>
            <input type="time" value={form.period_end} onChange={(e) => setForm((f) => ({ ...f, period_end: e.target.value }))} className="input" />
          </div>
        </div>

        <div className="mt-4">
          <button onClick={submit} disabled={loading} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600 disabled:opacity-60">
            {loading ? 'Creating…' : 'Create'}
          </button>
        </div>
      </div>
    </>
  )
}
