import { useState } from 'react'

function StatusBadge({ status }) {
  const map = {
    pending:  { bg: 'bg-amber-100',  text: 'text-amber-700',  label: 'Pending' },
    verified: { bg: 'bg-green-100',  text: 'text-green-700',  label: 'Verified' },
    rejected: { bg: 'bg-red-100',    text: 'text-red-700',    label: 'Rejected' },
  }
  const s = map[status] ?? map.pending
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.text.replace('text', 'bg')}`} />
      {s.label}
    </span>
  )
}

export default function DriverVerificationCard({
  driver,
  onApprove,
  onReject,
  approving,
  rejecting,
  onViewDocs,
}) {
  const [showRejectInput, setShowRejectInput] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  const submittedAt = driver.createdAt
    ? (driver.createdAt.toDate ? driver.createdAt.toDate() : new Date(driver.createdAt)).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
      })
    : '—'

  const docCount = driver.documents ? Object.keys(driver.documents).length : 0

  function handleRejectSubmit() {
    if (!rejectReason.trim()) return
    onReject(driver, rejectReason.trim())
    setShowRejectInput(false)
    setRejectReason('')
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center text-navy font-bold text-base">
            {driver.name?.charAt(0)?.toUpperCase() ?? '?'}
          </div>
          <div>
            <div className="font-semibold text-navy text-sm">{driver.name || '—'}</div>
            <div className="text-xs text-gray-500">{driver.phone || '—'}</div>
          </div>
        </div>
        <StatusBadge status={driver.verificationStatus} />
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
        <div>
          <span className="text-gray-400 font-medium">Vehicle No.</span>
          <div className="text-navy font-semibold mt-0.5">{driver.vehicleNumber || '—'}</div>
        </div>
        <div>
          <span className="text-gray-400 font-medium">License No.</span>
          <div className="text-navy font-semibold mt-0.5">{driver.licenseNumber || '—'}</div>
        </div>
        <div>
          <span className="text-gray-400 font-medium">Submitted</span>
          <div className="text-navy font-semibold mt-0.5">{submittedAt}</div>
        </div>
        <div>
          <span className="text-gray-400 font-medium">Documents</span>
          <div className="text-navy font-semibold mt-0.5">{docCount} uploaded</div>
        </div>
      </div>

      {/* Rejection reason if already rejected */}
      {driver.verificationStatus === 'rejected' && driver.rejectionReason && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-3 py-2 text-xs text-red-700">
          <span className="font-semibold">Reason: </span>{driver.rejectionReason}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <button
          onClick={() => onViewDocs(driver)}
          className="w-full flex items-center justify-center gap-2 text-sm font-medium text-accent-blue border border-accent-blue/30 hover:bg-accent-blue/5 rounded-xl py-2 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          View Documents
        </button>

        {driver.verificationStatus === 'pending' && (
          <>
            {!showRejectInput ? (
              <div className="flex gap-2">
                <button
                  onClick={() => onApprove(driver.id)}
                  disabled={approving}
                  className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white text-sm font-semibold py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5"
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
                  Approve
                </button>
                <button
                  onClick={() => setShowRejectInput(true)}
                  disabled={rejecting}
                  className="flex-1 bg-emergency hover:bg-emergency-dark disabled:opacity-60 text-white text-sm font-semibold py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Reject
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <textarea
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  placeholder="Enter rejection reason..."
                  rows={2}
                  className="w-full text-sm px-3 py-2 rounded-xl border border-red-200 focus:outline-none focus:ring-2 focus:ring-emergency/30 focus:border-emergency text-navy placeholder-gray-400 resize-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleRejectSubmit}
                    disabled={rejecting || !rejectReason.trim()}
                    className="flex-1 bg-emergency hover:bg-emergency-dark disabled:opacity-60 text-white text-sm font-semibold py-2 rounded-xl transition-colors"
                  >
                    {rejecting ? 'Rejecting...' : 'Confirm Reject'}
                  </button>
                  <button
                    onClick={() => { setShowRejectInput(false); setRejectReason('') }}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-semibold py-2 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
