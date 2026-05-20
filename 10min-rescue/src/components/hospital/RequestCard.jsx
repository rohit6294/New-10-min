const COLOR_MAP = {
  red: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' },
  yellow: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', dot: 'bg-yellow-500' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
  green: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', dot: 'bg-indigo-500' },
  gray: { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200', dot: 'bg-gray-400' },
}

function timeAgo(ts) {
  if (!ts) return ''
  const date = ts?.toDate ? ts.toDate() : new Date(ts)
  const diff = Math.floor((Date.now() - date.getTime()) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return date.toLocaleDateString()
}

const EMERGENCY_ICONS = {
  general: '🚨',
  cardiac: '❤️',
  accident: '🚗',
  breathing: '🫁',
  stroke: '🧠',
  maternity: '🤱',
}

export default function RequestCard({ request, statusLabels, onView, onAccept, accepting }) {
  const statusInfo = statusLabels[request.status] || { label: request.status, color: 'gray' }
  const colors = COLOR_MAP[statusInfo.color]
  const isIncoming = request.status === 'hospital_assigned'
  const emoji = EMERGENCY_ICONS[request.emergencyType] || '🚨'

  return (
    <div
      className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all overflow-hidden ${
        isIncoming ? 'border-red-200 ring-2 ring-red-100' : 'border-gray-100'
      }`}
    >
      {/* Top bar */}
      <div className={`px-4 py-2.5 flex items-center justify-between ${isIncoming ? 'bg-red-50' : 'bg-gray-50'}`}>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${colors.dot} ${isIncoming ? 'animate-pulse' : ''}`} />
          <span className={`text-xs font-semibold ${colors.text}`}>{statusInfo.label}</span>
        </div>
        <span className="text-xs text-gray-400">{timeAgo(request.createdAt)}</span>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-xl shrink-0">
            {emoji}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-navy truncate">{request.patientName || 'Unknown Patient'}</p>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              {request.patientPhone || 'No phone'}
            </p>
          </div>
        </div>

        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <svg className="w-3.5 h-3.5 text-emergency shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            {request.patientLocation
              ? `${request.patientLocation.latitude?.toFixed(4)}, ${request.patientLocation.longitude?.toFixed(4)}`
              : 'Location unavailable'}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <svg className="w-3.5 h-3.5 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
            </svg>
            <span className="capitalize">{request.emergencyType || 'General'} Emergency</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onView}
            className="flex-1 border border-gray-200 text-navy text-sm font-medium py-2 rounded-xl hover:bg-gray-50 transition-colors"
          >
            View Details
          </button>
          {isIncoming && onAccept && (
            <button
              onClick={onAccept}
              disabled={accepting}
              className="flex-1 bg-emergency hover:bg-emergency-dark text-white text-sm font-semibold py-2 rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-1.5"
            >
              {accepting ? (
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              )}
              {accepting ? 'Accepting...' : 'Accept'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
