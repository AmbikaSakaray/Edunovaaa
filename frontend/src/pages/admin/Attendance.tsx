import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { postAttendance, getStudents, getSections } from '@/lib/api'

export default function AdminAttendance() {
  const [form, setForm] = useState({ student: '', section: '', date: '', status: 'Present', remarks: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [students, setStudents] = useState<any[]>([])
  const [sections, setSections] = useState<any[]>([])

  useEffect(() => {
    getStudents().then(setStudents).catch(() => {})
    getSections().then(setSections).catch(() => {})
  }, [])

  async function submit() {
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      await postAttendance(form)
      setSuccess('Attendance recorded successfully')
    } catch (e: any) {
      setError(e?.message || 'Failed to submit attendance')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageHeader eyebrow="Admin" title="Attendance" description="Mark attendance for students" />
      <div className="rounded-2xl bg-white p-6 shadow-card">
        {error && <p className="mb-3 text-sm text-red-600 font-semibold">{error}</p>}
        {success && <p className="mb-3 text-sm text-green-600 font-semibold">{success}</p>}
        
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">Student</label>
            <select value={form.student} onChange={(e) => setForm((f) => ({ ...f, student: e.target.value }))} className="input">
              <option value="">Select Student</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>{s.first_name} {s.last_name} ({s.admission_no})</option>
              ))}
            </select>
          </div>

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
            <label className="mb-1 block text-xs font-semibold text-slate-500">Date</label>
            <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} className="input" />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">Status</label>
            <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className="input">
              <option>Present</option>
              <option>Absent</option>
              <option>Late</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-slate-500">Remarks</label>
            <input value={form.remarks} onChange={(e) => setForm((f) => ({ ...f, remarks: e.target.value }))} placeholder="Remarks" className="input" />
          </div>
        </div>

        <div className="mt-4">
          <button onClick={submit} disabled={loading} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600 disabled:opacity-60">
            {loading ? 'Submitting…' : 'Submit'}
          </button>
        </div>
      </div>
    </>
  )
}
