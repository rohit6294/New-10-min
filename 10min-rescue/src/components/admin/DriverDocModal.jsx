import { useState, useEffect } from 'react'

const DOC_TYPES = [
  { key: 'aadhaar_front',  label: 'Aadhaar Front' },
  { key: 'aadhaar_back',   label: 'Aadhaar Back' },
  { key: 'license_front',  label: 'License Front' },
  { key: 'license_back',   label: 'License Back' },
  { key: 'vehicle_photo',  label: 'Vehicle Photo' },
]

export default function DriverDocModal({ driver, onClose, onApprove, onReject, approving, rejecting }) {
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectInput, setShowRejectInput] = useState(false)
  const [imgErrors, setImgErrors] = useState({})

  // Close on Escape
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  function handleRejectSubmit() {
    if (!rejectReason.trim()) return
    onReject(driver, rejectReason.trim())
    onClose()
  }

  const docs = driver.documents || {}

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-navy">Driver Documents</h2>
            <p className="text-sm text-gray-500 mt-0.5">{driver.name} · {driver.phone}</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Document grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Driver info strip */}
          <div className="flex flex-wrap gap-4 mb-6 text-sm">
            <div className="bg-gray-50 rounded-xl px-4 py-2">
              <span className="text-gray-400 text-xs font-medium block">Vehicle No.</span>
              <span className="text-navy font-semibold">{driver.vehicleNumber || '—'}</span>
            </div>
            <div className="bg-gray-50 rounded-xl px-4 py-2">
              <span className="text-gray-400 text-xs font-medium block">License No.</span>
              <span className="text-navy font-semibold">{driver.licenseNumber || '—'}</span>
            </div>
            <div className="bg-gray-50 rounded-xl px-4 py-2">
              <span className="text-gray-400 text-xs font-medium block">Status</span>
              <span className={`font-semibold capitalize ${
                driver.verificationStatus === 'verified' ? 'text-green-600'
                : driver.verificationStatus === 'rejected' ? 'text-red-600'
                : 'text-amber-600'
              }`}>{driver.verificationStatus || 'pending'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {DOC_TYPES.map(({ key, label }) => {
              const rawValue = docs[key]
              // Documents are stored as raw base64 strings (no data: prefix)
              // Build a proper data URI for display
              const imgSrc = rawValue
                ? (rawValue.startsWith('data:') ? rawValue : `data:image/jpeg;base64,${rawValue}`)
                : null
              const hasError = imgErrors[key]
              return (
                <div key={key} className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-gray-600">{label}</span>
                  {imgSrc && !hasError ? (
                    <div className="group relative rounded-xl overflow-hidden border border-gray-200 aspect-[4/3] bg-gray-50 hover:border-blue-400 transition-colors cursor-pointer"
                      onClick={() => {
                        const w = window.open()
                        w.document.write(`<html><body style="margin:0;background:#000;display:flex;align-items:center;justify-content:center;min-height:100vh"><img src="${imgSrc}" style="max-width:100%;max-height:100vh;object-fit:contain"/></body></html>`)
                        w.document.close()
                      }}
                    >
                      <img
                        src={imgSrc}
                        alt={label}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        onError={() => setImgErrors(prev => ({ ...prev, [key]: true }))}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                        </svg>
                      </div>
                      <span className="absolute bottom-1 right-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">click to enlarge</span>
                    </div>
                  ) : (
                    <div className="rounded-xl border-2 border-dashed border-gray-200 aspect-[4/3] bg-gray-50 flex flex-col items-center justify-center gap-2 text-gray-400">
                      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                      <span className="text-xs font-medium">Not uploaded</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer actions — only for pending */}
        {driver.verificationStatus === 'pending' && (
          <div className="border-t border-gray-100 px-6 py-4 bg-gray-50/50">
            {!showRejectInput ? (
              <div className="flex gap-3">
                <button
                  onClick={() => { onApprove(driver.id); onClose() }}
                  disabled={approving}
                  className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  {approving ? (
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                  Approve Driver
                </button>
                <button
                  onClick={() => setShowRejectInput(true)}
                  disabled={rejecting}
                  className="flex-1 bg-emergency hover:bg-emergency-dark disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Reject Driver
                </button>
                <button
                  onClick={onClose}
                  className="px-5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold py-2.5 rounded-xl transition-colors text-sm"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Rejection reason</label>
                <textarea
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  placeholder="e.g. Documents are blurry, please re-upload..."
                  rows={2}
                  className="w-full text-sm px-3 py-2 rounded-xl border border-red-200 focus:outline-none focus:ring-2 focus:ring-emergency/30 focus:border-emergency text-navy placeholder-gray-400 resize-none"
                />
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={handleRejectSubmit}
                    disabled={rejecting || !rejectReason.trim()}
                    className="flex-1 bg-emergency hover:bg-emergency-dark disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
                  >
                    {rejecting ? 'Rejecting...' : 'Confirm Reject'}
                  </button>
                  <button
                    onClick={() => { setShowRejectInput(false); setRejectReason('') }}
                    className="px-5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold py-2.5 rounded-xl transition-colors text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Close button for non-pending */}
        {driver.verificationStatus !== 'pending' && (
          <div className="border-t border-gray-100 px-6 py-4 bg-gray-50/50">
            <button
              onClick={onClose}
              className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-2.5 rounded-xl transition-colors text-sm"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
