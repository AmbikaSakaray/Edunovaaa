import { useState } from 'react'
import { CheckCircle2, FileText, MessageSquare, Send, UserPlus } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Reveal } from '@/components/ui/Reveal'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { academicPrograms } from '@/data/content'
import { useForm } from 'react-hook-form'
import { createAdmission } from '@/lib/api'

const steps = [
  {
    icon: FileText,
    title: 'Submit enquiry',
    body: 'Tell us about your child and the program you would like to explore.',
  },
  {
    icon: MessageSquare,
    title: 'Campus interaction',
    body: 'Meet our team, experience the campus and see how learners thrive at EduNova.',
  },
  {
    icon: UserPlus,
    title: 'Registration',
    body: 'Complete a simple registration process with clear guidance and support.',
  },
  {
    icon: CheckCircle2,
    title: 'Confirmation',
    body: 'Get your admission confirmation and start planning the next step.',
  },
]

export default function Admissions() {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      parent_name: '',
      parent_phone: '',
      parent_email: '',
      program_of_interest: '',
    }
  })

  async function onSubmit(data: any) {
    setLoading(true)
    setError(null)
    try {
      const payload = {
        registration_number: `REG-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
        applicant_first_name: data.parent_name + " Child",
        applicant_last_name: "Enquiry",
        parent_name: data.parent_name,
        parent_phone: data.parent_phone,
        parent_email: data.parent_email,
        admission_source: `Program of Interest: ${data.program_of_interest}`,
        status: 'Submitted',
      }
      await createAdmission(payload)
      setSubmitted(true)
    } catch (e: any) {
      setError(e?.message || 'Failed to submit enquiry')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Admissions"
        title="Start a future-ready learning journey"
        description="Admissions are open for Pre Primary through Senior Secondary. Discover the programs, campus experience and support that make EduNova a school of choice."
      />

      <section className="tint-orange py-16">
        <div className="container-page">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 90}>
                <div className="relative h-full rounded-2xl border border-ink/5 bg-surface p-6">
                  <span className="font-num text-4xl font-bold text-primary-100">
                    0{i + 1}
                  </span>
                  <div className="mt-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white">
                    <step.icon size={20} />
                  </div>
                  <h3 className="mt-4 font-sub text-base font-bold text-ink">{step.title}</h3>
                  <p className="mt-2 font-body text-sm leading-relaxed text-ink-soft">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="divider-gradient" />

      <section className="tint-gold py-16">
        <div className="container-page grid grid-cols-1 gap-14 lg:grid-cols-2">
          <Reveal>
            <Eyebrow>Programs open for admission</Eyebrow>
            <h2 className="mt-5 font-display text-3xl font-bold text-ink">
              Choose the right program
            </h2>
            <p className="mt-4 font-body text-ink-soft">
              Programs are open across curricula and grade levels with a focus on STEAM, leadership and global readiness.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {academicPrograms.map((p) => (
                <span
                  key={p}
                  className="rounded-full border border-primary/25 bg-primary/15 px-4 py-2 text-sm font-semibold text-white shadow-card"
                >
                  {p}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-md p-8 shadow-card">
              {submitted ? (
                <div className="flex flex-col items-center py-10 text-center">
                  <CheckCircle2 size={44} className="text-secondary" />
                  <h3 className="mt-4 font-display text-xl font-bold text-ink">
                    Enquiry received
                  </h3>
                  <p className="mt-2 font-body text-sm text-ink-soft">
                    Our admissions team will reach out within 1 business day.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <h3 className="font-display text-xl font-bold text-ink">
                    Request a callback
                  </h3>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-ink">Parent / Guardian name</label>
                    <input
                      required
                      placeholder="e.g. Robert Doe"
                      {...register('parent_name', { required: 'Name is required' })}
                      className="w-full rounded-xl border border-ink/10 bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 focus:border-primary focus:outline-none"
                    />
                    {errors.parent_name && <p className="mt-1 text-xs text-red-500">{errors.parent_name.message}</p>}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-ink">Phone number</label>
                    <input
                      required
                      type="tel"
                      placeholder="+91 98765 43210"
                      {...register('parent_phone', { required: 'Phone number is required' })}
                      className="w-full rounded-xl border border-ink/10 bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 focus:border-primary focus:outline-none"
                    />
                    {errors.parent_phone && <p className="mt-1 text-xs text-red-500">{errors.parent_phone.message}</p>}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-ink">Email address</label>
                    <input
                      required
                      type="email"
                      placeholder="you@email.com"
                      {...register('parent_email', { required: 'Email is required' })}
                      className="w-full rounded-xl border border-ink/10 bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 focus:border-primary focus:outline-none"
                    />
                    {errors.parent_email && <p className="mt-1 text-xs text-red-500">{errors.parent_email.message}</p>}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-ink">
                      Program of interest
                    </label>
                    <select
                      required
                      {...register('program_of_interest', { required: 'Program is required' })}
                      className="w-full rounded-xl border border-ink/10 bg-surface px-4 py-2.5 text-sm text-ink focus:border-primary focus:outline-none"
                    >
                      <option value="">Select a program</option>
                      {academicPrograms.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                    {errors.program_of_interest && <p className="mt-1 text-xs text-red-500">{errors.program_of_interest.message}</p>}
                  </div>
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-sub text-sm font-semibold text-white shadow-card transition-all hover:bg-primary-600 hover:shadow-card-hover active:scale-[0.98] disabled:opacity-60"
                  >
                    {loading ? 'Submitting…' : 'Submit Enquiry'}
                    {!loading && <Send size={16} />}
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}

