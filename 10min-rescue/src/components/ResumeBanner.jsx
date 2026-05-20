import { useState, useEffect } from 'react'

export default function ResumeBanner() {
  const [sosId, setSosId] = useState(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    try {
      const id = localStorage.getItem('lastSosId')
      const createdAt = parseInt(localStorage.getItem('lastSosCreatedAt') || '0', 10)
      // Only show if SOS is < 2 hours old
      if (id && Date.now() - createdAt < 2 * 60 * 60 * 1000) {
        setSosId(id)
      }
    } catch (_) {}
  }, [])

  if (!sosId || dismissed) return null

  return (
    <div className="fixed top-16 sm:top-20 left-2 right-2 sm:left-4 sm:right-4 z-40 max-w-md mx-auto">
      <div className="bg-brand-red text-white rounded-2xl shadow-2xl shadow-brand-red/40 p-3 sm:p-4 flex items-center gap-3 animate-pulse-glow">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl shrink-0">
          📍
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm leading-tight">Active SOS in progress</div>
          <div className="text-xs text-white/80">Tap to view live tracking</div>
        </div>
        <a
          href={`/track/${sosId}`}
          className="bg-white text-brand-red font-bold text-xs px-3 py-2 rounded-lg shrink-0 hover:bg-white/90"
        >
          Track →
        </a>
        <button
          onClick={() => {
            setDismissed(true)
            try {
              localStorage.removeItem('lastSosId')
              localStorage.removeItem('lastSosCreatedAt')
            } catch (_) {}
          }}
          className="w-8 h-8 hover:bg-white/10 rounded-lg flex items-center justify-center shrink-0"
          aria-label="Dismiss"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
