const features = [
  {
    title: '3 Ambulance Types',
    badge: 'A · B · C',
    description: 'Pick the right vehicle: ICU (life support), Advanced (oxygen, defib), or Normal (transport). Drivers only see matching requests.',
    gradient: 'from-red-500 to-red-600',
    iconBg: 'bg-red-50',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
  },
  {
    title: 'Live Hospital Beds',
    badge: 'Real-time',
    description: 'See nearby hospitals with available beds for your ambulance type, sorted by rating + distance. Updated by hospitals in real-time.',
    gradient: 'from-blue-500 to-blue-600',
    iconBg: 'bg-blue-50',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
  },
  {
    title: 'Live Tracking',
    badge: 'GPS Updates',
    description: 'Patient sees driver\'s live position on map. Hospital tracks ambulance approaching. Real-time updates every 4 seconds.',
    gradient: 'from-green-500 to-emerald-600',
    iconBg: 'bg-emerald-50',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
  },
  {
    title: 'Verified Drivers',
    badge: 'KYC Approved',
    description: 'Every driver uploads license, RC, insurance, and Aadhaar. Admin verifies before they can go online.',
    gradient: 'from-amber-500 to-orange-500',
    iconBg: 'bg-amber-50',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    title: 'Hospital Pre-Alert',
    badge: 'Auto-notified',
    description: 'Selected hospital is auto-notified the moment a driver accepts. Bed gets prepared while ambulance is still en route.',
    gradient: 'from-purple-500 to-violet-600',
    iconBg: 'bg-purple-50',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
      </svg>
    ),
  },
  {
    title: 'Color-Coded Urgency',
    badge: 'Critical · Serious · Stable',
    description: 'Red, amber, or green. Driver popup matches urgency so they immediately know what they\'re responding to.',
    gradient: 'from-rose-500 to-red-600',
    iconBg: 'bg-rose-50',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
  },
]

export default function Features() {
  return (
    <section id="features" className="py-16 sm:py-24 bg-light-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 fade-in">
          <span className="inline-block text-brand-red font-semibold text-sm tracking-wider uppercase mb-3">
            What You Get
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy mb-4 leading-tight">
            Built for Emergencies
          </h2>
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto">
            Every feature is designed with one goal — saving precious time when it matters most.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-7">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="fade-in group relative bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              {/* Subtle gradient bg on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity`} />

              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg`}>
                    {feature.icon}
                  </div>
                  <span className={`text-[10px] font-bold tracking-widest uppercase ${feature.iconBg} px-2 py-1 rounded-md text-navy/60`}>
                    {feature.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-navy mb-2">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
