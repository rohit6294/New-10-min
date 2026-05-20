function timeAgo(ts) {
  if (!ts) return ''
  const date = ts?.toDate ? ts.toDate() : new Date(ts)
  const diff = Math.floor((Date.now() - date.getTime()) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return date.toLocaleString()
}

const COLOR_MAP = {
  red: 'bg-red-100 text-red-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  blue: 'bg-blue-100 text-blue-700',
  green: 'bg-green-100 text-green-700',
  purple: 'bg-purple-100 text-purple-700',
  indigo: 'bg-indigo-100 text-indigo-700',
  gray: 'bg-gray-100 text-gray-600',
}

export default function RequestModal({ request, statusLabels, onClose, onAccept, accepting }) {
  const statusInfo = statusLabels[request.status] || { label: request.status, color: 'gray' }
  const colorCls = COLOR_MAP[statusInfo.color]
  const isIncoming = request.status === 'hospital_assigned'

  const lat = request.patientLocation?.latitude
  const lng = request.patientLocation?.longitude
  const mapsUrl = lat && lng
    ? `https://www.google.com/maps?q=${lat},${lng}`
    : null

  const timeline = [
    { label: 'Request Created', time: request.createdAt, icon: '📋' },
    request.assignedDriverId && { label: 'Driver Assigned', time: request.driverAssignedAt, icon: '🚑' },
    request.status === 'patient_picked_up' && { label: 'Patient Picked Up', time: request.pickedUpAt, icon: '✅' },
    request.assignedHospitalId && { label: 'Hospital Accepted', time: request.hospitalAcceptedAt, icon: '🏥' },
    request.status === 'completed' && { label: 'Completed', time: request.completedAt, icon: '🎉' },
  ].filter(Boolean)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-3xl px-6 pt-6 pb-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-navy">Request Details</h2>
            <p className="text-xs text-gray-400">ID: {request.id?.slice(0, 12)}...</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${colorCls}`}>
              {statusInfo.label}
            </span>
            <span className="text-xs text-gray-400">{timeAgo(request.createdAt)}</span>
          </div>

          {/* Patient Info */}
          <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Patient Information</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emergency/10 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-emergency" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-navy">{request.patientName || 'Unknown'}</p>
                <a href={`tel:${request.patientPhone}`} className="text-sm text-blue-600 hover:underline">
                  {request.patientPhone || 'No phone'}
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <p className="text-xs text-gray-400">Emergency Type</p>
                <p className="text-sm font-medium text-navy capitalize mt-0.5">{request.emergencyType || 'General'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Request ID</p>
                <p className="text-sm font-mono text-navy mt-0.5">{request.id?.slice(0, 8)}</p>
              </div>
            </div>
          </div>

          {/* Location */}
          {lat && lng && (
            <div className="bg-gray-50 rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Patient Location</h3>
              <p className="text-sm text-navy font-mono mb-3">{lat.toFixed(6)}, {lng.toFixed(6)}</p>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                Open in Google Maps
              </a>
            </div>
          )}

          {/* Timeline */}
          {timeline.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Timeline</h3>
              <div className="relative pl-6">
                {timeline.map((item, i) => (
                  <div key={i} className="relative mb-3 last:mb-0">
                    <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-[10px]">
                      {item.icon}
                    </div>
                    {i < timeline.length - 1 && (
                      <div className="absolute -left-4 top-5 bottom-0 w-0.5 bg-gray-100" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-navy">{item.label}</p>
                      <p className="text-xs text-gray-400">{timeAgo(item.time) || '—'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white rounded-b-3xl px-6 pb-6 pt-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 text-navy font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm"
          >
            Close
          </button>
          {isIncoming && onAccept && (
            <button
              onClick={onAccept}
              disabled={accepting}
              className="flex-1 bg-emergency hover:bg-emergency-dark text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2 text-sm"
            >
              {accepting ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Accepting...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Accept This Patient
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
