export default function AdminStatsBar({ drivers = [], hospitals = [], requests = [] }) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const pendingVerification = drivers.filter(
    d => d.verificationStatus === 'pending' && d.documents && Object.keys(d.documents).length > 0
  ).length

  const totalDrivers = drivers.length

  const onlineDrivers = drivers.filter(d => d.isOnline).length

  const totalHospitals = hospitals.length

  const requestsToday = requests.filter(r => {
    if (!r.createdAt) return false
    const ts = r.createdAt.toDate ? r.createdAt.toDate() : new Date(r.createdAt)
    return ts >= today
  }).length

  const stats = [
    {
      label: 'Pending Verification',
      value: pendingVerification,
      urgent: pendingVerification > 0,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      label: 'Total Drivers',
      value: totalDrivers,
      urgent: false,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      label: 'Online Drivers',
      value: onlineDrivers,
      urgent: false,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
        </svg>
      ),
    },
    {
      label: 'Total Hospitals',
      value: totalHospitals,
      urgent: false,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21" />
        </svg>
      ),
    },
    {
      label: "Requests Today",
      value: requestsToday,
      urgent: false,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
      ),
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`bg-white rounded-2xl p-4 shadow-sm border transition-all ${
            stat.urgent
              ? 'border-emergency/40 shadow-emergency/20 shadow-md ring-1 ring-emergency/30'
              : 'border-gray-100'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                stat.urgent ? 'bg-emergency/10 text-emergency' : 'bg-accent-blue/10 text-accent-blue'
              }`}
            >
              {stat.icon}
            </div>
            {stat.urgent && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emergency bg-emergency/10 px-2 py-0.5 rounded-full animate-pulse">
                Alert
              </span>
            )}
          </div>
          <div className={`text-2xl font-bold ${stat.urgent ? 'text-emergency' : 'text-navy'}`}>
            {stat.value}
          </div>
          <div className="text-xs text-gray-500 mt-0.5 font-medium">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}
