import { useState } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

const URGENCIES = [
  { id: 'critical', label: 'Critical', color: 'red' },
  { id: 'serious', label: 'Serious', color: 'amber' },
  { id: 'stable', label: 'Stable', color: 'green' },
]

const TYPES = [
  { id: 'A', label: 'ICU' },
  { id: 'B', label: 'Advanced' },
  { id: 'C', label: 'Normal' },
]

const COLOR_MAP = {
  red: { bg: 'bg-red-500', bgLight: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500' },
  amber: { bg: 'bg-amber-500', bgLight: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500' },
  green: { bg: 'bg-green-500', bgLight: 'bg-green-500/10', text: 'text-green-500', border: 'border-green-500' },
}

export default function CallbackPage() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [description, setDescription] = useState('')
  const [ambulanceType, setAmbulanceType] = useState('C')
  const [urgency, setUrgency] = useState('stable')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function submit() {
    if (!name.trim() || !phone.trim()) {
      setError('Name and phone are required')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await addDoc(collection(db, 'callback_requests'), {
        patientName: name.trim(),
        patientPhone: phone.trim(),
        emergencyDescription: description.trim(),
        ambulanceType,
        urgencyLevel: urgency,
        status: 'pending_call',
        adminNote: '',
        createdAt: serverTimestamp(),
      })
      setDone(true)
    } catch (e) {
      console.error(e)
      setError('Could not submit. Please call us directly: +91 78660 67136')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-navy text-white flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center">
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-14 h-14 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-green-400 mb-3">Got it!</h1>
          <p className="text-white/70 mb-6">
            Our team will call you within <strong className="text-white">2 minutes</strong> at <strong className="text-white">{phone}</strong>
          </p>
          <a
            href="tel:+917866067136"
            className="block w-full bg-brand-red hover:bg-brand-red-dark text-white font-bold py-3.5 rounded-2xl transition-all"
          >
            📞 Or call us now: +91 78660 67136
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-navy" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-red/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-md mx-auto min-h-screen flex flex-col px-4 py-6 sm:py-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 brand-icon">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <div className="text-base font-bold leading-tight">10Min<span className="text-brand-red">Rescue</span></div>
              <div className="text-[11px] text-white/60 uppercase tracking-widest">Request Callback</div>
            </div>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">We'll call you back</h1>
        <p className="text-white/60 text-sm mb-6">
          Fill the form, and our dispatcher calls within 2 minutes
        </p>

        <div className="space-y-4 flex-1">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-white/50 mb-1.5">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-brand-red focus:bg-white/10 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-white/50 mb-1.5">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 9876543210"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-brand-red focus:bg-white/10 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-white/50 mb-1.5">Describe Emergency (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What kind of help do you need?"
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-brand-red focus:bg-white/10 transition-colors resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-white/50 mb-1.5">Ambulance Type</label>
            <div className="grid grid-cols-3 gap-2">
              {TYPES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setAmbulanceType(t.id)}
                  className={`py-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                    ambulanceType === t.id
                      ? 'bg-brand-red/15 border-brand-red text-white'
                      : 'bg-white/5 border-white/10 text-white/70'
                  }`}
                >
                  {t.id} · {t.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-white/50 mb-1.5">Urgency</label>
            <div className="grid grid-cols-3 gap-2">
              {URGENCIES.map(u => {
                const c = COLOR_MAP[u.color]
                const selected = urgency === u.id
                return (
                  <button
                    key={u.id}
                    onClick={() => setUrgency(u.id)}
                    className={`py-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                      selected ? `${c.bgLight} ${c.border} ${c.text}` : 'bg-white/5 border-white/10 text-white/70'
                    }`}
                  >
                    {u.label}
                  </button>
                )
              })}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-brand-red/10 border border-brand-red/30 rounded-xl text-brand-red text-sm">
              {error}
            </div>
          )}
        </div>

        <div className="pt-6 space-y-3">
          <button
            onClick={submit}
            disabled={submitting}
            className="w-full bg-brand-red hover:bg-brand-red-dark text-white font-bold py-4 rounded-2xl transition-colors text-base disabled:opacity-60"
          >
            {submitting ? 'Submitting...' : 'Request Callback →'}
          </button>
          <a
            href="tel:+917866067136"
            className="block text-center text-white/50 hover:text-white text-sm py-2"
          >
            Or call us now: +91 78660 67136
          </a>
        </div>
      </div>
    </div>
  )
}
