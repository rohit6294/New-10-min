import { useEffect, useRef, useState } from 'react'
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase'

const EMERGENCY_ICONS = {
  general: '🚨',
  cardiac: '❤️',
  accident: '🚗',
  breathing: '🫁',
  stroke: '🧠',
  maternity: '🤱',
}

const URGENCY_STYLE = {
  critical: { label: 'CRITICAL', cls: 'bg-red-600' },
  serious: { label: 'SERIOUS', cls: 'bg-amber-500' },
  stable: { label: 'STABLE', cls: 'bg-green-600' },
}

/**
 * Full-screen, repeating, sound + system-notification alert that appears
 * when an ambulance is assigned to this hospital. Stays visible until the
 * hospital staff explicitly acknowledges it (writes `hospitalAckAt` on the
 * request doc, so the server has a record that the alert was seen).
 */
export default function IncomingAlertOverlay({ request, onAcknowledged }) {
  const [ackBusy, setAckBusy] = useState(false)
  const audioCtxRef = useRef(null)
  const loopRef = useRef(null)
  const systemNotifRef = useRef(null)

  const urgency = URGENCY_STYLE[request.urgencyLevel] || URGENCY_STYLE.serious
  const emoji = EMERGENCY_ICONS[request.emergencyType] || '🚨'
  const lat = request.patientLocation?.latitude
  const lng = request.patientLocation?.longitude
  const mapsUrl = lat && lng ? `https://www.google.com/maps?q=${lat},${lng}` : null

  // Looping two-tone siren chime via WebAudio (no asset file required).
  useEffect(() => {
    function playOnce() {
      try {
        const Ctx = window.AudioContext || window.webkitAudioContext
        if (!Ctx) return
        let ctx = audioCtxRef.current
        if (!ctx || ctx.state === 'closed') {
          ctx = new Ctx()
          audioCtxRef.current = ctx
        }
        const now = ctx.currentTime
        ;[0, 0.28, 0.56].forEach((offset, i) => {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = 'sine'
          osc.frequency.value = i % 2 === 0 ? 880 : 1175
          gain.gain.setValueAtTime(0.0001, now + offset)
          gain.gain.exponentialRampToValueAtTime(0.45, now + offset + 0.02)
          gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.25)
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.start(now + offset)
          osc.stop(now + offset + 0.28)
        })
      } catch (_) { /* autoplay blocked — chime silently skipped */ }
    }
    playOnce()
    loopRef.current = setInterval(playOnce, 3500)
    return () => {
      if (loopRef.current) clearInterval(loopRef.current)
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {})
      }
    }
  }, [request.id])

  // System-level browser notification (works when tab is unfocused).
  useEffect(() => {
    if (typeof Notification === 'undefined') return
    if (Notification.permission !== 'granted') return
    try {
      const n = new Notification('🚨 Ambulance incoming', {
        body: `${request.patientName || 'A patient'} — ${urgency.label} ${request.emergencyType || ''}`.trim(),
        tag: `incoming-${request.id}`,
        renotify: true,
        requireInteraction: true,
      })
      systemNotifRef.current = n
      n.onclick = () => {
        window.focus()
        n.close()
      }
    } catch (_) { /* notifications may be blocked — silently skip */ }
    return () => {
      if (systemNotifRef.current) {
        try { systemNotifRef.current.close() } catch (_) {}
      }
    }
  }, [request.id])

  async function handleAck() {
    setAckBusy(true)
    try {
      await updateDoc(doc(db, 'rescue_requests', request.id), {
        hospitalAckAt: serverTimestamp(),
        hospitalAckBy: 'staff', // generic — uid is implicit from the auth context
        updatedAt: serverTimestamp(),
      })
      if (loopRef.current) clearInterval(loopRef.current)
      onAcknowledged?.()
    } catch (e) {
      console.error('Acknowledge failed:', e)
      // Even on failure, dismiss the overlay client-side so staff can work.
      onAcknowledged?.()
    } finally {
      setAckBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Pulsing red banner */}
        <div className={`${urgency.cls} px-6 py-4 text-white flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <span className="text-3xl animate-pulse">🚨</span>
            <div>
              <p className="text-xs uppercase tracking-widest opacity-90">Ambulance Incoming</p>
              <p className="font-extrabold text-xl">{urgency.label}</p>
            </div>
          </div>
          <span className="text-white/80 text-xs font-mono">#{request.id?.slice(0, 6)}</span>
        </div>

        <div className="p-6 space-y-5">
          {/* Patient */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-3xl shrink-0">
              {emoji}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-navy text-lg truncate">{request.patientName || 'Unknown patient'}</p>
              {request.patientPhone && (
                <a href={`tel:${request.patientPhone}`} className="text-sm text-blue-600 hover:underline font-medium">
                  📞 {request.patientPhone}
                </a>
              )}
            </div>
          </div>

          {/* Emergency / bed type */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">Emergency</p>
              <p className="font-bold text-navy capitalize mt-0.5">{request.emergencyType || 'General'}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">Bed needed</p>
              <p className="font-bold text-navy mt-0.5">
                {request.requestedBedType === 'icu' ? '🛏️ ICU'
                  : request.requestedBedType === 'advanced' ? '🛏️ Advanced'
                  : request.requestedBedType === 'normal' ? '🛏️ Normal'
                  : '—'}
              </p>
            </div>
          </div>

          {/* Driver info if assigned */}
          {request.driverName && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center gap-3">
              <span className="text-2xl">🚑</span>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-blue-700 uppercase tracking-widest">Driver</p>
                <p className="font-semibold text-navy truncate">{request.driverName}</p>
                {request.driverPhone && (
                  <a href={`tel:${request.driverPhone}`} className="text-xs text-blue-700 hover:underline">
                    {request.driverPhone}
                  </a>
                )}
              </div>
              {request.vehicleNumber && (
                <span className="text-xs font-mono bg-white border border-blue-200 px-2 py-1 rounded">
                  {request.vehicleNumber}
                </span>
              )}
            </div>
          )}

          {/* Maps */}
          {mapsUrl && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors py-3 rounded-xl"
            >
              📍 Patient pickup on Google Maps
            </a>
          )}

          {/* Acknowledge */}
          <button
            onClick={handleAck}
            disabled={ackBusy}
            className="w-full bg-emergency hover:bg-emergency-dark text-white font-extrabold py-4 rounded-2xl text-base disabled:opacity-60 shadow-lg shadow-emergency/30 transition-all flex items-center justify-center gap-2"
          >
            {ackBusy ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Acknowledging…
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Acknowledge &amp; Prepare
              </>
            )}
          </button>

          <p className="text-center text-xs text-gray-400">
            The alert will keep ringing until acknowledged.
          </p>
        </div>
      </div>
    </div>
  )
}
